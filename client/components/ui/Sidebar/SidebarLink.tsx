import { Box, HStack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {
  icon: JSX.Element;
  title: string;
  to: string;
  isHiddenSidebar: boolean;
}

const SidebarLink = ({ icon, title, to, isHiddenSidebar }: IProps) => {
  const router = useRouter();
  return (
    <Link href={to}>
      <Box
        display={isHiddenSidebar ? "flex" : "block"}
        justifyContent={isHiddenSidebar ? "center" : "normal"}
        alignItems={isHiddenSidebar ? "center" : "normal"}
        p="16px 18px"
        borderRadius="md"
        transition="all .3s"
        opacity={router.pathname === to ? 1 : 0.7}
        bg={router.pathname === to ? "gray.600" : "inherit"}
        _hover={{ bg: "gray.800", cursor: "pointer", opacity: 1 }}
        data-group
      >
        {isHiddenSidebar ? (
          icon
        ) : (
          <HStack spacing="8px">
            {icon}
            <Text
              textStyle="mediumText"
              color="white"
              _groupHover={{ color: "white" }}
            >
              {title}
            </Text>
          </HStack>
        )}
      </Box>
    </Link>
  );
};

export default SidebarLink;
