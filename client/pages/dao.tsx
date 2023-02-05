import ProposalsPanel from "@/components/Dao/ProposalsPanel";
import Layout from "@/components/Layout";
import Plug from "@/components/ui/Plug";
import Tabs from "@/components/ui/Tabs";
import { DaoTabs } from "@/constants/shared";
import { Heading, TabPanel } from "@chakra-ui/react";
import { useSigner } from "wagmi";

const Dao = () => {
  const signer = useSigner()
  return (
    <Layout pageTitle="DAO">
      {signer ?
        <Tabs tabs={DaoTabs}>
          <ProposalsPanel />
          <TabPanel p={0}>
            <Heading>helo</Heading>
          </TabPanel>
        </Tabs>
      : <Plug title="to see your info" isNeedConnectBtn />}
    </Layout>
  );
};

export default Dao;
