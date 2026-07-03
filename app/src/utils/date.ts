export function formatNumber(value: number) {
  return value.toString().padStart(2, '0');
}

export function getElapsedParts(startDate: Date, now: number) {
  const totalSeconds = Math.max(0, Math.floor((now - startDate.getTime()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}
