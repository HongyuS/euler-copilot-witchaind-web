export function convertUTCToLocalTime(utcDateString: string | number | Date) {
  const date = new Date(utcDateString);
  date.setMinutes(date.getMinutes() + 8 * 60);

  // 使用toLocaleString可以按照本地时区进行格式化
  const localTimer = date
    .toLocaleString('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/\//g, '-');
  return localTimer;
}
export function uTCToLocalTime(utcDateString: string | number | Date) {
  const date = new Date(utcDateString);
  date.setMinutes(date.getMinutes() - 8 * 60);

  // 使用toLocaleString可以按照本地时区进行格式化
  const localTimer = date
    .toLocaleString('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/\//g, '-');
  return localTimer;
}
