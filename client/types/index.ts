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

interface IStatus {
  title: string;
  color: string;
}

export interface IAuctionItem {
  id: number;
  title: string;
  price: number;
  ownedBy: string;
  buyerAddress?: string;
  saleEndDate: string;
  priceStart: number;
  priceEnd: number;
  image?: string;
  description: string;
  status: IStatus;
  totalBids: number;
};

export interface IBidTableData {
  address: string;
  date: string;
  currentBid: string;
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
