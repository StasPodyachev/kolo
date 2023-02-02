import { BIG_1E18 } from "./misc";
import BigDecimal from "decimal.js-light";

export function numberWithCommas(x: number | string) {
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

export function convertExpNumberToNormal(expId: number) {
  const numberId = expId.toFixed(18);
  const bigIntId = BigInt(new BigDecimal(numberId).mul(BIG_1E18 + "").toFixed(0)) + "";

  return bigIntId;
}

export function convertStatus(status: number) {
  switch(status) {
    case 0:
      return "Active"
    case 1:
      return "Cancel"
    case 2:
      return "Close"
    case 3:
      return "Dispute"
    case 4:
      return "Finalize"
  }
}
