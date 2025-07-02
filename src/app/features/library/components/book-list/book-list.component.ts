import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookFormDialogComponent } from '../../../../shared/components/book-form-dialog/book-form-dialog.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';
import { NotificationService } from '../../../../core/services/notification-service/notification.service';
import { NOTIFICATION_MESSAGES } from '../../../../shared/constants/notification-messages.constants';
import { NotificationUtils } from '../../../../shared/utils/notification.utils';

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
  private readonly notificationService = inject(NotificationService);
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
    // Subscribe to fetch books - HTTP errors are handled by the global error interceptor
    this.bookService.getBooks().subscribe();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  deleteBook(id: string): void {
    this.notificationService.confirmDelete(
      () => this.bookService.deleteBook(id),
      'book'
    ).subscribe({
      next: (result: any) => {
        if (result?.businessError) {
          this.notificationService.showError(`${NotificationUtils.getMessage(NOTIFICATION_MESSAGES.DELETE_FAILED, 'book')}: ${result.businessError}`);
        } else {
          this.notificationService.showSuccess(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.DELETED_SUCCESS, 'book'));
        }
      }
    });
  }
  
  addBook(): void {
    BookFormDialogComponent.openDialog(
      this.dialog,
      (book) => this.bookService.createBook(book)
    ).subscribe({
      next: (result: any) => {
        if (result?.businessError) {
          this.notificationService.showError(`${NotificationUtils.getMessage(NOTIFICATION_MESSAGES.CREATE_FAILED, 'book')}: ${result.businessError}`);
        } else {
          this.notificationService.showSuccess(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.CREATED_SUCCESS, 'book'));
        }
      }
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
          if (result?.businessError) {
            this.notificationService.showError(`${NotificationUtils.getMessage(NOTIFICATION_MESSAGES.UPDATE_FAILED, 'book')}: ${result.businessError}`);
          } else {
            this.notificationService.showSuccess(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.UPDATED_SUCCESS, 'book'));
          }
        }
      });
    }
  }
}
