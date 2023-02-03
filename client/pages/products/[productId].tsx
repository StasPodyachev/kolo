import { NextPage } from "next";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { readContract } from '@wagmi/core'
import dynamic from 'next/dynamic'
const Product = dynamic(() => import("@/components/Product/Product"), {
  ssr: false,
})

import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import ABI_FACTORY from "@/contracts/abi/Factory.json";
import addresses from "@/contracts/addresses";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { IAuctionItem, IBidTableData } from "@/types";
import { convertExpNumberToNormal, convertStatus } from "@/helpers";

const ProductPage: NextPage = () => {
  const [item, setItem] = useState<IAuctionItem>({} as IAuctionItem);
  const [formattedId, setFormattedId] = useState("");
  const [fetchedData, setFetchedData] = useState<unknown>();
  const [bidsData, setBidsData] = useState<unknown>([]);
  const [bidsAmount, setBidsAmount] = useState(0);
  const [bid, setBid] = useState("0");
  const [bidDate, setBidDate] = useState("");
  const [bidsTableData, setBidsTableData] = useState<IBidTableData[]>([])
  const router = useRouter();
  const minStep = 0.01

  useEffect(() => {
    if (router.isReady) {
      const productId = Number(router?.query?.productId);
      setFormattedId(convertExpNumberToNormal(productId));

      const fetchData = async () => {
        if (formattedId) {
          const data = await readContract({
            address: addresses[0]?.address as `0x${string}`,
            abi: ABI_FACTORY,
            functionName: `getDeal`,
            args: [ BigNumber.from(router?.query?.productId) ],
          })
          setFetchedData(data);
          const totalBids = await readContract({
            address: addresses[1].address as `0x${string}`,
            abi: ABI_AUCTION_FILE,
            functionName: `getBidHistory`,
            args: [ BigNumber.from(router?.query?.productId) ],
          })
          setBidsData(totalBids);
        }
      }
      fetchData();
    }
  }, [router?.query?.productId, router?.isReady, formattedId])

  useEffect(() => {
    if (fetchedData && typeof fetchedData === 'object') {
      const coder = ethers.utils.defaultAbiCoder;
      const result = coder.decode([
        "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, uint256, bytes, uint256)"
        // @ts-ignore
      ], fetchedData?.data);
      const id = +result[0][0].toString();
      const title = result[0][1];
      const description = result[0][2]
      const ownedBy = result[0][7]
      const saleEndDateNew = result[0][9]
      const price = +ethers.utils.formatEther(BigNumber?.from(result[0][3]));
      const priceStart = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
      const priceEnd = + ethers.utils.formatEther(BigNumber?.from(result[0][5]));
      const status = result[0][12] && convertStatus(Number(result[0][12]));

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let dateYear = new Date(saleEndDateNew * 1);
      let date = new Date(saleEndDateNew * 1000);
      const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      let month = monthList[date.getMonth()];
      let days = date.getDay();
      let year =  dateYear.getFullYear()
      let saleEndDate = days + ' ' + month.slice(0, 3) + ' ' +  " " + year
      if (bidsData && Array.isArray(bidsData)) {
        const decryptedBidData = bidsData.map((item) => {
          const currentBid = ethers.utils.formatEther(BigNumber?.from(item.bid._hex));
          return currentBid;
        })
        setBidsAmount(decryptedBidData.length);
      }
      const decryptedData = {
        id,
        title,
        price: price < priceStart ? priceStart : price,
        ownedBy,
        saleEndDate,
        priceStart,
        priceEnd,
        description,
        status,
        totalBids: bidsAmount,
      }
      const newBid = (price < priceStart ? priceStart + minStep : price + minStep).toFixed(2)
      setBid(newBid + '')
      setItem(decryptedData)
    }
    if (bidsData && Array.isArray(bidsData)) {
      const decryptedData = bidsData?.map((item: any) => {
        const currentBid = ethers.utils.formatEther(BigNumber?.from(item?.bid?._hex))
        setBid((+currentBid + minStep).toString());
        const buyerAddress = item.buyer;
        const bidDate = new Date(item.timestamp._hex * 1000).toDateString();
        const slicedDate = bidDate.slice(4).split(' ');
        const formattedDate = [slicedDate[1], slicedDate[0], slicedDate[2]]?.join(" ");
        setBidDate(formattedDate);
        return {
          address: buyerAddress,
          date: formattedDate,
          currentBid: currentBid,
        };
      });
      setBidsTableData(decryptedData.sort((a, b) => +b.currentBid - +a.currentBid));
      setBidsAmount(decryptedData.length);
    }
  }, [fetchedData, bidsData, bidsAmount]);
  return (
    item.id ?
    <Layout pageTitle="Item">
      <Product
        item={item}
        bid={bid}
        setBid={setBid}
        currentBid={item?.price}
        bidsTableData={bidsTableData}
        bidsAmount={bidsAmount}
      />
    </Layout> : null
  );
};
export default ProductPage;
