import { Box, HStack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";

interface IProps {
  icon: JSX.Element;
  title: string;
  to: string;
}

const SidebarLink = ({ icon, title, to }: IProps) => {
  return (
    <Link href={to}>
      <Box
        p="16px 18px"
        borderRadius="2px"
        transition="all .3s"
        opacity={0.7}
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
