import { NextPage } from "next";
import { Grid, Heading, Text } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import { auctionItems } from "@/constants/shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { IAuctionItem } from "@/types";

const Home: NextPage = () => {
  const [startCount, setStartCount] = useState(0);
  const [count, setCount] = useState(6);
  const [items, setItems] = useState<IAuctionItem[]>(
    auctionItems.slice(startCount, count + 1)
  );

  const getMoreItems = () => {
    setStartCount(count + 6);
    setCount(count + count);
    setItems([...items, ...auctionItems.slice(startCount, count)]);
  };
  return (
    <Layout pageTitle="Market">
      <InfiniteScroll
        dataLength={items.length}
        next={getMoreItems}
        hasMore={true}
        loader={
          <Heading color="white" variant="h5">
            Loading...
          </Heading>
        }
        endMessage={<Text>That&apos;s end</Text>}
      >
        <Grid
          gap="26px"
          justifyContent="space-around"
          templateColumns="repeat(auto-fill, 304px)"
          templateRows="auto"
        >
          {items.map((auctionItem) => (
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
      </InfiniteScroll>
    </Layout>
  );
};

export default Home;
