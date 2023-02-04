import { SaleTypeMenuItems } from "@/constants/shared";
import { ArrowIcon } from "@/icons";
import { ISaleTypeMenuItem } from "@/types";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const SaleTypeMenu = ({activeItem,setActiveItem} :
    {activeItem: ISaleTypeMenuItem, setActiveItem: (item: ISaleTypeMenuItem) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  useOutsideClick({
    ref: buttonRef,
    handler: () => setIsOpen(false),
  });
  return (
    <Menu matchWidth isOpen={isOpen}>
      <MenuButton
        ref={buttonRef}
        w="100%"
        p="11px 16px"
        mt="16px"
        border="1px solid"
        borderColor="gray.500"
        borderRadius="md"
        textAlign="left"
        color="white"
        bg="gray.700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text textStyle="mediumText">{activeItem?.title}</Text>
          <ArrowIcon
            boxSize="30px"
            transition="all .3s"
            transform={isOpen ? "rotate(90deg)" : "rotate(-90deg)"}
          />
        </Flex>
      </MenuButton>
      <MenuList bg="gray.700">
        <Flex flexDir="column" w="100%">
          {SaleTypeMenuItems.map((item) => (
            <MenuItem
              key={item?.id}
              onClick={() => {
                setActiveItem(item);
                setIsOpen(false);
              }}
            >
              {item?.title}
            </MenuItem>
          ))}
        </Flex>
      </MenuList>
    </Menu>
  );
};

export default SaleTypeMenu;
