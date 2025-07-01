import { Observable } from 'rxjs';

export interface INotificationService {
  showSuccess(message: string, title?: string): void;
  showError(message: string, title?: string): void;
  
  confirmDelete(
    action: () => Observable<any>,
    itemName?: string
  ): Observable<any>;
}
