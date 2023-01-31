import { NextPage } from "next";
import { Grid, Heading } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import { auctionItems } from "@/constants/shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { IAuctionItem } from "@/types";
import { useContractRead } from "wagmi";
import ABI_FACTORY from "../contracts/abi/Factory.json";
import addresses from "@/contracts/addresses";
import { BigNumber, ethers } from "ethers";

const Home: NextPage = () => {
  const [ products, setProducts ] = useState<IAuctionItem[]>();
  const [ startCount, setStartCount ] = useState(0);
  const [ endCount, setEndCount ] = useState(5);
  const [ items, setItems ] = useState<IAuctionItem[]>([]);
  const [ hasMore, setHasMore ] = useState(true);

  useEffect(() => {
    setHasMore(auctionItems.length > items.length ? true : false);
  }, [items]);

  useEffect(() => {
    setItems(auctionItems.slice(0, 5));
    setStartCount(5);
    setEndCount(10);
  }, []);

  const { data } = useContractRead({
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
        ], item.data);
        const id = +ethers.utils.formatEther(BigNumber?.from(result[0][0]));
        const title = result[0][1]
        const description = result[0][2]
        const ownedBy = result[0][7]
        const saleEndDateNew = result[0][9]
        const price = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
        

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        let dateYear = new Date(saleEndDateNew * 1);
        let date = new Date(saleEndDateNew * 1000);
        const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        // Hours part from the timestamp
        let month = monthList[date.getMonth()];
        // Minutes part from the timestamp
        let days = date.getDay();
        let year =  dateYear.getFullYear();
        // Will display time in 10:30:23 format
        let saleEndDate = days + ' ' + month.slice(0, 3) + ' ' +  " " + year

        return {
          id,
          title,
          price,
          ownedBy,
          saleEndDate,
          currentPrice: 300,
          priceEnd: 1000,
          description,
          status: "active",
          totalBids: 20
        };
      });
      console.log(decryptedData, 'decryptedData');
      setItems(decryptedData);
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
          gap="32px"
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
