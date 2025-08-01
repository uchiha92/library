import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Book } from '../../../core/models/book';
import { GENRES } from '../../constants/genres.constants';
import { IdUtils } from '../../utils/id.utils';
import { DIALOG_CONSTANTS } from '../../constants/dialog.constants';

export interface BookFormDialogConfig {
  title?: string;
  book?: Book;
  actionCallback: (book: Book) => Observable<any>;
}

@Component({
  selector: 'app-book-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './book-form-dialog.component.html',
  styleUrl: './book-form-dialog.component.css',
})
export class BookFormDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<BookFormDialogComponent>);
  readonly data = inject<BookFormDialogConfig>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  bookForm!: FormGroup;
  isEditMode = false;
  genres: readonly string[] = GENRES;


  ngOnInit(): void {
    this.isEditMode = !!this.data.book;
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const book: Partial<Book> = this.data.book ?? {};

    this.bookForm = this.fb.group({
      title: [book.title ?? '', [Validators.required, Validators.minLength(2)]],
      author: [
        book.author ?? '',
        [Validators.required, Validators.minLength(2)],
      ],
      year: [
        book.year ?? new Date().getFullYear(),
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(new Date().getFullYear() + 1),
        ],
      ],
      genre: [book.genre ?? '', Validators.required],
      description: [
        book.description ?? '',
        [Validators.required, Validators.minLength(10)],
      ],
    });
  }

  onSave(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      const book: Book = {
        id: this.isEditMode 
          ? this.data.book!.id 
          : IdUtils.generateId('book'),
        ...formValue,
      };

      this.data.actionCallback(book)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
        next: (result) => {
          if (result?.errors) {
            this.dialogRef.close({ success: false, businessError: result.errors });
          } else {
            this.dialogRef.close({ success: true, book: result });
          }
        },
        error: (httpError) => {
          this.dialogRef.close({ success: false, httpError: true });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false, cancelled: true });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach((key) => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.bookForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be at least ${requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return 'Year must be at least 1000';
    }
    if (control?.hasError('max')) {
      return 'Year cannot be in the future';
    }
    return '';
  }

  static openDialog(
    dialog: MatDialog, 
    actionCallback: (book: Book) => Observable<any>,
    book?: Book,
    customTitle?: string
  ): Observable<any> {
    const isEditMode = !!book;
    const defaultTitle = isEditMode ? 'Edit Book' : 'Add New Book';
    
    const dialogConfig = {
      ...DIALOG_CONSTANTS.FORM_CONFIG,
      data: {
        title: customTitle ?? defaultTitle,
        book,
        actionCallback
      } as BookFormDialogConfig
    };

    const dialogRef = dialog.open(BookFormDialogComponent, dialogConfig);

    return dialogRef.afterClosed().pipe(
      filter(result => result && !result.cancelled && !result.httpError),
      map(result => {
        if (result.businessError) {
          return { success: false, businessError: result.businessError };
        } else {
          return { success: true, book: result.book };
        }
      })
    );
  }
}
