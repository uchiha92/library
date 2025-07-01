import { Component, inject, OnInit, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HttpBookService } from '../../../../core/services/httpBookService/http-book.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DIALOG_CONSTANTS } from '../../../../shared/constants/dialog.constants';
import { BookFormDialogComponent } from '../../../../shared/components/book-form-dialog/book-form-dialog.component';

@Component({
  selector: 'app-book-detail',
  imports: [
    MatCardModule,
    RouterModule,
    MatToolbarModule,
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatDialogModule,
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent implements OnInit {
  private readonly httpBookService = inject(HttpBookService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  private readonly books$ = this.httpBookService._books;
  
  idParam: string | null = null;

  readonly book$ = computed(() => {
    if (!this.idParam) return null;
    return this.books$().find(book => book.id === this.idParam) || undefined;
  });

  ngOnInit(): void {
    this.idParam = this.route.snapshot.paramMap.get('id');

    if (this.books$().length === 0) {
      this.httpBookService.getBooks();
    }
  }

  deleteBook(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_CONSTANTS.DEFAULT_CONFIG,
      data: DIALOG_CONSTANTS.GENERIC_DELETE_DIALOG,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.httpBookService.deleteBook(id).subscribe({
          next: () => {
            console.log('Book deleted successfully');
            this.router.navigate(['/']);
          },
          error: (error: any) => {
            console.error('Error deleting book:', error);
          },
        });
      }
    });
  }

  isLoading(): boolean {
    return this.books$().length === 0;
  }

  bookNotFound(): boolean {
    return this.books$().length > 0 && this.book$() === undefined;
  }

  editBook(id: string): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      ...DIALOG_CONSTANTS.FORM_CONFIG,
      data: {
        title: 'Edit Book',
        book: this.book$(),
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'save' && result.book) {
        this.httpBookService.updateBook(result.book.id, result.book).subscribe({
          next: (updatedBook) => {
            console.log('Book updated successfully:', updatedBook);
          },
          error: (error) => {
            console.error('Error updating book:', error);
          },
        });
      }
    });
  }
}
