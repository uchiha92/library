import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConfirmationDialogData } from '../../../core/models/confirmation-dialog-data';
import { DIALOG_CONSTANTS } from '../../constants/dialog.constants';

export type { ConfirmationDialogData };

export interface ConfirmationDialogConfig extends ConfirmationDialogData {
  actionCallback?: () => Observable<any>;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  readonly data = inject<ConfirmationDialogConfig>(MAT_DIALOG_DATA);

  onConfirm(): void {
    if (this.data.actionCallback) {
      this.data.actionCallback().subscribe({
        next: (result) => {
          if (result?.errors) {
            this.dialogRef.close({ success: false, businessError: result.errors });
          } else {
            this.dialogRef.close({ success: true, confirmed: true, result });
          }
        },
        error: (httpError) => {
          this.dialogRef.close({ success: false, httpError: true });
        }
      });
    } else {
      this.dialogRef.close({ success: true, confirmed: true });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false, cancelled: true });
  }

  static openDialog(
    dialog: MatDialog, 
    confirmationAction: () => Observable<any>, 
    dialogData: ConfirmationDialogData
  ): Observable<any> {
    const dialogConfig: ConfirmationDialogConfig = {
      ...dialogData,
      actionCallback: confirmationAction
    };

    const dialogRef = dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_CONSTANTS.DEFAULT_CONFIG,
      data: dialogConfig
    });

    return dialogRef.afterClosed().pipe(
      filter(result => result && !result.cancelled),
      map(result => {
        if (result.businessError) {
          return { success: false, businessError: result.businessError };
        } else if (result.httpError) {
          return { success: false, httpError: true };
        } else {
          return { success: true, confirmed: true, result: result.result };
        }
      })
    );
  }
}
