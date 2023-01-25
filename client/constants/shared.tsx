import {
  DashboardIcon,
  FaqIcon,
  MarketIcon,
  NewItemIcon,
  NotaryIcon,
} from "@/icons";
import {
  INavlink,
  IAuctionItem,
  IBidsTableData,
  IBlock,
  INotaryTableData,
  IVotesParameter,
  IVotesItem,
  IDepositAndWithdrawButton,
} from "@/types";

export const navLinks: INavlink[] = [
  {
    url: "/",
    title: "Market",
    icon: <MarketIcon boxSize="24px" color="white" />,
  },
  {
    url: "/newItem",
    title: "New Item",
    icon: <NewItemIcon boxSize="24px" color="white" />,
  },
  {
    url: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon boxSize="24px" color="white" />,
  },
  {
    url: "/notary",
    title: "Notary",
    icon: <NotaryIcon boxSize="24px" color="white" />,
  },
  {
    url: "/faq",
    title: "FAQ",
    icon: <FaqIcon boxSize="24px" color="white" />,
  },
];

export const auctionItems: IAuctionItem[] = [
  {
    id: 1,
    title: "Tree planting plan",
    price: "32 FIL",
    ownedBy: "0x9D21...7a88",
    saleEndDate: "28 Feb 2023",
    currentPrice: 300,
    priceEnd: 1000,
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    status: "active",
  },
  {
    id: 2,
    title: "Tree planting plan",
    price: "40 FIL",
    ownedBy: "0x9D21...7a88",
    saleEndDate: "25 Feb 2023",
    currentPrice: 300,
    priceEnd: 1000,
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    status: "active",
  },
  {
    id: 3,
    title: "Tree planting plan",
    price: "10 FIL",
    ownedBy: "0x9D21...7a88",
    saleEndDate: "27 Feb 2023",
    currentPrice: 300,
    priceEnd: 1000,
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    status: "active",
  },
  {
    id: 4,
    title: "Tree planting plan",
    price: "14 FIL",
    ownedBy: "0x9D21...7a88",
    saleEndDate: "28 Feb 2023",
    currentPrice: 300,
    priceEnd: 1000,
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    status: "active",
  },
  {
    id: 5,
    title: "Tree planting plan",
    price: "7 FIL",
    ownedBy: "0x9D21...7a88",
    saleEndDate: "22 Feb 2023",
    currentPrice: 300,
    priceEnd: 1000,
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    status: "active",
  },
  {
    id: 6,
    title: "Tree planting plan",
    price: "11 FIL",
    ownedBy: "0x9D21...7a88",
    saleEndDate: "20 Feb 2023",
    currentPrice: 300,
    priceEnd: 1000,
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    status: "active",
  },
];

export const BidsTableData: IBidsTableData[] = [
  {
    address: "0x9D21...7a88",
    date: "28 Feb 2023",
    bid: 68558,
  },
  {
    address: "0x9D21...7a88",
    date: "27 Feb 2023",
    bid: 11770,
  },
  {
    address: "0x9D21...7a88",
    date: "22 Feb 2023",
    bid: 9524,
  },
];

export const NotaryTabs = ["Notary community", "My votes", "Deposit/Withdraw"];

export const NotaryCommunityBlocks: IBlock[] = [
  {
    title: "Active Notaries",
    value: 325,
  },
  {
    title: "Disputes",
    value: 36,
  },
  {
    title: "My Status",
    value: "Active",
  },
  {
    title: "Notary Balance",
    value: "FIL 1.3170",
  },
];

export const NotaryTableData: INotaryTableData[] = [
  {
    address: "0x9D21...7a88",
    balance: 68558,
  },
  {
    address: "0x9D21...7a88",
    balance: 11770,
  },
  {
    address: "0x9D21...7a88",
    balance: 9524,
  },
];

export const NotaryVotesBlocks: IBlock[] = [
  {
    title: "Disputes waiting for Vote",
    value: 3,
  },
  {
    title: "Disputes waiting result",
    value: 1,
  },
  {
    title: "My Status",
    value: "Active",
  },
  {
    title: "Notary Balance",
    value: "FIL 1.3170",
  },
];

export const VotesParameters: IVotesParameter[] = [
  {
    title: "Price Start:",
    value: "10.0000 FIL",
  },
  {
    title: "Price Force Stop:",
    value: "50.0000 FIL",
  },
  {
    title: "Collateral:",
    value: "1.0000 FIL",
  },
  {
    title: "Date Start:",
    value: "27 Feb 2023",
  },
  {
    title: "Date End:",
    value: "27 Feb 2023",
  },
];

export const VotesBlockchain: IVotesParameter[] = [
  {
    title: "TX Create Item:",
    value: "0x671F...7891",
  },
  {
    title: "TX Start Sell:",
    value: "0x471A...6811",
  },
  {
    title: "TX Bid 1:",
    value: "0x281F...7881",
  },
  {
    title: "TX Buyer Winner:",
    value: "0x371D...5891",
  },
  {
    title: "TX Receive Payment:",
    value: "0x671F...7891",
  },
];

export const VotesItems: IVotesItem[] = [
  {
    title: "Tree planting plan",
    address: "0xh567...55",
    lastPrice: 32.0574,
    bids: 18,
    saleEnds: "28 Feb 2023",
    description: "Tree planting plan",
    isFirstItem: true,
  },
  {
    title: "Idea for new DeFi MVP",
    address: "0xh347...88",
    lastPrice: 21.0342,
    bids: 2,
    saleEnds: "27 Feb 2023",
    description:
      "File consists info about totaly new idea in DeFi. There are a business plan which could help earn 1B!",
    isFirstItem: false,
  },
];

export const DepositOrWithdrawBlocks: IBlock[] = [
  {
    title: "My Status",
    value: "Active",
  },
  {
    title: "My Notary Balance",
    value: "FIL 1.3170",
  },
  {
    title: "Min Notary Balance",
    value: "FIL 1.0000",
  },
];

export const DepositAndWithdrawButtons: IDepositAndWithdrawButton[] = [
  {
    title: "deposit",
    isDepositBtn: true,
  },
  {
    title: "withdraw",
    isDepositBtn: false,
  },
];

export const DashboardTabs = ["My store", "My purchases"];

export const MyStoreBlocks: IBlock[] = [
  {
    title: "Active Items",
    value: 2,
  },
  {
    title: "Wait to send payment",
    value: 1,
  },
  {
    title: "In Dispute",
    value: "1",
  },
  {
    title: "Total Revenue",
    value: "FIL 54.3170",
  },
];

export const MyPurchasesBlocks: IBlock[] = [
  {
    title: "Active bids",
    value: 2,
  },
  {
    title: "Wait to send payment",
    value: 1,
  },
  {
    title: "In Dispute",
    value: 1,
  },
  {
    title: "Locked in Bids",
    value: "FIL 21.3170",
  },
];
