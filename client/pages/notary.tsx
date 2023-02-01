import { NextPage } from "next";
import Layout from "@/components/Layout";
import { NotaryTabs } from "@/constants/shared";
import NotaryCommunityPanel from "@/components/Notary/NotaryCommunityPanel";
import MyVotesPanel from "@/components/Notary/MyVotesPanel";
import DepositOrWithdrawPanel from "@/components/Notary/DepositOrWithdrawPanel";
import Tabs from "@/components/ui/Tabs";
import { useAccount } from "wagmi";
import ConnectBtn from "@/components/ui/ConnectBtn";
import { Flex, Text } from "@chakra-ui/react";
import Plug from "@/components/ui/Plug";

const Notary: NextPage = () => {
  const { isConnected } = useAccount();
  return (
    <Layout pageTitle="Notary" isCenteredBlock={isConnected ? false : true}>
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
