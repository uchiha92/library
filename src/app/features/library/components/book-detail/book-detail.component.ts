import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { BookFormDialogComponent } from '../../../../shared/components/book-form-dialog/book-form-dialog.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';
import { NotificationService } from '../../../../core/services/notification-service/notification.service';
import { NOTIFICATION_MESSAGES } from '../../../../shared/constants/notification-messages.constants';
import { NotificationUtils } from '../../../../shared/utils/notification.utils';

@Component({
  selector: 'app-book-detail',
  imports: [
    MatCardModule,
    RouterModule,
    MatToolbarModule,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent implements OnInit, OnDestroy {
  private readonly bookService = inject(BOOK_SERVICE_TOKEN) as any;
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  private readonly books$ = this.bookService._books;
  
  idParam: string | null = null;
  loadingMessage = NOTIFICATION_MESSAGES.LOADING;

  readonly book$ = computed(() => {
    if (!this.idParam) return null;
    return this.books$().find((book: any) => book.id === this.idParam) ?? undefined;
  });

  ngOnInit(): void {
    this.idParam = this.route.snapshot.paramMap.get('id');

    if (this.books$().length === 0) {
      this.bookService.getBooks()
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteBook(id: string): void {
    this.notificationService.confirmDelete(
      () => this.bookService.deleteBook(id),
      'book'
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
     next: (result: any) => {
        if (result?.businessError) {
          this.notificationService.showError(`${NotificationUtils.getMessage(NOTIFICATION_MESSAGES.DELETE_FAILED, 'book')}: ${result.businessError}`);
        } else {
          this.notificationService.showSuccess(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.DELETED_SUCCESS, 'book'));
          this.router.navigate(['/']);
        }
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
    const currentBook = this.book$();
    if (currentBook) {
      BookFormDialogComponent.openDialog(
        this.dialog,
        (book) => this.bookService.updateBook(book.id, book),
        currentBook
      ).pipe(takeUntil(this.destroy$))
      .subscribe({
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
