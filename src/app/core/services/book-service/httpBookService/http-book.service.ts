import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Book } from '../../../models/book';
import { HttpClient } from '@angular/common/http';
import { IBookService } from '../interface/i-book.service';
import { environment } from '../../../../../environments/environment';
import { LoggerService } from '../../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class HttpBookService implements IBookService {

  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _logger: LoggerService = inject(LoggerService);
  private readonly _baseUrl: string = environment.apiUrl;

  readonly _books: WritableSignal<Book[]> = signal<Book[]>([]);

  getBooks(): Observable<Book[]> {
    this._logger.debug('HttpBookService.getBooks()');
    return this._httpClient.get<Book[]>(`${this._baseUrl}books`).pipe(
      tap((books) => {
        this._logger.info(`Fetched ${books.length} books from API`);
        this._books.set(books);
      }),
      catchError((error) => {
        this._logger.error('Error fetching books', error);
        return throwError(() => error);
      })
    );
  }

  updateBook(id: string, book: Book): Observable<Book> {
    this._logger.debug(`HttpBookService.updateBook(${id}, ${book.title})`);
    return this._httpClient.put<Book>(`${this._baseUrl}books/${id}`, book).pipe(
      tap((updatedBook) => {
        this._logger.info(`Book updated: ${updatedBook.title}`);
        const bookIndex = this._books().findIndex(b => b.id === id);
        if (bookIndex !== -1) {
          const newBooks = [...this._books()];
          newBooks[bookIndex] = updatedBook;
          this._books.set(newBooks);
        }
      }),
      catchError((error) => {
        this._logger.error('Error updating book', error);
        return throwError(() => error);
      })
    );
  }

  createBook(book: Book): Observable<Book> {
    this._logger.debug(`HttpBookService.createBook(${book.title})`);
    return this._httpClient.post<Book>(`${this._baseUrl}books`, book).pipe(
      tap((createdBook) => {
        this._logger.info(`Book created: ${createdBook.title}`);
        this._books.set([...this._books(), createdBook]);
      }),
      catchError((error) => {
        this._logger.error('Error creating book', error);
        return throwError(() => error);
      })
    );
  }

  deleteBook(id: string): Observable<void> {
    this._logger.debug(`HttpBookService.deleteBook(${id})`);
    return this._httpClient.delete<void>(`${this._baseUrl}books/${id}`).pipe(
      tap(() => {
        const filteredBooks = this._books().filter(book => book.id !== id);
        this._books.set(filteredBooks);
        this._logger.info(`Book deleted. Remaining: ${filteredBooks.length}`);
      }),
      catchError((error) => {
        this._logger.error('Error deleting book', error);
        return throwError(() => error);
      })
    );
  }
}
