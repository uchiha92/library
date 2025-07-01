import { environment } from '../../../environments/environment';
import { InMemoryBookService } from '../services/book-service/inMemoryBookService/in-memory-book.service';
import { HttpBookService } from '../services/book-service/httpBookService/http-book.service';

export const CURRENT_BOOK_SERVICE = environment.useHttpBookService 
  ? HttpBookService 
  : InMemoryBookService;

export const BOOK_SERVICE_PROVIDER = {
  useClass: CURRENT_BOOK_SERVICE
};