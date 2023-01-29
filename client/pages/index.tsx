import { NextPage } from "next";
import { Grid, Heading, Text } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import { auctionItems } from "@/constants/shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { IAuctionItem } from "@/types";

const Home: NextPage = () => {
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(5);
  const [items, setItems] = useState<IAuctionItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setHasMore(auctionItems.length > items.length ? true : false);
  }, [items]);

  useEffect(() => {
    setItems(auctionItems.slice(0, 5));
    setStartCount(5);
    setEndCount(10);
  }, []);

  const getMoreItems = () => {
    setStartCount(startCount + 5);
    setEndCount(endCount * 2);
    setItems([...items, ...auctionItems.slice(startCount, endCount)]);
  };
  return (
    <Layout pageTitle="Market">
      <InfiniteScroll
        dataLength={items.length}
        next={getMoreItems}
        hasMore={hasMore}
        loader={
          <Heading textAlign="center" mt="36px" color="white" variant="h5">
            Loading...
          </Heading>
        }
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
