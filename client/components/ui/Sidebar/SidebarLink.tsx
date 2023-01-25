import { Box, HStack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {
  icon: JSX.Element;
  title: string;
  to: string;
}

const SidebarLink = ({ icon, title, to }: IProps) => {
  const router = useRouter();
  return (
    <Link href={to}>
      <Box
        p="16px 18px"
        borderRadius="md"
        transition="all .3s"
        opacity={router.pathname === to ? 1 : 0.7}
        bg={router.pathname === to ? "gray.600" : "inherit"}
        _hover={{ bg: "gray.600", cursor: "pointer", opacity: 1 }}
        data-group
      >
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
      </Box>
    </Link>
  );
};

export default SidebarLink;
