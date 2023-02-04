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

  return new Date(`${year}-${fixedMonth}-${fixedDay}T${fixedHour}:${fixedMinute}`);
}

export function getDateTimeLocal(date: Date) {
  return date.toISOString().slice(0, 16);
}

export function convertExpNumberToNormal(expId: number) {
  const numberId = expId.toFixed(18);
  const bigIntId = BigInt(new BigDecimal(numberId).mul(BIG_1E18 + "").toFixed(0)) + "";

  return bigIntId;
}

export function convertStatus(status: number) {
  switch(status) {
    case 0:
      return {
        title: "Open",
        color: "#0E8C43"
      }
    case 1:
      return {
        title: "Canceled",
        color: "?gray?"
      }
    case 2:
      return {
        title: "Closed",
        color: "#964B00",
      }
    case 3:
      return {
        title: "Dispute",
        color: "#E52E2E",
      }
    case 4:
      return {
        title: "Wait finalize",
        color: "#004DE5",
      }
  }
}
