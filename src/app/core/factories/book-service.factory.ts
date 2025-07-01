
import { environment } from '../../../environments/environment';
import { InMemoryBookService } from '../services/book-service/inMemoryBookService/in-memory-book.service';
import { HttpBookService } from '../services/book-service/httpBookService/http-book.service';
import { IBookService } from '../services/book-service/interface/i-book.service';

export function createBookService(): IBookService {
  
  if (environment.useHttpBookService) {
    return new HttpBookService();
  } else {
    return new InMemoryBookService();
  }
}

export const BOOK_SERVICE_FACTORY_PROVIDER = {
  useFactory: createBookService,
  deps: [] 
};
