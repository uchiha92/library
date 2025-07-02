import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { BookDetailComponent } from './book-detail.component';
import { BOOK_SERVICE_TOKEN } from '../../../../core/tokens/book-service.token';
import { NotificationService } from '../../../../core/services/notification-service/notification.service';

describe('BookDetailComponent', () => {
  let component: BookDetailComponent;
  let fixture: ComponentFixture<BookDetailComponent>;

  beforeEach(async () => {
    const mockBookService = {
      _books: signal([]),
      getBooks: jest.fn(() => of([]))
    };

    const mockActivatedRoute = {
      snapshot: { paramMap: { get: jest.fn(() => '1') } }
    };

    await TestBed.configureTestingModule({
      imports: [BookDetailComponent],
      providers: [
        { provide: BOOK_SERVICE_TOKEN, useValue: mockBookService },
        { provide: NotificationService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
