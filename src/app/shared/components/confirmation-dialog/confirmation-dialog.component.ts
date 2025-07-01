import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ConfirmationDialogData } from '../../../core/models/confirmation-dialog-data';
import { DIALOG_CONSTANTS } from '../../constants/dialog.constants';

export type { ConfirmationDialogData };

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
  readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  static openDialog(
    dialog: MatDialog, 
    confirmationAction: () => Observable<any>, 
    dialogData: ConfirmationDialogData
  ): Observable<any> {
    const dialogRef = dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_CONSTANTS.DEFAULT_CONFIG,
      data: dialogData
    });

    return new Observable(observer => {
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed === true) {
          confirmationAction().subscribe({
            next: (result) => {
              observer.next({ success: true, confirmed: true, result });
              observer.complete();
            },
            error: (error: any) => {
              observer.error(error);
            }
          });
        } else {
          observer.next({ success: false, cancelled: true });
          observer.complete();
        }
      });
    });
  }
}
