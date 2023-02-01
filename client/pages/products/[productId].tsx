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
import { IAuctionItem } from "@/types";
import { convertExpNumberToNormal, convertStatus } from "@/helpers";

const ProductPage: NextPage = () => {
  const [item, setItem] = useState<IAuctionItem>({} as IAuctionItem);
  const [formattedId, setFormattedId] = useState("");
  const [fetchedData, setFetchedData] = useState<unknown>();
  const [bidsData, setBidsData] = useState<unknown>();
  const [bidsAmount, setBidsAmount] = useState();
  const [bid, setBid] = useState("0");
  const router = useRouter();

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
  }, [router?.query?.productId, item?.id, router?.isReady, formattedId])

  useEffect(() => {
    if (fetchedData && typeof fetchedData === 'object') {
      const coder = ethers.utils.defaultAbiCoder;
      const result = coder.decode([
        "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
        // @ts-ignore
      ], fetchedData?.data);
      const id = +result[0][0].toString();
      const title = result[0][1];
      const description = result[0][2]
      const ownedBy = result[0][7]
      const saleEndDateNew = result[0][9]
      const price = +ethers.utils.formatEther(BigNumber?.from(result[0][3]));
      const startPrice = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
      const endPrice = + ethers.utils.formatEther(BigNumber?.from(result[0][5]));
      const status = result[0][11] && convertStatus(Number(result[0][11]));

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let dateYear = new Date(saleEndDateNew * 1);
      let date = new Date(saleEndDateNew * 1000);
      const monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      let month = monthList[date.getMonth()];
      let days = date.getDay();
      let year =  dateYear.getFullYear()
      let saleEndDate = days + ' ' + month.slice(0, 3) + ' ' +  " " + year

      const decryptedData = {
        id,
        title,
        currentPrice: price < startPrice ? startPrice : price,
        ownedBy,
        saleEndDate,
        price: startPrice,
        priceEnd: endPrice,
        description,
        status,
        totalBids: 20,
      }
      setItem(decryptedData)
    }
    if (bidsData && Array.isArray(bidsData)) {
      const decryptedData = bidsData?.map((item: any) => {
        const currentBid = ethers.utils.formatEther(BigNumber?.from(item.bid._hex));
        setBid(currentBid);
      })
    }
  }, [fetchedData, bidsData]);
  return (
    item.id ?
    <Layout pageTitle="Item">
      <Product item={item} bid={bid} setBid={setBid} currentBid={item.currentPrice.toString()} />
    </Layout> : null
  );
};
export default ProductPage;
