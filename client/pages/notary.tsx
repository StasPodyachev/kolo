import { NextPage } from "next";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { NotaryTabs } from "@/constants/shared";
import NotaryCommunityPanel from "@/components/Notary/NotaryCommunityPanel";
import MyVotesPanel from "@/components/Notary/MyVotesPanel";
import DepositOrWithdrawPanel from "@/components/Notary/DepositOrWithdrawPanel";

const Notary: NextPage = () => {
  return (
    <Layout pageTitle="Notary">
      <Box mt="60px">
        <Tabs>
          <TabList>
            {NotaryTabs.map((tab) => (
              <Tab
                key={tab}
                textTransform="uppercase"
                color="gray.500"
                _selected={{ color: "white", borderBottomColor: "white" }}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels mt="40px">
            <NotaryCommunityPanel />
            <MyVotesPanel />
            <DepositOrWithdrawPanel />
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};
export default Notary;
