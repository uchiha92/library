import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from '../../../models/book';
import { IBookService } from '../interface/i-book.service';

@Injectable()
export class InMemoryBookService implements IBookService {
  readonly _books: WritableSignal<Book[]> = signal<Book[]>([
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 2008,
      genre: 'Technology',
      description: 'A handbook of agile software craftsmanship'
    },
    {
      id: '2',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      year: 1999,
      genre: 'Technology',
      description: 'From journeyman to master'
    }
  ]);

  getBooks(): Observable<Book[]> {
    return of(this._books()).pipe(delay(200));
  }

  updateBook(id: string, book: Book): Observable<Book> {
    const bookIndex = this._books().findIndex(b => b.id === id);
    if (bookIndex !== -1) {
      const updatedBook = { ...book, id };
      const newBooks = [...this._books()];
      newBooks[bookIndex] = updatedBook;
      this._books.set(newBooks);
      return of(updatedBook).pipe(delay(200));
    }
    return throwError(() => new Error(`Book with id ${id} not found`));
  }

  createBook(book: Book): Observable<Book> {   
    this._books.set([...this._books(), book]);
    
    return of(book).pipe(delay(200));
  }

  deleteBook(id: string): Observable<void> {
    const filteredBooks = this._books().filter(book => book.id !== id);
    if (filteredBooks.length === this._books().length) {
     return throwError(() => new Error(`Book with id ${id} not found`));
    }
    this._books.set(filteredBooks);
    return of(void 0).pipe(delay(200));
  }
}