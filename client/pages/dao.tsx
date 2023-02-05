import AboutKoloPanel from "@/components/Dao/AboutKoloPanel";
import CreatePanel from "@/components/Dao/CreatePanel/CreatePanel";
import ProposalsPanel from "@/components/Dao/ProposalsPanel";
import Layout from "@/components/Layout";
import Plug from "@/components/ui/Plug";
import Tabs from "@/components/ui/Tabs";
import { DaoTabs } from "@/constants/shared";
import { useState } from "react";
import { useSigner } from "wagmi";

const Dao = () => {
  const signer = useSigner()
  const [index, setIndex] = useState(0);
  return (
    <Layout pageTitle="DAO">
      {signer ?
        <Tabs tabs={DaoTabs} defaultIndex={index} setIndex={setIndex}>
          <ProposalsPanel setIndex={setIndex} />
          <CreatePanel />
          <AboutKoloPanel />
        </Tabs>
      : <Plug title="to see your info" isNeedConnectBtn />}
    </Layout>
  );
};

export default Dao;
