export interface ISaleTypeMenuItem {
  id: number;
  title: string;
  address: string;
  abi: any;
}
export interface INavlink {
  url: string;
  title: string;
  icon: JSX.Element;
};

export interface IAuctionItem {
  id: number;
  title: string;
  price: number;
  ownedBy: string;
  buyerAddress?: string;
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

export interface IDepositAndWithdrawButton {
  title: string;
  isDepositBtn: boolean;
}

export interface FaqAccordionItem {
  title: string;
  description: string;
}

export interface IChildren {
  children: JSX.Element | JSX.Element[];
}
