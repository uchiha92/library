import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../models/book';
import { HttpClient } from '@angular/common/http';
import { IBookService } from './i-http-book.service';

@Injectable({
  providedIn: 'root',
})
export class HttpBookService implements IBookService {

  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _baseUrl: string = 'https://6862c97a96f0cc4e34baf8c4.mockapi.io/api/library/';

  readonly _books: WritableSignal<Book[]> = signal<Book[]>([]);

  getBooks(): void {
    this._httpClient.get<Book[]>(`${this._baseUrl}books`).subscribe({
      next: (books) => this._books.set(books),
      error: (error) => console.error('Error fetching books:', error),
    });
  }

  updateBook(id: string, book: Book): Observable<Book> {
    const bookIndex = this._books().findIndex(b => b.id === id);
    if (bookIndex !== -1) {
      const newBooks = [...this._books()];
      newBooks[bookIndex] = book;
      this._books.set(newBooks);
    }
    
    return this._httpClient.put<Book>(`${this._baseUrl}books/${id}`, book);
  }

  createBook(book: Book): Observable<Book> {
    return this._httpClient.post<Book>(`${this._baseUrl}books`, book);
  }

  deleteBook(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._baseUrl}books/${id}`);
  }


}
