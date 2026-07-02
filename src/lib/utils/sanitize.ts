export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (!input) return '';
  
  let cleaned = input.trim();
  
  cleaned = cleaned.replace(/&/g, '&amp;');
  cleaned = cleaned.replace(/</g, '&lt;');
  cleaned = cleaned.replace(/>/g, '&gt;');
  cleaned = cleaned.replace(/"/g, '&quot;');
  cleaned = cleaned.replace(/'/g, '&#039;');
  
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }
  
  return cleaned.trim();
}