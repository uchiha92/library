import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { BookFormDialogComponent } from '../../../../shared/components/book-form-dialog/book-form-dialog.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';
import { DIALOG_CONSTANTS } from '../../../../shared/constants/dialog.constants';

@Component({
  selector: 'app-book-list',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  private readonly bookService = inject(BOOK_SERVICE_TOKEN) as any;
  private readonly dialog = inject(MatDialog);

  books$ = this.bookService._books;
  
  pageSize = signal(16);
  pageIndex = signal(0);
  totalBooks = computed(() => this.books$().length);
  
  paginatedBooks = computed(() => {
    const allBooks = this.books$();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return allBooks.slice(startIndex, endIndex);
  });

  ngOnInit(): void {
    this.bookService.getBooks();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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
        }
      },
      error: (error: any) => console.error('error:', error)
    });
  }
  
  addBook(): void {
    BookFormDialogComponent.openDialog(
      this.dialog,
      (book) => this.bookService.createBook(book)
    ).subscribe({
      next: (result: any) => {
        if (result.success) {
          console.log('Book created');
        }
      },
      error: (error: any) => console.error('error:', error)
    });
  }

   editBook(id: string): void {
    const bookToEdit = this.books$().find((book: any) => book.id === id);
    if (bookToEdit) {
      BookFormDialogComponent.openDialog(
        this.dialog,
        (book) => this.bookService.updateBook(book.id, book),
        bookToEdit
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
