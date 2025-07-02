import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification-service/notification.service';
import { NOTIFICATION_MESSAGES } from '../../shared/constants/notification-messages.constants';
import { NotificationUtils } from '../../shared/utils/notification.utils';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 400) {
        handleHttpError(error, req, notificationService);
      }
      return throwError(() => error);
    })
  );
};

function handleHttpError(error: HttpErrorResponse, req: any, notificationService: NotificationService): void {
  const url = req.url;
  const method = req.method;
  
  let errorMessage = '';

  if (method === 'GET' && url.includes('/books')) {
    errorMessage = NotificationUtils.getMessage(NOTIFICATION_MESSAGES.FETCH_FAILED, 'books');
  } else if (method === 'POST' && url.includes('/books')) {
    errorMessage = NotificationUtils.getMessage(NOTIFICATION_MESSAGES.CREATE_FAILED, 'book');
  } else if (method === 'PUT' && url.includes('/books')) {
    errorMessage = NotificationUtils.getMessage(NOTIFICATION_MESSAGES.UPDATE_FAILED, 'book');
  } else if (method === 'DELETE' && url.includes('/books')) {
    errorMessage = NotificationUtils.getMessage(NOTIFICATION_MESSAGES.DELETE_FAILED, 'book');
  } else {
    errorMessage = 'An unexpected error occurred. Please try again.';
  }

  switch (error.status) {
    case 0:
      errorMessage += ' (Network error - please check your connection)';
      break;
    case 404:
      errorMessage += ' (Resource not found)';
      break;
    case 500:
      errorMessage += ' (Server error)';
      break;
    case 403:
      errorMessage += ' (Access forbidden)';
      break;
    case 401:
      errorMessage += ' (Unauthorized)';
      break;
  }

  notificationService.showError(errorMessage);
}
