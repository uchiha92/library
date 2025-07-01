import { DialogConfig } from '../../core/models/dialog-config';
import { ConfirmationDialogData } from '../../core/models/confirmation-dialog-data';

export const DIALOG_CONSTANTS = {
  DEFAULT_CONFIG: {
    width: '400px',
    disableClose: true,
    autoFocus: true,
    restoreFocus: true
  } as DialogConfig,

  FORM_CONFIG: {
    width: '600px',
    maxWidth: '90vw',
    disableClose: false,
    autoFocus: true,
    restoreFocus: true
  } as DialogConfig,

  GENERIC_DELETE_DIALOG: {
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    icon: 'warning'
  } as ConfirmationDialogData

} as const;
