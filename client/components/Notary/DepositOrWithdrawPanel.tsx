import {
  DepositAndWithdrawButtons,
  DepositOrWithdrawBlocks,
} from "@/constants/shared";
import {
  Badge,
  Button,
  Flex,
  HStack,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  TabPanel,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import Block from "../ui/Block";

const DepositOrWithdrawPanel: NextPage = () => {
  const [value, setValue] = useState(10);
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" gap="50px">
        <Flex justifyContent="space-between">
          {DepositOrWithdrawBlocks.map((block) => (
            <Block key={block.title} title={block.title} value={block.value} />
          ))}
        </Flex>
        <Flex flexDir="column" gap="28px">
          <InputGroup maxW="576px" minH="48px">
            <NumberInput
              w="100%"
              bg="gray.700"
              borderRadius="md"
              value={value}
              onChange={(value) => setValue(+value)}
              placeholder="Amount"
            >
              <NumberInputField
                w="100%"
                h="100%"
                p="12px 16px"
                transition="all .3s"
                _focusVisible={{
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "gray.300",
                }}
              />
              <InputRightElement top="5px" right="13px">
                <Badge
                  letterSpacing="1px"
                  bg="gray.800"
                  p="2px 8px"
                  textStyle="mediumText"
                >
                  FIL
                </Badge>
              </InputRightElement>
            </NumberInput>
          </InputGroup>
          <HStack spacing="20px">
            {DepositAndWithdrawButtons.map((btn) => (
              <Button
                key={btn.title}
                minH="48px"
                bg={btn.isDepositBtn ? "blue.primary" : "blue.secondaryDark"}
                minW="278px"
                textStyle="button"
                transition="all .3s"
                _hover={
                  btn.isDepositBtn
                    ? { bg: "blue.hover" }
                    : { bg: "blue.active" }
                }
              >
                {btn.title}
              </Button>
            ))}
          </HStack>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default DepositOrWithdrawPanel;
