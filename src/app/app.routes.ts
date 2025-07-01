import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/library/components/book-list/book-list.component').then(m => m.BookListComponent)
    },
    {
        path: 'books/:id',
        loadComponent: () => import('./features/library/components/book-detail/book-detail.component').then(m => m.BookDetailComponent)
    }
];
