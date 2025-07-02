import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { INotificationService } from './i-notification.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data';
import { DIALOG_CONSTANTS } from '../../../shared/constants/dialog.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements INotificationService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  showSuccess(message: string, title?: string): void {
    const fullMessage = title ? `${title}: ${message}` : message;
    this.snackBar.open(fullMessage, 'Close', {
      duration: 4000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  showError(message: string, title?: string): void {
    const fullMessage = title ? `${title}: ${message}` : message;
    this.snackBar.open(fullMessage, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }


  confirmDelete(
    action: () => Observable<any>,
    itemName?: string
  ): Observable<any> {
    const deleteDialogData: ConfirmationDialogData = itemName ? {
      ...DIALOG_CONSTANTS.GENERIC_DELETE_DIALOG,
      title: `Delete ${itemName}`,
      message: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`
    } : DIALOG_CONSTANTS.GENERIC_DELETE_DIALOG;

    return ConfirmationDialogComponent.openDialog(
      this.dialog, 
      action, 
      deleteDialogData
    );
  }
}
