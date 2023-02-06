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
    address: "0x5f5337939298e199A361c284d5e0Dad3518b144a",
    abi: ABI,
    functionName: "getProposes",
  });

  console.log({ data });

  useEffect(() => {
    const go = async () => {
      if (data) {
        const arr = [];
        const res = data as any;
        for (let i = 0; i < res.length; i++) {
          const response = await fetch(
            `https://gateway.lighthouse.storage/ipfs/${res[i].cid}`
          );
          const propose = await response.text();

          const attr = propose.split("\n");

          let status;
          let buttonText;

          switch (res[i].state) {
            case 0:
              buttonText = "cancel";
              status = {
                title: "pending",
                color: "#1DA1F2",
              };
              break;

            case 1:
              buttonText = "vote";
              status = {
                title: "open for vote",
                color: "#1DA1F2",
              };
              break;

            case 2:
              status = {
                title: "canceled",
                color: "#1DA1F2",
              };
              break;

            case 3:
              status = {
                title: "defeated",
                color: "#1DA1F2",
              };
              break;

            case 5:
              buttonText = "execute";
              status = {
                title: "queued",
                color: "#FBBC05",
              };

            default:
              buttonText = "undefined";
              status = {
                title: "undefined",
                color: "#FBBC05",
              };
          }

          arr.push({
            id: res[i].id,
            title: attr[0],
            buttonText,
            status,
            isVoted: res[i].isVoted,
          });
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
        <Heading variant="h3" color="white">Recent Proposals</Heading>
        <Flex flexDir="column" gap="36px">
          {proposals.map((item: IProposalItem) => (
            <ProposalItem
              key={item.id}
              title={item.title}
              id={"ID " + item.id}
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
