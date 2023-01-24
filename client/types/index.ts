export interface INavlink {
  url: string;
  title: string;
  icon: JSX.Element;
};

export interface IAuctionItem {
  id: number;
  title: string;
  price: string;
  ownedBy: string;
  saleEndDate: string;
  currentPrice: number;
  priceEnd: number;
  image?: string;
  description: string;
  status: string;
};

export interface IBidsTableData {
  address: string;
  date: string;
  bid: number;
};
