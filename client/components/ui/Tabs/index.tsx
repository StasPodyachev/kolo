import { Tabs as ChakraTabs, TabList, Tab, TabPanels } from "@chakra-ui/react";

interface IProps {
  tabs: string[];
  children: JSX.Element[];
}

const Tabs = ({ tabs, children }: IProps) => {
  return (
    <ChakraTabs>
      <TabList>
        {tabs.map((tab) => (
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
      <TabPanels mt="40px">{children}</TabPanels>
    </ChakraTabs>
  );
};

export default Tabs;
