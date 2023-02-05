import Layout from "@/components/Layout";
import { NotaryTabs } from "@/constants/shared";
import { useAccount, useContractRead, useSigner } from "wagmi";

import dynamic from 'next/dynamic'
const Tabs = dynamic(() => import("@/components/ui/Tabs"), {
  ssr: false,
})

const MyVotesPanel = dynamic(() => import("@/components/Notary/MyVotesPanel"), {
  ssr: false,
})

const DepositOrWithdrawPanel = dynamic(() => import("@/components/Notary/DepositOrWithdrawPanel"), {
  ssr: false,
})
const NotaryCommunityPanel = dynamic(() => import("@/components/Notary/NotaryCommunityPanel"), {
  ssr: false,
})

import Plug from "@/components/ui/Plug";
import { useEffect, useState } from "react";
import addresses from "@/contracts/addresses";
import ABI_NOTARY from "@/contracts/abi/Notary.json";
import { BigNumber, ethers } from "ethers";
import { IBlock, INotaryData } from "@/types";



const Notary = () => {
  const signer = useSigner();
  const { address } = useAccount();
  const [index, setIndex] = useState(0);
  const [numberOfNotaries, setNumberOfNotaries] = useState(0);
  const [notaryInfo, setNotaryInfo] = useState<INotaryData[]>([]);
  const [myNotaryStatus, setMyNotaryStatus] = useState("Not Active");
  const [myNotaryBalance, setMyNotaryBalance] = useState(0);
  const { data } = useContractRead({
    address: addresses[2].address as `0x${string}`,
    abi: ABI_NOTARY,
    functionName: 'getAllNotaries',
  });
  useEffect(() => {
    if (Array.isArray(data)) {
      const decryptedData = data?.map((item: any) => {
        const notaryQuantity = data.length;
        setNumberOfNotaries(notaryQuantity);
        const address = item.wallet;
        const isActive = item.isActive;
        const balance = +ethers.utils.formatEther(BigNumber?.from(item.balance._hex));

        return {
          address,
          isActive,
          balance,
        }
      })
      setNotaryInfo(decryptedData)
    }
  }, [data, address])

  useEffect(() => {
    const amINotary = notaryInfo.filter((item: INotaryData) =>  item.address === address);
    const status = amINotary[0]?.isActive ? "Active" : "Not Active";
    setMyNotaryStatus(status);
    const balance = amINotary[0]?.balance ? amINotary[0]?.balance : 0;
    setMyNotaryBalance(balance);
  }, [notaryInfo, address])

  if (notaryInfo.length) {
    console.log('notary info', notaryInfo)
  }

  const notaryCommunityBlocks: IBlock[] = [
    {
      title: "Active Notaries",
      value: numberOfNotaries,
    },
    {
      title: "Disputes",
      value: 36,
    },
    {
      title: "My Status",
      value: myNotaryStatus,
    },
    {
      title: "My Notary Balance",
      value: myNotaryBalance,
    }
  ];

  const myVotesBlocks: IBlock[] = [
    {
      title: "Disputes waiting for Vote",
      value: 3,
    },
    {
      title: "Disputes waiting result",
      value: 1,
    },
    {
      title: "My Status",
      value: myNotaryStatus,
    },
    {
      title: "My Notary Balance",
      value: myNotaryBalance,
    },
  ];

  const depositOrWithdrawBlocks: IBlock[] = [
    {
      title: "My Status",
      value: myNotaryStatus,
    },
    {
      title: "My Notary Balance",
      value: myNotaryBalance,
    },
    {
      title: "Min Notary Balance",
      value: 1,
    },
  ]

  return (
    <Layout pageTitle="Notary" isCenteredBlock={false}>
      {signer ? (
        <Tabs tabs={NotaryTabs} defaultIndex={index} setIndex={setIndex}>
          <NotaryCommunityPanel blocks={notaryCommunityBlocks} notaryData={notaryInfo} />
          <MyVotesPanel blocks={myVotesBlocks} />
          <DepositOrWithdrawPanel blocks={depositOrWithdrawBlocks} />
        </Tabs>
      ) : (
        <Plug title="to see your info" isNeedConnectBtn />
      )}
    </Layout>
  );
};
export default Notary;
