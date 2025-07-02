# LibraryApp

A modern and scalable library management application built with Angular 19, featuring a clean architecture, comprehensive testing with Jest, and a professional logging system.

## Architecture & Structure

### Project Overview
This project follows **Clean Architecture** principles with a **feature-based** folder structure, ensuring maintainability, testability, and scalability.

### Folder Structure
```
src/
├── app/
│   ├── core/                     # Core functionality (singleton services, models, guards)
│   │   ├── config/               # Configuration files
│   │   ├── factories/            # Service factories
│   │   ├── interceptors/         # HTTP interceptors
│   │   ├── models/               # Data models and interfaces
│   │   ├── services/             # Core business services
│   │   │   ├── book-service/     # Book management (HTTP & InMemory implementations)
│   │   │   ├── logger/           # Centralized logging service
│   │   │   └── notification/     # User notification service
│   │   └── tokens/               # Dependency injection tokens
│   ├── features/                 # Feature modules
│   │   └── library/              # Library feature
│   │       ├── components/       # Feature-specific components
│   │       │   ├── book-list/    # Book listing with pagination
│   │       │   └── book-detail/  # Book detail view
│   │       └── library.routes.ts # Feature routing
│   ├── shared/                   # Shared components, utilities, constants
│   │   ├── components/           # Reusable UI components
│   │   │   ├── book-form-dialog/ # Book creation/editing modal
│   │   │   └── confirmation-dialog/ # Confirmation dialogs
│   │   ├── constants/            # Application constants
│   │   └── utils/                # Utility functions
│   ├── app.component.ts          # Root component
│   ├── app.config.ts             # Application configuration
│   └── app.routes.ts             # Main routing configuration
└── environments/                 # Environment configurations
```

## Technical Stack

### Core Technologies
- **Angular 19**: Latest Angular framework with standalone components and signals
- **TypeScript 5.7**: Strongly typed JavaScript
- **RxJS 7.8**: Reactive programming with observables
- **Angular Material 19**: Modern UI component library
- **Bootstrap 5.3**: Responsive CSS framework (css layout only)

### Testing & Quality
- **Jest 29**: Modern JavaScript testing framework
- **@angular-builders/jest**: Angular-Jest integration
- **jest-preset-angular**: Angular-specific Jest configuration

### Development Tools
- **Angular CLI 19**: Development and build tools
- **Angular DevKit**: Build system and schematics

## Architecture Patterns

### 1. **Dependency Injection & Service Pattern**
```typescript
// Service abstraction with interface
export interface IBookService {
  _books: WritableSignal<Book[]>;
  getBooks(): Observable<Book[]>;
  createBook(book: Book): Observable<Book>;
  updateBook(id: string, book: Book): Observable<Book>;
  deleteBook(id: string): Observable<void>;
}

// Multiple implementations (HTTP & InMemory)
@Injectable() 
export class HttpBookService implements IBookService { ... }

@Injectable() 
export class InMemoryBookService implements IBookService { ... }
```

### 2. **Factory Pattern**
```typescript
// Dynamic service selection based on environment
export const BOOK_SERVICE_FACTORY_PROVIDER = {
  useClass: environment.useHttpBookService 
    ? HttpBookService 
    : InMemoryBookService
};
```

### 3. **Repository Pattern**
The `BookService` implementations act as repositories, abstracting data access whether from HTTP APIs or in-memory storage.

### 4. **Observer Pattern**
Reactive state management using Angular Signals and RxJS Observables:
```typescript
// Reactive state with signals
readonly _books: WritableSignal<Book[]> = signal<Book[]>([]);

// Computed properties
totalBooks = computed(() => this.books$().length);
paginatedBooks = computed(() => /* pagination logic */);
```

### 5. **Interceptor Pattern**
Centralized error handling with HTTP interceptors:
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Centralized error logging and handling
      return throwError(() => error);
    })
  );
};
```

## Key Features & Design Patterns

### State Management
- **Angular Signals**: Reactive state with computed properties
- **Immutable Updates**: State modifications through signal updates
- **Centralized Store**: Services act as feature stores

### Logging System
Professional logging service with configurable levels:
```typescript
export enum LogLevel { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }

@Injectable({ providedIn: 'root' })
export class LoggerService {
  debug(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
}
```

### Component Architecture
- **Standalone Components**: Modern Angular approach
- **Smart/Dumb Components**: Clear separation of concerns
- **Reactive Forms**: Type-safe form handling
- **Material Design**: Consistent UI/UX

### Data Flow
```
User Action → Component → Service → HTTP/InMemory → State Update → UI Refresh
```

## Testing Strategy

### Test Configuration
- **Jest**: Modern testing framework replacing Jasmine/Karma
- **Angular Testing Utilities**: TestBed, ComponentFixture
- **Mock Services**: Comprehensive service mocking
- **Coverage Reports**: Built-in code coverage


## Error Handling & Logging

### Centralized Error Handling
- **HTTP Interceptor**: Catches and logs all HTTP errors
- **Logger Service**: Centralized logging with timestamps
- **User Notifications**: User-friendly error messages via SnackBar
- **Development vs Production**: Different log levels based on environment

### Error Flow
```
HTTP Error → Interceptor → Logger → User Notification
```
