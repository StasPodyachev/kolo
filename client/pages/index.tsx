import { NextPage } from "next";
import { Grid, Heading, Text } from "@chakra-ui/react";
import ItemCard from "@/components/Home/ItemCard";
import Layout from "@/components/Layout";
import { auctionItems } from "@/constants/shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { IAuctionItem } from "@/types";
import { useContractRead } from "wagmi";
import ABI_FACTORY from '../contracts/abi/Factory.json' 
import addresses from "@/contracts/addresses";
import web3 from "web3"


const Home: NextPage = () => {
  const [ products, setProducts ] = useState([])
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
    functionName: 'getAllDeals',
  })

  useEffect(() => {
    if (data ) {
      // data?.map((item: any) => {
      //   // let itemData = web3?.utils?.hexToBytes(item.data as string)
      //   // let dataDecode = web3?.utils?.bytesToHex(itemData)
      //   // console.log(dataDecode, 'itemData');
      //   function bin2String(array) {
      //     var result = "";
      //     for (var i = 0; i < array.length; i++) {
      //       result += String.fromCharCode(parseInt(array[i], 2));
      //     }
      //     return result;
      //   }
        
      //   bin2String(["01100110", "01101111", "01101111"]);
      //   console.log(bin2String(item));
        
      //   return item
      // })
      // let newCid = web3?.utils?.hexToBytes(data)
      // console.log(data[0]?.data, 'data');
      // console.log(newCid, 'data');
    }
    console.log(data, 'list');
  }, [data])

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
