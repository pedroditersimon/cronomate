
export function toDate(timeStamp?: number | undefined, nowOnUndefined: boolean = true) {
  const newDate = !timeStamp && nowOnUndefined
    ? new Date()
    : new Date(timeStamp || 0);

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

export function toElapsedHourMinutesFormat(elapsedTime: number) {
  if (elapsedTime <= 0) return undefined;

  const totalMinutes = Math.floor(elapsedTime / (1000 * 60));
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
  const time = toDate(baseTime);
  time.setHours(hours);
  time.setMinutes(minutes);

  return time;
}


// Function to check if the time is in the past
export function isPast(time: number | undefined): boolean {
  if (time === undefined) return false;
  const elapsedTime = getElapsedTime(toDate(time), toDate());

  // Check if the time is in the past
  return elapsedTime < 0;
}

// Function to check if the time is within 1 second of now
export function isNow(time: number | undefined, offsetSeconds: number = 1): boolean {
  if (time === undefined) return false;
  const elapsedTime = getElapsedTime(toDate(time), toDate());

  // Check if the time is within the offset in seconds
  return elapsedTime >= 0 && elapsedTime < offsetSeconds * 1000;
}

// Function to check if the time is now or in the future
export function isNowOrFuture(time: number | undefined): boolean {
  if (time === undefined) return false;
  const elapsedTime = getElapsedTime(toDate(time), toDate());

  // Check if the time is now or in the future
  return elapsedTime >= 0;
}

