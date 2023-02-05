import Layout from "@/components/Layout";
import { NotaryTabs } from "@/constants/shared";
import { useAccount } from "wagmi";

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

const Notary = () => {
  const { isConnected } = useAccount();
  return (
    <Layout pageTitle="Notary" isCenteredBlock={false}>
      {isConnected ? (
        <Tabs tabs={NotaryTabs}>
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
