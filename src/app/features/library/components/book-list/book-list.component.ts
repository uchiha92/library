import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpBookService } from '../../../../core/services/httpBookService/http-book.service';
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
  private readonly httpBookService = inject(HttpBookService);
  private readonly dialog = inject(MatDialog);

  books$ = this.httpBookService._books;
  
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
    this.httpBookService.getBooks();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  private updateBooks(): void {
    this.httpBookService.getBooks();
  }

  deleteBook(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_CONSTANTS.DEFAULT_CONFIG,
      data: DIALOG_CONSTANTS.GENERIC_DELETE_DIALOG
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.httpBookService.deleteBook(id).subscribe({
          next: () => {
            this.updateBooks();
          },
          error: (error) => console.error('Error deleting book:', error)
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
        this.httpBookService.createBook(result.book).subscribe({
          next: (createdBook) => {
            console.log('Book created successfully:', createdBook);
            this.updateBooks();
          },
          error: (error) => console.error('Error creating book:', error)
        });
      }
    });
  }

   editBook(id: string): void {
    const bookToEdit = this.books$().find(book => book.id === id);
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
        this.httpBookService.updateBook(result.book.id, result.book).subscribe({
          next: () => {
            console.log('Book updated successfully');
          },
          error: (error) => {
            console.error('Error updating book:', error);
          },
        });
      }
    });
  }
}
