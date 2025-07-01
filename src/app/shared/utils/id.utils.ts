export class IdUtils {
  
  static generateId(prefix: string = 'item'): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 11);
    const generatedId = `${prefix}_${timestamp}_${randomPart}`;
    
    return generatedId;
  }
}
