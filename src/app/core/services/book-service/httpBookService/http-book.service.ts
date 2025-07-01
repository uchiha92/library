import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Book } from '../../../models/book';
import { HttpClient } from '@angular/common/http';
import { IBookService } from '../interface/i-book.service';
import { environment } from '../../../../../environments/environment';
import { NOTIFICATION_MESSAGES } from '../../../../shared/constants/notification-messages.constants';
import { NotificationUtils } from '../../../../shared/utils/notification.utils';

@Injectable({
  providedIn: 'root',
})
export class HttpBookService implements IBookService {

  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _baseUrl: string = environment.apiUrl;

  readonly _books: WritableSignal<Book[]> = signal<Book[]>([]);

  getBooks(): Observable<Book[]> {
    return this._httpClient.get<Book[]>(`${this._baseUrl}books`).pipe(
      tap({
        next: (books) => {
          this._books.set(books);
        },
        error: (error) => {
          console.error(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.FETCH_FAILED, 'books'), error);
        }
      })
    );
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this._httpClient.put<Book>(`${this._baseUrl}books/${id}`, book).pipe(
      tap({
        next: (updatedBook) => {
          const bookIndex = this._books().findIndex(b => b.id === id);
          if (bookIndex !== -1) {
            const newBooks = [...this._books()];
            newBooks[bookIndex] = updatedBook;
            this._books.set(newBooks);
          }
        },
        error: (error) => {
          console.error(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.UPDATE_FAILED, 'book'), error);
        }
      })
    );
  }

  createBook(book: Book): Observable<Book> {
    return this._httpClient.post<Book>(`${this._baseUrl}books`, book).pipe(
      tap({
        next: (createdBook) => {
          this._books.set([...this._books(), createdBook]);
        },
        error: (error) => {
          console.error(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.CREATE_FAILED, 'book'), error);
        }
      })
    );
  }

  deleteBook(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._baseUrl}books/${id}`).pipe(
      tap({
        next: () => {
          const filteredBooks = this._books().filter(book => book.id !== id);
          this._books.set(filteredBooks);
        },
        error: (error) => {
          console.error(NotificationUtils.getMessage(NOTIFICATION_MESSAGES.DELETE_FAILED, 'book'), error);
        }
      })
    );
  }


}
