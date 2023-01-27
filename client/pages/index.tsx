import { NextPage } from "next";
import { Grid } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import { auctionItems } from "@/constants/shared";

const Home: NextPage = () => {
  return (
    <Layout pageTitle="Market">
      <Grid
        gap="26px"
        justifyContent="space-around"
        templateColumns="repeat(auto-fill, 304px)"
        templateRows="auto"
      >
        {auctionItems.map((auctionItem) => (
          <ItemCard
            key={auctionItem.id}
            to={auctionItem.id}
            title={auctionItem.title}
            price={auctionItem.price}
            ownedBy={auctionItem.ownedBy}
            saleEndDate={auctionItem.saleEndDate}
          />
        ))}
      </Grid>
    </Layout>
  );
};

export default Home;
