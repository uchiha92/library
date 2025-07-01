import { NOTIFICATION_MESSAGES } from '../constants/notification-messages.constants';
import { StringUtils } from './string.utils';


export class NotificationUtils {

  static getMessage(baseMessage: string, itemName?: string): string {
    if (itemName) {
    const item = itemName.toLowerCase();
    
    if (baseMessage.endsWith('successfully')) {
      return `${StringUtils.capitalizeFirst(item)} ${baseMessage}`;
    }
    
    if (baseMessage.startsWith('Failed to')) {
      return `${NOTIFICATION_MESSAGES.ERROR_TITLE}: ${baseMessage} ${item}`;
    }
    }
    
    return baseMessage;
  }
}
