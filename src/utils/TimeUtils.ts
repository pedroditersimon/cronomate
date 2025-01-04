
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
  return end.getTime() - start.getTime();
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
