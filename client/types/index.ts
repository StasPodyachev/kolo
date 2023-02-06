import { BigNumber } from "ethers";

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

export interface IStatus {
  title: string;
  color: string;
}


// id,
// title,
// price,
// ownedBy,
// saleEndDate,
// priceEnd,
// description,
// status,
// totalBids: bidsAmount,
// buyer,
// collateral,
// cid,
// pastTime,
// isDispute
export interface IAuctionItem {
  id: number;
  title: string;
  price: number;
  ownedBy: string;
  buyerAddress?: string;
  saleEndDate: string;
  priceStart?: number;
  priceEnd?: number;
  image?: string;
  description: string;
  status: IStatus;
  totalBids?: number;
  buyer?: string
  collateral: BigNumber
  cid?: string
  pastTime?: boolean
  isDispute?: boolean
  icon?: ISvg;
  activeContract: string
  type: number
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

export interface IChatMessage {
  message: string;
  sender: string;
  time: string;
  id: number;
}

export interface IProposalItem {
  title: string;
  id: string;
  buttonText?: string;
  status: IStatus;
}

export interface IAboutKolo {
  title: string;
  subtitle: string;
}

export interface ISvg {
  src: string;
  height: number;
  width: number;
};

export interface INotaryData {
  address: `0x${string}`;
  isActive: boolean;
  balance: number;
}
