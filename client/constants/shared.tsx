import addresses from "@/contracts/addresses";
import {
  DaoIcon,
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
  IProposalItem,
  IAboutKolo,
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
    icon: <DaoIcon boxSize="24px" color="white" />,
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
    title: "What is Kolo?",
    description:
      "Kolo is a cutting-edge project being developed by the defx team for the FVM Space Warp. It aims to create a fair and censorship-resistant platform for trading sensitive information, leveraging the power of the Filecoin network and governed by the DAO.",
  },
  {
    title: "What types of files and resources can be bought and sold on Kolo? ",
    description:
      "Users can buy and sell a wide variety of files, storage, and computing resources on Kolo, as well as gain access to exclusive content and online meetings. This includes everything from sensitive business documents and information of public interest to unique and valuable data sets.",
  },
  {
    title: "How does Kolo ensure fairness and censorship resistance?",
    description: "Kolo is powered by transparent notary mechanics, which means that buyers can start disputes if they believe a seller has cheated them with a file description. Notaries are chosen randomly from a list of DAO participants who have deposited a notary collateral, and sellers can also offer a guarantee deposit. Additionally, Kolo has an open reputation system that allows everyone to see a participant's actions and reviews.",
  },
  {
    title: "How does the dispute process work on Kolo?",
    description: "If the seller is confident about his lot according to the description he has written, he offers a guarantee deposit, which will be used as a payment to notaries if the seller cheated. If a buyer on Kolo believes that a seller has cheated him with a file description, he can initiate a dispute depositing a collateral, equal to the seller's collateral. Notaries are chosen randomly from a list of DAO participants who have deposited a notary collateral, and they will review the dispute. If the seller is right, the buyer's collateral is paid to notaries and the seller gets buyer's funds and his collateral back. If the buyer is right, the seller's collateral is paid to notaries and the buyer gets his funds and the collateral back. "
  },
  {
    title: "Can Kolo be used for charity and science projects?",
    description: "Yes, Kolo can be used as a tender platform to easily start and run charity and science projects.",
  },
  {
    title: "I want to sell a unique file, how can I start?",
    description: "First of all you have to install Metamask and add Filecoin as a network. Then you have to buy some FILs - native tokens of Filecoin blockchain. Now you can go to the Kolo mainpage and push the “Connect Wallet” button. After that you can choose the category, set a starting price, duration, add a description and download your file or link to IPFS, set a collateral. Sign the transaction in Metamask. All done! Share the link in social networks. Just wait for bids.",
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

export const ProposalsItems: IProposalItem[] = [
  {
    title: "Proposal #36  Change parameter _countInvaitedNotary",
    id: "ID 37827523216.....4212",
    buttonText: "vote",
    status: {
      title: "open for vote",
      color: "#1DA1F2",
    }
  },
  {
    title: "Proposal #35  Change parameter _minDeposit in Notary",
    id: "ID 37827523216.....4218",
    buttonText: "execute",
    status: {
      title: "queued",
      color: "#FBBC05",
    }
  },
  {
    title: "Proposal #34  Change parameter _minDeposit in Notary",
    id: "ID 37827523216.....4218",
    status: {
      title: "executed",
      color: "#34A853",
    }
  },
];

export const AboutKoloData: IAboutKolo[] = [
  {
    title: "Simple Summary",
    subtitle: "Increase the count of invited notaries from 20 to 30",
  },
  {
    title: "Motivation",
    subtitle: "It makes process of dispute voting more stable.",
  },
  {
    title: "Specification",
    subtitle: "Proposal will change const _countInvitedNotary in Notary.sol contract",
  },
]
