import { NextPage } from "next";
import Layout from "@/components/Layout";
import { DashboardTabs } from "@/constants/shared";
import Tabs from "@/components/ui/Tabs";
import MyPurchasesPanel from "@/components/Dashboard/MyPurchasesPanel";
import MyStorePanel from "@/components/Dashboard/MyStorePanel";
import { useAccount } from "wagmi";
import PlugNotConnectedUser from "@/components/ui/PlugNotConnectedUser";

const Dashboard: NextPage = () => {
  const { isConnected } = useAccount();
  return (
    <Layout pageTitle="Dashboard" isCenteredBlock={isConnected ? false : true}>
      {isConnected ? (
        <Tabs tabs={DashboardTabs}>
          <MyStorePanel />
          <MyPurchasesPanel />
        </Tabs>
      ) : (
        <PlugNotConnectedUser />
      )}
    </Layout>
  );
};
export default Dashboard;
