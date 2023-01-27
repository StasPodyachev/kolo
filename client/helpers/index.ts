export function numberWithCommas(x: number) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function addressTruncation(address: string) {
  if (address) {
    const leftSide = address.slice(0, 4);
    const rightSide = address.slice(-4);
    return [leftSide, rightSide].join('....');
  }
};

export function getTodaysDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const fixedMonth = month < 10 ? `0${month}` : month;
  const fixedDay = day < 10 ? `0${day}` : day;
  const fixedHour = hour < 10 ? `0${hour}` : hour;
  const fixedMinute = minute < 10 ? `0${minute}` : minute;

  return `${year}-${fixedMonth}-${fixedDay}T${fixedHour}:${fixedMinute}`;
}
