import { Box, Flex, Heading } from "@chakra-ui/react";
import Sidebar from "../ui/Sidebar";
import ManageBar from "../ManageBar";
import useDevice from "@/hooks/useDevice";

interface IProps {
  children: JSX.Element;
  pageTitle: string;
  isCenteredBlock?: boolean;
}

const Layout = ({ children, pageTitle, isCenteredBlock }: IProps) => {
  const { isDesktop } = useDevice();
  return (
    <Flex>
      <Sidebar />
      <Box bg="gray.900" w="100%" p={isDesktop[0] ? "56px 70px" : "56px 50px"}>
        <Flex w="100%" h="max-content">
          <Heading
            variant={isDesktop[0] ? "h3" : "h4"}
            whiteSpace="nowrap"
            color="white"
            alignSelf="center"
          >
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
