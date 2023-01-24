import {
  DashboardIcon,
  FaqIcon,
  MarketIcon,
  NewItemIcon,
  NotaryIcon,
} from "@/icons";

export const navLinks = [
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
