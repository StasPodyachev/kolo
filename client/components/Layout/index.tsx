import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../Home/Sidebar";

interface IProps {
  children: JSX.Element;
}

const Layout = ({ children }: IProps) => {
  return (
    <Flex>
      <Sidebar />
      <Box>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
