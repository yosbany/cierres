import { format, parseISO, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Montevideo';

export const formatDate = (date: string | number | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const zonedDate = utcToZonedTime(parsedDate, TIMEZONE);
  return format(zonedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatShortDate = (date: string | number | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const zonedDate = utcToZonedTime(parsedDate, TIMEZONE);
  return format(zonedDate, "d 'de' MMMM", { locale: es });
};

export const formatDateTime = (timestamp: number) => {
  const zonedDate = utcToZonedTime(new Date(timestamp), TIMEZONE);
  return format(zonedDate, 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatDateForDB = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const zonedDate = utcToZonedTime(parsedDate, TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd');
};

export const getCurrentDate = () => {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd');
};

export const getNextDay = (date: string) => {
  const nextDay = addDays(parseISO(date), 1);
  return format(nextDay, 'yyyy-MM-dd');
};

export const getCurrentTimezone = () => TIMEZONE;