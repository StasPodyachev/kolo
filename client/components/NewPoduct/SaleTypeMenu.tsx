import { SaleTypeMenuItems } from "@/constants/shared";
import { ArrowIcon } from "@/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRef, useState } from "react";

const SaleTypeMenu: NextPage = () => {
  const [activeItem, setActiveItem] = useState(SaleTypeMenuItems[0]);
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
        borderColor="gray.700"
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
      <MenuList>
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
