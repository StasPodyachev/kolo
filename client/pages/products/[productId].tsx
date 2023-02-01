import { NextPage } from "next";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { readContract } from '@wagmi/core'
import BigDecimal from "decimal.js-light";
import { BIG_1E18 } from "@/helpers/misc";
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

const ProductPage: NextPage = () => {
  const [ item, setItem ] = useState<IAuctionItem>({} as IAuctionItem);
  const [ fetchedData, setFetchedData ] = useState<unknown>();
  const [ bidsAmount, setBidsAmount ] = useState<unknown>();
  const {query} = useRouter();

  useEffect(() => {
    if (query?.productId) {
      const fetchData = async () => {      
        if (query?.productId) {
          const data = await readContract({
            address: addresses[0]?.address as `0x${string}`,
            abi: ABI_FACTORY,
            functionName: `getDeal`,
            args: [ BigNumber.from(query?.productId) ],
          })
          setFetchedData(data);
          const totalBids = await readContract({
            address: addresses[1].address as `0x${string}`,
            abi: ABI_AUCTION_FILE,
            functionName: `getBidHistory`,
            args: [ BigNumber.from(query?.productId) ],
          })
          setBidsAmount(totalBids);
        }
      }
      fetchData();
    }
  }, [query?.productId,item?.id])

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
      const status = result[0][11].toString() === "0" ? "active" : "closed"
    
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
  }, [fetchedData]);

  return (
    item.id ?
    <Layout pageTitle="Item">
      <Product item={item} />
    </Layout> : null
  );
};
export default ProductPage;