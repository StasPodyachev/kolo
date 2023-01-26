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
