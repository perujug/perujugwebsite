/**
 * Utilidades de formato de fechas en espanol (es-PE).
 */

const longFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const shortFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDateLong(date: Date): string {
  return longFormatter.format(date);
}

export function formatDateShort(date: Date): string {
  return shortFormatter.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}
