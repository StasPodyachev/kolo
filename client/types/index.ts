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
  totalBids: number;
};

export interface IBidsTableData {
  address: string;
  date: string;
  bid: number;
};

export interface IBlock {
  title: string;
  value: number | string;
};

export interface INotaryTableData {
  address: string;
  balance: number;
};

export interface IVotesParameter {
  title: string;
  value: string;
};

export interface IVotesItem {
  image?: string;
  title: string;
  address: string;
  lastPrice: number;
  bids: number;
  saleEnds: string;
  description: string;
  isFirstItem: boolean;
};

export interface IDepositAndWithdrawButton {
  title: string;
  isDepositBtn: boolean;
}
