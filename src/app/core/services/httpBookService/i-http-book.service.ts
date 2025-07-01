import { Observable } from 'rxjs';
import { Book } from '../../models/book';

export interface IBookService {
  getBooks(): void;
  updateBook(id: string, book: Book): Observable<Book>;
  createBook(book: Book): Observable<Book>;
  deleteBook(id: string): Observable<void>;
}
