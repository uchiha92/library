import { Component, inject, OnInit, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { BookFormDialogComponent } from '../../../../shared/components/book-form-dialog/book-form-dialog.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';
import { DIALOG_CONSTANTS } from '../../../../shared/constants/dialog.constants';

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
  private readonly bookService = inject(BOOK_SERVICE_TOKEN) as any;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  private readonly books$ = this.bookService._books;
  
  idParam: string | null = null;

  readonly book$ = computed(() => {
    if (!this.idParam) return null;
    return this.books$().find((book: any) => book.id === this.idParam) ?? undefined;
  });

  ngOnInit(): void {
    this.idParam = this.route.snapshot.paramMap.get('id');

    if (this.books$().length === 0) {
      this.bookService.getBooks();
    }
  }

  deleteBook(id: string): void {
    const deleteDialogData = {
      ...DIALOG_CONSTANTS.GENERIC_DELETE_DIALOG,
      title: 'Delete book',
      message: 'Are you sure you want to delete this book? This action cannot be undone.'
    };

    ConfirmationDialogComponent.openDialog(
      this.dialog, 
      () => this.bookService.deleteBook(id),
      deleteDialogData
    ).subscribe({
      next: (result: any) => {
        if (result.success) {
          console.log('Book deleted');
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => console.error('error:', error)
    });
  }

  isLoading(): boolean {
    return this.books$().length === 0;
  }

  bookNotFound(): boolean {
    return this.books$().length > 0 && this.book$() === undefined;
  }

  editBook(id: string): void {
    const currentBook = this.book$();
    if (currentBook) {
      BookFormDialogComponent.openDialog(
        this.dialog,
        (book) => this.bookService.updateBook(book.id, book),
        currentBook
      ).subscribe({
        next: (result: any) => {
          if (result.success) {
            console.log('Book edited');
          }
        },
        error: (error: any) => console.error('error:', error)
      });
    }
  }
}
