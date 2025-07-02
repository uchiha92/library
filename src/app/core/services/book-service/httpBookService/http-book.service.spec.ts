import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpBookService } from './http-book.service';
import { Book } from '../../../models/book';
import { environment } from '../../../../../environments/environment';

describe('HttpBookService', () => {
  let service: HttpBookService;
  let httpMock: HttpTestingController;
  
  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    year: 2023,
    genre: 'Fiction',
    description: 'Test description'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpBookService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(HttpBookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch books', () => {
    const mockBooks = [mockBook];
    
    service.getBooks().subscribe(books => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}books`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
    
    expect(service._books()).toEqual(mockBooks);
  });

  it('should create book', () => {
    service.createBook(mockBook).subscribe(book => {
      expect(book).toEqual(mockBook);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}books`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBook);
    
    expect(service._books()).toContain(mockBook);
  });

  it('should update book', () => {
    service._books.set([mockBook]);
    const updatedBook = { ...mockBook, title: 'Updated' };
    
    service.updateBook('1', updatedBook).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}books/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedBook);
    
    expect(service._books()[0].title).toBe('Updated');
  });

  it('should delete book', () => {
    service._books.set([mockBook]);
    
    service.deleteBook('1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}books/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    
    expect(service._books()).toEqual([]);
  });
});
