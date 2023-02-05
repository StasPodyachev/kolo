import { IBlock } from "@/types";
import { Flex, HStack, TabPanel } from "@chakra-ui/react";
import { useState } from "react";
import Blocks from "../ui/Blocks";
import NumberInput from "../ui/NumberInput/NumberInput";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

interface IProps {
  blocks: IBlock[];
}

const DepositOrWithdrawPanel = ({ blocks }: IProps) => {
  const [value, setValue] = useState("10");
  return (
    <TabPanel p={0}>
      <Flex flexDir="column" gap="50px">
        <Blocks items={blocks} />
        <Flex flexDir="column" gap="28px" maxW="576px">
          <NumberInput value={value} setValue={setValue} />
          <HStack spacing="20px">
            <Deposit amount={+value} />
            <Withdraw amount={+value} />
          </HStack>
        </Flex>
      </Flex>
    </TabPanel>
  );
};

export default DepositOrWithdrawPanel;
