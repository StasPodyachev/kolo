import {
  DashboardIcon,
  FaqIcon,
  MarketIcon,
  NewItemIcon,
  NotaryIcon,
} from "@/icons";
import { INavlink, IAuctionItem, IBidsTableData } from "@/types";

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
