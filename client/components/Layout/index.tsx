import { Box, Flex, Heading } from "@chakra-ui/react";
import Sidebar from "../ui/Sidebar";
import ManageBar from "../ManageBar";

interface IProps {
  children: JSX.Element;
  pageTitle: string;
}

const Layout = ({ children, pageTitle }: IProps) => {
  return (
    <Flex>
      <Sidebar />
      <Box bg="gray.900" w="100%" p="56px 70px">
        <Flex w="100%" justifyContent="space-between" h="max-content">
          <Heading variant="h3">{pageTitle}</Heading>
          <ManageBar />
        </Flex>
        <Box mt="60px">{children}</Box>
      </Box>
    </Flex>
  );
};

export default Layout;
