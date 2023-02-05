import AboutKoloPanel from "@/components/Dao/AboutKoloPanel";
import CreatePanel from "@/components/Dao/CreatePanel/CreatePanel";
import ProposalsPanel from "@/components/Dao/ProposalsPanel";
import Layout from "@/components/Layout";
import Plug from "@/components/ui/Plug";
import Tabs from "@/components/ui/Tabs";
import { DaoTabs } from "@/constants/shared";
import { useSigner } from "wagmi";

const Dao = () => {
  const signer = useSigner()
  return (
    <Layout pageTitle="DAO">
      {signer ?
        <Tabs tabs={DaoTabs}>
          <ProposalsPanel />
          <CreatePanel />
          <AboutKoloPanel />
        </Tabs>
      : <Plug title="to see your info" isNeedConnectBtn />}
    </Layout>
  );
};

export default Dao;
