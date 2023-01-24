import { NextPage } from "next";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LogoIcon } from "@/icons";
import SidebarLink from "./SidebarLink";
import { navLinks } from "@/constants/shared";

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
        {navLinks.map((navLink) => (
          <SidebarLink
            icon={navLink.icon}
            title={navLink.title}
            to={navLink.url}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default SideBar;
