import {
  DepositAndWithdrawButtons,
  DepositOrWithdrawBlocks,
} from "@/constants/shared";
import { Button, Flex, HStack, TabPanel } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import Block from "../ui/Block";
import NumberInput from "../ui/NumberInput/NumberInput";

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
        <Flex flexDir="column" gap="28px" maxW="576px">
          <NumberInput value={value} setValue={setValue} />
          <HStack spacing="20px">
            {DepositAndWithdrawButtons.map((btn) => (
              <Button
                key={btn.title}
                minH="48px"
                bg={btn.isDepositBtn ? "blue.primary" : "blue.secondaryDark"}
                minW="278px"
                color="white"
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
