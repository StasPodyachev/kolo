import { NextPage } from "next";
import { Grid } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { IAuctionItem } from "@/types";
import { useContractRead } from "wagmi";
import ABI_FACTORY from "../contracts/abi/Factory.json";
import addresses from "@/contracts/addresses";
import { BigNumber, ethers } from "ethers";

const Home: NextPage = () => {
  const [ startCount, setStartCount ] = useState(0);
  const [ endCount, setEndCount ] = useState(5);
  const [ items, setItems ] = useState<IAuctionItem[] | []>([]);
  const [ hasMore, setHasMore ] = useState(true);

  useEffect(() => {
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
      const decryptedData = data?.map((item: any) => {
        const coder = ethers?.utils?.defaultAbiCoder;
        const result = coder?.decode([
          "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, uint256, bytes, uint256)",
        ], item?.data);
        const id = +result[0][0]?.toString();
        const title = result[0][1]
        const description = result[0][2]
        const price = +ethers?.utils?.formatEther(BigNumber?.from(result[0][4]));
        const ownedBy = result[0][7]
        const priceStart = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
        const priceEnd = + ethers.utils.formatEther(BigNumber?.from(result[0][5]));
        const status = result[0][12].toString()
        const saleEndDateNew = parseInt(result[0][9]?._hex, 16)
        let saleEndDate = new Date(+saleEndDateNew).toLocaleDateString()

        return {
          id,
          title,
          price: price < priceStart ? priceStart : price,
          ownedBy,
          saleEndDate,
          priceStart,
          priceEnd,
          description,
          status,
          totalBids: 20
        };
      });
      setItems(decryptedData);
    }
  }, [data]);

  const getMoreItems = () => {
    setStartCount(startCount + 5);
    setEndCount(endCount * 2);
    setItems([...items, ...items.slice(startCount, endCount)]);
  };
  return (
    <Layout pageTitle="Market">
      {/* <InfiniteScroll
        dataLength={items.length}
        next={getMoreItems}
        hasMore={hasMore}
        loader={} > */}
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
      {/* </InfiniteScroll> */}
    </Layout>
  );
};

export default Home;
