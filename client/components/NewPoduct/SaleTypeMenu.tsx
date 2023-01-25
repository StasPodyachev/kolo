import { SaleTypeMenuItems } from "@/constants/shared";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";

const SaleTypeMenu: NextPage = () => {
  const [activeItem, setActiveItem] = useState(SaleTypeMenuItems[0]);
  return (
    <Menu matchWidth>
      <MenuButton
        w="100%"
        p="11px 16px"
        mt="16px"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="md"
        textAlign="left"
        bg="gray.700"
      >
        <Flex justifyContent="space-between">
          <Text textStyle="mediumText">{activeItem}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <Flex flexDir="column" w="100%">
          {SaleTypeMenuItems.map((item) => (
            <MenuItem key={item} onClick={() => setActiveItem(item)}>
              {item}
            </MenuItem>
          ))}
        </Flex>
      </MenuList>
    </Menu>
  );
};

export default SaleTypeMenu;
