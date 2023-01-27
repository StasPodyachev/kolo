import { Box, Flex, Heading } from "@chakra-ui/react";
import Sidebar from "../ui/Sidebar";
import ManageBar from "../ManageBar";

interface IProps {
  children: JSX.Element;
  pageTitle: string;
  isCenteredBlock?: boolean;
}

const Layout = ({ children, pageTitle, isCenteredBlock }: IProps) => {
  return (
    <Flex>
      <Sidebar />
      <Box bg="gray.900" w="100%" p="56px 70px">
        <Flex w="100%" h="max-content">
          <Heading variant="h3" color="white">
            {pageTitle}
          </Heading>
          <ManageBar />
        </Flex>
        {isCenteredBlock ? (
          <Flex
            position="relative"
            bottom="108px"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            {children}
          </Flex>
        ) : (
          <Box mt="60px">{children}</Box>
        )}
      </Box>
    </Flex>
  );
};

export default Layout;
