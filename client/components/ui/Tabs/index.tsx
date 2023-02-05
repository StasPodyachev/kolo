import { Tabs as ChakraTabs, TabList, Tab, TabPanels } from "@chakra-ui/react";
import { useEffect } from "react";

interface IProps {
  tabs: string[];
  defaultIndex: number;
  children: JSX.Element[];
}

const Tabs = ({ tabs, children, defaultIndex }: IProps) => {
  return (
    <ChakraTabs index={defaultIndex}>
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
