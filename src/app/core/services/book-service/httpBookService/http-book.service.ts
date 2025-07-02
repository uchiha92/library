import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Book } from '../../../models/book';
import { HttpClient } from '@angular/common/http';
import { IBookService } from '../interface/i-book.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpBookService implements IBookService {

  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _baseUrl: string = environment.apiUrl;

  readonly _books: WritableSignal<Book[]> = signal<Book[]>([]);

  getBooks(): Observable<Book[]> {
    return this._httpClient.get<Book[]>(`${this._baseUrl}books`).pipe(
      tap((books) => {
        this._books.set(books);
      })
    );
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this._httpClient.put<Book>(`${this._baseUrl}books/${id}`, book).pipe(
      tap((updatedBook) => {
        const bookIndex = this._books().findIndex(b => b.id === id);
        if (bookIndex !== -1) {
          const newBooks = [...this._books()];
          newBooks[bookIndex] = updatedBook;
          this._books.set(newBooks);
        }
      })
    );
  }

  createBook(book: Book): Observable<Book> {
    return this._httpClient.post<Book>(`${this._baseUrl}books`, book).pipe(
      tap((createdBook) => {
        this._books.set([...this._books(), createdBook]);
      })
    );
  }

  deleteBook(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._baseUrl}books/${id}`).pipe(
      tap(() => {
        const filteredBooks = this._books().filter(book => book.id !== id);
        this._books.set(filteredBooks);
      })
    );
  }

}
