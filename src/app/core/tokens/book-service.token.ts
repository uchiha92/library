import { InjectionToken } from '@angular/core';
import { IBookService } from '../services/book-service/interface/i-book.service';

export const BOOK_SERVICE_TOKEN = new InjectionToken<IBookService>('BookService');
