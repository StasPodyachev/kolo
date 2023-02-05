import addresses from "@/contracts/addresses";
import {
  DashboardIcon,
  DocsIcon,
  FaqIcon,
  MarketIcon,
  NewItemIcon,
  NotaryIcon,
} from "@/icons";
import {
  INavlink,
  // IAuctionItem,
  IBidTableData,
  IBlock,
  INotaryTableData,
  IVotesParameter,
  IDepositAndWithdrawButton,
  FaqAccordionItem,
  ISaleTypeMenuItem,
} from "@/types";

import ABI_FILE from "../contracts/abi/AuctionFile.json";

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
    url: "/dao",
    title: "DAO",
    icon: <NotaryIcon boxSize="24px" color="white" />,
  },
  {
    url: "https://deforex-docs.gitbook.io/kolo-fevm-hackathon/welcome/project-intro",
    title: "Docs",
    icon: <DocsIcon boxSize="24px" color="white" />,
  },
  {
    url: "/faq",
    title: "FAQ",
    icon: <FaqIcon boxSize="24px" color="white" />,
  },
];

export const BidsTableData: IBidTableData[] = [
  {
    address: "0x9D21...7a88",
    date: "28 Feb 2023",
    currentBid: "68558",
  },
  {
    address: "0x9D21...7a88",
    date: "27 Feb 2023",
    currentBid: "11770",
  },
  {
    address: "0x9D21...7a88",
    date: "22 Feb 2023",
    currentBid: "9524",
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
    value: 1.317,
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
    value: 1.317,
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

export const DepositOrWithdrawBlocks: IBlock[] = [
  {
    title: "My Status",
    value: "Active",
  },
  {
    title: "My Notary Balance",
    value: 1.317,
  },
  {
    title: "Min Notary Balance",
    value: 1.0,
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
    value: 54.317,
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
    value: 21.317,
  },
];

export const SaleTypeMenuItems: ISaleTypeMenuItem[] = [
  {
    id: 1,
    title: "AUCTION OF FILES",
    address: addresses[1].address,
    abi: ABI_FILE,
  },
  {
    id: 2,
    title: "AUCTION OF LIVEPEER",
    address: "0x49bD7e073c52cb831cBFebfc894A751a09c3521D",
    abi: ABI_FILE,
  },
  {
    id: 3,
    title: "AUCTION OF HUDDLE",
    address: "0x49bD7e073c52cb831cBFebfc894A751a09c3521D",
    abi: ABI_FILE,
  },
  {
    id: 4,
    title: "SIMPLE TRADES OF FILES",
    address: addresses[3].address,
    abi: ABI_FILE,
  },
];

export const FaqAccodionItems: FaqAccordionItem[] = [
  {
    title: "Who are we?",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo voluptate facilis error vel molestias quasi modi cumque laboriosam architecto totam! Recusandae commodi veniam, nesciunt vitae expedita quasi. Aspernatur, reprehenderit suscipit. Nisi enim vel rerum libero asperiores voluptatum saepe, ea consequatur dolorem! Aliquid molestias quo veniam dicta ducimus soluta atque commodi id, sapiente distinctio, saepe asperiores adipisci maiores eaque itaque ratione. Nesciunt repudiandae fugit vel deleniti error sapiente suscipit debitis, similique quidem illum quo porro perferendis eligendi sequi quasi nam modi pariatur! Nostrum asperiores similique aliquam, animi nemo accusamus impedit aliquid?",
  },
  {
    title: "Why should you choose exactly KOLO?",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo voluptate facilis error vel molestias quasi modi cumque laboriosam architecto totam! Recusandae commodi veniam, nesciunt vitae expedita quasi. Aspernatur, reprehenderit suscipit. Nisi enim vel rerum libero asperiores voluptatum saepe, ea consequatur dolorem! Aliquid molestias quo veniam dicta ducimus soluta atque commodi id, sapiente distinctio, saepe asperiores adipisci maiores eaque itaque ratione. Nesciunt repudiandae fugit vel deleniti error sapiente suscipit debitis, similique quidem illum quo porro perferendis eligendi sequi quasi nam modi pariatur! Nostrum asperiores similique aliquam, animi nemo accusamus impedit aliquid?",
  },
];

export const DaoTabs = ["proposals", "create", "ABOUT DAO KOLO"];

export const ProposalsBlocks = [
  {
    title: "Active Proposals",
    value: 3,
  },
  {
    title: "Total Proposals",
    value: 36,
  },
  {
    title: "Total minted",
    value: 11321200,
  },
  {
    title: "Treasury balance",
    value: 1969314,
  },
];
