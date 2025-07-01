import { Observable } from 'rxjs';
import { WritableSignal } from '@angular/core';
import { Book } from '../../../models/book';

export interface IBookService {
  _books: WritableSignal<Book[]>;
  getBooks(): void;
  updateBook(id: string, book: Book): Observable<Book>;
  createBook(book: Book): Observable<Book>;
  deleteBook(id: string): Observable<void>;
}
