import { NextPage } from "next";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ArrowIcon, LogoIcon } from "@/icons";
import SidebarLink from "./SidebarLink";
import { navLinks } from "@/constants/shared";
import { useSidebarContext } from "@/context/SidebarContext";
import useDevice from "@/hooks/useDevice";

const SideBar: NextPage = () => {
  const { isHiddenSidebar, setIsHiddenSidebar } = useSidebarContext();
  const { isDesktop } = useDevice();
  return (
    <Flex
      minH="100vh"
      minW={isHiddenSidebar ? "160px" : !isDesktop[0] ? "220px" : "336px"}
      position="relative"
      top={0}
      left={0}
      bg="gray.900"
      borderRight="1px solid"
      borderColor="gray.800"
    >
      <Box
        minW="100%"
        height="max-content"
        position="sticky"
        top={0}
        left={0}
        p={isDesktop[0] ? "68px 48px" : "68px 30px"}
        transition="all .3s"
      >
        <Link
          href="/"
          style={{
            transition: "all .3s",
            marginLeft: isHiddenSidebar ? 0 : "26px",
          }}
        >
          <LogoIcon color="white" width={63} height={17} />
        </Link>
        <Flex flexDir="column" gap="8px" mt="52px">
          {navLinks.map((navLink) => (
            <SidebarLink
              key={navLink.title}
              icon={navLink.icon}
              title={navLink.title}
              to={navLink.url}
              isHiddenSidebar={isHiddenSidebar}
            />
          ))}
        </Flex>
      </Box>
      <Box
        position="fixed"
        left={isHiddenSidebar ? "160px" : !isDesktop[0] ? "220px" : "336px"}
        mt="65px"
        minW="max-content"
        minH="max-content"
        p="4px"
        cursor="pointer"
        bg="gray.800"
        onClick={() => setIsHiddenSidebar(!isHiddenSidebar)}
        borderTopRightRadius="md"
        borderBottomRightRadius="md"
        transition="all .3s"
      >
        <ArrowIcon
          boxSize="36px"
          transition="all .3s"
          transform={isHiddenSidebar ? "rotate(180deg)" : ""}
        />
      </Box>
    </Flex>
  );
};

export default SideBar;
