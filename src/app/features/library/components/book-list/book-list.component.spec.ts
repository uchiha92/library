import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { BookListComponent } from './book-list.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';
import { NotificationService } from '../../../../core/services/notification-service/notification.service';
import { Book } from '../../../../core/models/book';

// Mock the BookFormDialogComponent
jest.mock('../../../../shared/components/book-form-dialog/book-form-dialog.component', () => ({
  BookFormDialogComponent: {
    openDialog: jest.fn(() => of({ success: true }))
  }
}));

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let mockBookService: any;
  let mockNotificationService: any;

  const mockBooks: Book[] = [
    { id: '1', title: 'Book 1', author: 'Author 1', year: 2023, genre: 'Fiction', description: 'Description 1' },
    { id: '2', title: 'Book 2', author: 'Author 2', year: 2024, genre: 'Non-Fiction', description: 'Description 2' }
  ];

  beforeEach(async () => {
    mockBookService = {
      _books: signal(mockBooks),
      getBooks: jest.fn(() => of(mockBooks))
    };

    mockNotificationService = {
      confirmDelete: jest.fn(() => of({ success: true }))
    };

    await TestBed.configureTestingModule({
      imports: [BookListComponent, NoopAnimationsModule],
      providers: [
        { provide: BOOK_SERVICE_TOKEN, useValue: mockBookService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pageSize()).toBe(16);
    expect(component.pageIndex()).toBe(0);
    expect(component.totalBooks()).toBe(2);
  });

  it('should call getBooks on ngOnInit', () => {
    component.ngOnInit();
    expect(mockBookService.getBooks).toHaveBeenCalled();
  });

  it('should calculate paginated books', () => {
    component.pageSize.set(1);
    component.pageIndex.set(0);
    
    const paginatedBooks = component.paginatedBooks();
    expect(paginatedBooks.length).toBe(1);
    expect(paginatedBooks[0]).toEqual(mockBooks[0]);
  });

  it('should handle page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 20 });
    
    expect(component.pageIndex()).toBe(1);
    expect(component.pageSize()).toBe(10);
  });

  it('should call deleteBook', () => {
    component.deleteBook('1');
    expect(mockNotificationService.confirmDelete).toHaveBeenCalled();
  });

  it('should react to books signal changes', () => {
    expect(component.totalBooks()).toBe(2);
  
    const newBooks = [mockBooks[0]];
    mockBookService._books.set(newBooks);
    
    expect(component.totalBooks()).toBe(1);
  });

  it('should react to page size changes', () => {
    expect(component.paginatedBooks().length).toBe(2);
    
    component.pageSize.set(1);
    
    expect(component.paginatedBooks().length).toBe(1);
  });

  it('should react to page index changes', () => {
    component.pageSize.set(1);
    component.pageIndex.set(0);
    expect(component.paginatedBooks()[0]).toEqual(mockBooks[0]);
    
    component.pageIndex.set(1);
    expect(component.paginatedBooks()[0]).toEqual(mockBooks[1]);
  });
});
