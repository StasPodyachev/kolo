import Layout from "@/components/Layout";
import { NotaryTabs } from "@/constants/shared";
import { useContractRead, useSigner } from "wagmi";

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



const Notary = () => {
  const signer = useSigner();
  const [index, setIndex] = useState(0);
  const { data } = useContractRead({
    address: addresses[2].address as `0x${string}`,
    abi: ABI_NOTARY,
    functionName: 'getAllNotaries',
  });
  useEffect(() => {
    console.log('data', data)
  }, [data])

  return (
    <Layout pageTitle="Notary" isCenteredBlock={false}>
      {signer ? (
        <Tabs tabs={NotaryTabs} defaultIndex={index} setIndex={setIndex}>
          <NotaryCommunityPanel />
          <MyVotesPanel />
          <DepositOrWithdrawPanel />
        </Tabs>
      ) : (
        <Plug title="to see your info" isNeedConnectBtn />
      )}
    </Layout>
  );
};
export default Notary;
