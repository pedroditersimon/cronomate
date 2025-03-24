
export function toDate(): Date;
export function toDate(timeStamp: number): Date;
export function toDate(timeStamp: number | null | undefined, nowOnUndefined: true): Date;
export function toDate(timeStamp: number | null | undefined, nowOnUndefined: false): Date | undefined;

export function toDate(timeStamp?: number | null | undefined, nowOnUndefined: boolean = true) {
  if (!timeStamp && !nowOnUndefined)
    return undefined;

  const newDate = timeStamp
    ? new Date(timeStamp) // has value
    : new Date();         // set now on undefined

  // erase seconds and ms
  newDate.setSeconds(0, 0);
  return newDate;
}

export function to12HourFormat(time: Date) {
  let hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12; // Convierte 0 a 12 para la hora 12am o 12pm
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes}${ampm}`;
};

export function to24HourFormat(time: Date): string {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes}`;
};

export function getElapsedTime(start: Date | undefined, end: Date | undefined) {
  if (!start || !end) return 0;

  // Eliminados los segundos
  const startTime = toDate(start.getTime());
  const endTime = toDate(end.getTime());

  return endTime.getTime() - startTime.getTime();
}

// Ejemplo: 10h 30m
export function convertElapsedTimeToText(elapsedMs: number) {
  if (elapsedMs <= 0) return undefined;

  const totalMinutes = Math.floor(elapsedMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Construir el formato
  const hoursPart = hours > 0 ? `${hours}h ` : '';
  const minutesPart = minutes > 0 ? `${minutes}m` : '';

  return `${hoursPart}${minutesPart}`.trim();
}

export function convert24HourFormatTextToTime(timeTxt: string, baseTime?: number): Date | undefined {
  // no contiene numeros
  if (!/\d/.test(timeTxt)) return undefined;

  // Normalizar el formato: eliminar espacios múltiples y convertir caracteres no numéricos (incluidos espacios) a ":"
  let normalizedTime = timeTxt.trim().replace(/[^0-9]/g, ":");

  // [!] no separator 
  if (!normalizedTime.includes(":")) {
    // step 1. if input is less than 2 digit fill with 0 at the start to ensure hour
    normalizedTime = normalizedTime.padStart(2, "0");
    // step 2. add separator ':'
    normalizedTime = normalizedTime.substring(0, 2) + ":" + normalizedTime.substring(2, normalizedTime.length);
  }

  // Dividir en horas y minutos
  const [hoursStr, minutesStr] = normalizedTime.split(":");

  // Asegurarnos de manejar números sin ceros a la izquierda
  const parsedHours = parseInt(hoursStr, 10) || 0;
  const parsedMinutes = parseInt(minutesStr, 10) || 0;

  const hours = Math.max(0, Math.min(parsedHours, 23));
  const minutes = Math.max(0, Math.min(parsedMinutes, 59));

  // Crear un NUEVO objeto Date configurado a la hora indicada
  const time = toDate(baseTime, true);
  time.setHours(hours);
  time.setMinutes(minutes);

  return time;
}

export function isToday(date: Date) {
  const today = new Date();
  return date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear();
}

export function formatDateToText(date: Date, locale: string = navigator.language || 'es-ES') {
  if (isToday(date)) {
    return "Hoy";
  }

  const isPastYear = date.getFullYear() < new Date().getFullYear();

  const options: Intl.DateTimeFormatOptions = isPastYear
    ? { day: '2-digit', month: 'short', year: 'numeric' }
    : { weekday: 'long', day: '2-digit', month: 'short' };


  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

  // capitalize first letter
  return formattedDate.replace(/^\w/, (char) => char.toUpperCase());
}

function getElapsedTimeFromNow(time: number | undefined): number {
  if (time === undefined) return 0;
  return getElapsedTime(toDate(), toDate(time));
}

export function isPast(time: number | undefined): boolean {
  return getElapsedTimeFromNow(time) < 0;
}

export function isPastOrNow(time: number | undefined): boolean {
  return getElapsedTimeFromNow(time) <= 0;
}

export function isNow(time: number | undefined, offsetSeconds: number = 1): boolean {
  const elapsedTime = getElapsedTimeFromNow(time);
  return elapsedTime >= 0 && elapsedTime < offsetSeconds * 1000;
}

export function isNowOrFuture(time: number | undefined): boolean {
  return getElapsedTimeFromNow(time) >= 0;
}


export function convertMinutesToText(minutes: number) {
  const milliseconds = minutes / 60 / 60;
  return convertElapsedTimeToText(milliseconds);
}
