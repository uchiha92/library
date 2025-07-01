import { Component, inject, OnInit } from '@angular/core';
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
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BookFormDialogData } from '../../../core/models/book-form-dialog-data';
import { Book } from '../../../core/models/book';
import { HttpBookService } from '../../../core/services/httpBookService/http-book.service';
import { GENRES } from '../../constants/genres.constants';

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
export class BookFormDialogComponent implements OnInit {
  private readonly httpBookService = inject(HttpBookService);
  private readonly dialogRef = inject(MatDialogRef<BookFormDialogComponent>);
  readonly data = inject<BookFormDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  bookForm!: FormGroup;
  isEditMode = false;
  genres: readonly string[] = GENRES;


  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.initializeForm();
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

      const result = {
        action: 'save',
        book: {
          id: this.data.book?.id ?? this.generateId(),
          ...formValue,
        } as Book,
      };

      this.dialogRef.close(result);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    const result = {
      action: 'cancel',
    };
    this.dialogRef.close(result);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach((key) => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateId(): string {
    return (
      'book_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
    );
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
}
