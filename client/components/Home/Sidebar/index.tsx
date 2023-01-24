import { NextPage } from "next";
import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LogoIcon } from "@/icons";
import {
  MarketIcon,
  NewItemIcon,
  DashboardIcon,
  NotaryIcon,
  FaqIcon,
} from "@/icons";
import SidebarLink from "./SidebarLink";

const navList = [
  {
    url: "/",
    title: "Market",
    icon: <MarketIcon boxSize="24px" color="white" />,
  }
]

const SideBar: NextPage = () => {
  return (
    <Box
      minH="100vh"
      minW="336px"
      maxW="25%"
      p="68px 48px"
      bg="gray.900"
      borderRight="1px solid"
      borderColor="gray.800"
    >
      <Link href="/" style={{ marginLeft: "26px" }}>
        <LogoIcon color="white" width={63} height={17} />
      </Link>
      <Flex flexDir="column" gap="8px" mt="52px">
        <SidebarLink
          icon={<MarketIcon boxSize="24px" color="white" />}
          title="Market"
          to="/"
        />
        <SidebarLink
          icon={<NewItemIcon boxSize="24px" color="white" />}
          title="New Item"
          to="/"
        />
        <SidebarLink
          icon={<DashboardIcon boxSize="24px" color="white" />}
          title="Dashboard"
          to="/"
        />
        <SidebarLink
          icon={<NotaryIcon boxSize="24px" color="white" />}
          title="Notary"
          to="/"
        />
        <SidebarLink
          icon={<FaqIcon boxSize="24px" color="white" />}
          title="FAQ"
          to="/"
        />
      </Flex>
    </Box>
  );
};

export default SideBar;
