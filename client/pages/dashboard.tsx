import { NextPage } from "next";
import Layout from "@/components/Layout";
import { DashboardTabs } from "@/constants/shared";
import Tabs from "@/components/ui/Tabs";
import MyPurchasesPanel from "@/components/Dashboard/MyPurchasesPanel";
import MyStorePanel from "@/components/Dashboard/MyStorePanel";

const Dashboard: NextPage = () => {
  return (
    <Layout pageTitle="Dashboard">
      <Tabs tabs={DashboardTabs}>
        <MyStorePanel />
        <MyPurchasesPanel />
      </Tabs>
    </Layout>
  );
};
export default Dashboard;
