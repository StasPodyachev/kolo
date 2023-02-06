import { ProposalsBlocks, ProposalsItems } from "@/constants/shared";
import { IProposalItem } from "@/types";
import { Button, Flex, Heading, TabPanel } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Blocks from "../ui/Blocks";
import ProposalItem from "./ProposalItem";

import { useContractWrite, useContractRead } from "wagmi";

import ABI from "contracts/abi/GovernorContract.json";

interface IProps {
  setIndex: Dispatch<SetStateAction<number>>;
}

const ProposalsPanel = ({ setIndex }: IProps) => {
  const [proposals, setProposals] = useState([] as any);

  const { data } = useContractRead({
    address: "0xb8C36F3477D62380b992311F4c1DB0c06565f76c",
    abi: ABI,
    functionName: "getVotesCid",
  });

  useEffect(() => {
    const go = async () => {
      if (data) {
        const arr = [];
        const res = data as string[];
        for (let i = 0; i < res.length; i++) {
          if (res[i] != "") {
            const response = await fetch(
              `https://gateway.lighthouse.storage/ipfs/${res[i]}`
            );
            const propose = await response.text();

            const attr = propose.split("\n");

            arr.push({
              id: i + 1,
              title: attr[0],
              buttonText: "vote",
              status: {
                title: "open for vote",
                color: "#1DA1F2",
              },
            });
          }
        }
        setProposals(arr);
      }
    };

    go();
  }, [data]);

  return (
    <TabPanel p={0}>
      <Flex flexDir="column" gap="20px">
        <Blocks items={ProposalsBlocks} />
        <Heading>Recent Proposals</Heading>
        <Flex flexDir="column" gap="36px">
          {proposals.map((item: IProposalItem) => (
            <ProposalItem
              key={item.id}
              title={item.title}
              id={item.id}
              buttonText={item.buttonText}
              status={item.status}
            />
          ))}
        </Flex>
        <Button
          textStyle="button"
          variant="blue"
          minW="272px"
          m="24px auto 0"
          onClick={() => setIndex(1)}
        >
          create proposal
        </Button>
      </Flex>
    </TabPanel>
  );
};

export default ProposalsPanel;
