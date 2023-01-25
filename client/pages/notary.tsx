import { NextPage } from "next";
import Layout from "@/components/Layout";
import { NotaryTabs } from "@/constants/shared";
import NotaryCommunityPanel from "@/components/Notary/NotaryCommunityPanel";
import MyVotesPanel from "@/components/Notary/MyVotesPanel";
import DepositOrWithdrawPanel from "@/components/Notary/DepositOrWithdrawPanel";
import Tabs from "@/components/ui/Tabs";

const Notary: NextPage = () => {
  return (
    <Layout pageTitle="Notary">
      <Tabs tabs={NotaryTabs}>
        <NotaryCommunityPanel />
        <MyVotesPanel />
        <DepositOrWithdrawPanel />
      </Tabs>
    </Layout>
  );
};
export default Notary;
