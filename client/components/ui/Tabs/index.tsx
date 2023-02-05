import { Tabs as ChakraTabs, TabList, Tab, TabPanels } from "@chakra-ui/react";
import { useEffect } from "react";

interface IProps {
  tabs: string[];
  defaultIndex: number;
  setIndex: (value: number) => void;
  children: JSX.Element[];
}

const Tabs = ({ tabs, children, defaultIndex, setIndex }: IProps) => {
  return (
    <ChakraTabs index={defaultIndex} onChange={(event) => setIndex(event)}>
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
