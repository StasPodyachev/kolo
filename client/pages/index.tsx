import { NextPage } from "next";
import { Grid, Heading, Text } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import { auctionItems } from "@/constants/shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { IAuctionItem } from "@/types";
import { useContractRead } from "wagmi";
import ABI_FACTORY from "../contracts/abi/Factory.json";
import addresses from "@/contracts/addresses";
import { ethers } from "ethers";

const Home: NextPage = () => {
  const [products, setProducts] = useState<ethers.utils.Result[]>();
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

  const { data, isError, isLoading } = useContractRead({
    address: addresses[0].address as `0x${string}`,
    abi: ABI_FACTORY,
    functionName: "getAllDeals",
  });

  useEffect(() => {
    if (Array.isArray(data)) {
      const decryptedData = data?.map((item: any, index) => {
        const coder = ethers.utils.defaultAbiCoder;
        const result = coder.decode([
          "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
        ], data[index].data);
        return result;
      });
      console.log(decryptedData, 'decryptedData');
      setProducts(decryptedData);
    }
  }, [data]);

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
