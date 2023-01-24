import {
  DepositAndWithdrawButtons,
  DepositOrWithdrawBlocks,
} from "@/constants/shared";
import {
  Button,
  Flex,
  HStack,
  NumberInput,
  NumberInputField,
  TabPanel,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import NotaryBlock from "./NotaryBlock";

const DepositOrWithdrawPanel: NextPage = () => {
  const [value, setValue] = useState(10);
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" gap="50px">
        <Flex justifyContent="space-between">
          {DepositOrWithdrawBlocks.map((block) => (
            <NotaryBlock
              key={block.title}
              title={block.title}
              value={block.value}
            />
          ))}
        </Flex>
        <Flex flexDir="column" gap="28px">
          <NumberInput
            minH="48px"
            bg="gray.700"
            maxW="576px"
            value={value}
            onChange={(value) => setValue(+value)}
            placeholder="Amount"
          >
            <NumberInputField w="100%" h="100%" p="12px 16px" />
          </NumberInput>
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
