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
import { DIALOG_CONSTANTS } from '../../../../shared/constants/dialog.constants';
import { BookFormDialogComponent } from '../../../../shared/components/book-form-dialog/book-form-dialog.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';

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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_CONSTANTS.DEFAULT_CONFIG,
      data: DIALOG_CONSTANTS.GENERIC_DELETE_DIALOG
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.bookService.deleteBook(id).subscribe({
          next: () => {
            console.log('Book deleted successfully');
          },
          error: (error: any) => console.error('Error deleting book:', error)
        });
      }
    });
  }
  
  addBook(): void { 
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      ...DIALOG_CONSTANTS.FORM_CONFIG,
      data: DIALOG_CONSTANTS.CREATE_BOOK_DIALOG
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'save' && result.book) {
        this.bookService.createBook(result.book).subscribe({
          next: (createdBook: any) => {
            console.log('Book created successfully:', createdBook);
          },
          error: (error: any) => console.error('Error creating book:', error)
        });
      }
    });
  }

   editBook(id: string): void {
    const bookToEdit = this.books$().find((book: any) => book.id === id);
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      ...DIALOG_CONSTANTS.FORM_CONFIG,
      data: {
        title: 'Edit Book',
        book: bookToEdit,
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'save' && result.book) {
        this.bookService.updateBook(result.book.id, result.book).subscribe({
          next: (updatedBook: any) => {
            console.log('Book updated successfully:', updatedBook);
          },
          error: (error: any) => {
            console.error('Error updating book:', error);
          },
        });
      }
    });
  }
}
