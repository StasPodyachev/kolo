import { NextPage } from "next";
import { Box, Flex, Grid, Heading } from "@chakra-ui/react";
import ManageBar from "@/components/ManageBar/ManageBar";
import Sidebar from "@/components/Home/Sidebar";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Flex flexDir="column" w="100%">
        <Flex
          w="100%"
          justifyContent="space-between"
          p="56px 70px"
          h="max-content"
        >
          <Heading variant="h3">Market</Heading>
          <ManageBar />
        </Flex>
        <Grid
          gap="26px"
          justifyContent="space-between"
          templateColumns="repeat(auto-fill, 304px)"
          templateRows="auto"
          px="70px"
          pb="56px"
        >
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </Grid>
      </Flex>
    </Layout>
  );
};

export default Home;
