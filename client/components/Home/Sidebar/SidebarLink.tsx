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
    <Box
      p="16px 18px"
      borderRadius="2px"
      transition="all .3s"
      opacity={0.7}
      _hover={{ bg: "gray.600", cursor: "pointer", opacity: 1 }}
      data-group
    >
      <Link href={to}>
        <HStack spacing="8px">
          {icon}
          <Text
            textStyle="mediumText"
            color="gray.500"
            _groupHover={{ color: "white" }}
          >
            {title}
          </Text>
        </HStack>
      </Link>
    </Box>
  );
};

export default SidebarLink;
