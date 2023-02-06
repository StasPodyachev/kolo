import { IBlock, IProposalItem } from "@/types";
import { Button, Flex, Heading, TabPanel } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Blocks from "../ui/Blocks";
import ProposalItem from "./ProposalItem";

import { useContractRead } from "wagmi";
import web3 from "web3";
import addresses from "@/contracts/addresses";

import ABI from "contracts/abi/GovernorContract.json";
import ABI_KOLO_TOKEN from "contracts/abi/KoloToken.json";
import ABI_TREASURY from "contracts/abi/Treasury.json";
import VotePanel from "./VotePanel";
import { BigNumber, ethers } from "ethers";

interface IProps {
  setIndex: Dispatch<SetStateAction<number>>;
}

const ProposalsPanel = ({ setIndex }: IProps) => {
  const [proposals, setProposals] = useState([] as any);
  const [activeVotePage, setActiveVotePage] = useState(false);
  const [currentVoteTitle, setCurrentVoteTitle] = useState("");
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);

  const { data } = useContractRead({
    address: addresses[8].address as `0x${string}`,
    abi: ABI,
    functionName: "getProposes",
  });

  const { data: tokenData } = useContractRead({
    address: addresses[6].address as `0x${string}`,
    abi: ABI_KOLO_TOKEN,
    functionName: "totalSupply",
  });

  const { data: treasuryData } = useContractRead({
    address: addresses[5].address as `0x${string}`,
    abi: ABI_TREASURY,
    functionName: "getBalance",
  })

  useEffect(() => {
    console.log('treasury data', treasuryData);
  }, [treasuryData])

  useEffect(() => {
    if (typeof tokenData === 'object') {
      const amountMinted = +ethers.utils.formatEther(tokenData?._hex)
      setTotalMinted(amountMinted)
    }
  }, [tokenData])


//   useEffect(() => {
//     const getBalance = async () => {
//         try {
//           const balance = await web3.eth.getBalance(addresses[0].address);
//           setTreasuryBalance(balance);
//         } catch(error) {
//           console.log(error);
//         }
//     };
//     getBalance();
// }, []);

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

  const blocksProposals: IBlock[] = [
    {
      title: "Active Proposals",
      value: proposals.filter((item: IProposalItem) => item?.status?.title === "open for vote").length,
    },
    {
      title: "Total Proposals",
      value: proposals?.length,
    },
    {
      title: "Total minted",
      value: totalMinted,
    },
    {
      title: "Treasury balance",
      value: 1969314,
    },
  ]

  return (
    <TabPanel p={0}>
      {activeVotePage ? (
        <VotePanel title={currentVoteTitle} />
      ) : (
        <Flex flexDir="column" gap="20px">
          <Blocks items={blocksProposals} />
          <Heading variant="h3" color="white">Recent Proposals</Heading>
          <Flex flexDir="column" gap="36px">
            {proposals.map((item: IProposalItem) => (
              <ProposalItem
                key={item.id}
                title={item.title}
                id={"ID " + item.id}
                buttonText={item.buttonText}
                status={item.status}
                onClickHandler={setActiveVotePage}
                setVoteTitle={setCurrentVoteTitle}
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
      )}
    </TabPanel>
  );
};

export default ProposalsPanel;
