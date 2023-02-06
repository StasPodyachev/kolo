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
import ABI_NOTARY from "@/contracts/abi/Notary.json";
import addresses from "@/contracts/addresses";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { IAuctionItem, IBidTableData } from "@/types";
import { convertExpNumberToNormal, convertStatus } from "@/helpers";
import web3 from "web3";
import { useAccount } from "wagmi";

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

  const {address} = useAccount()
  useEffect(() => {
    if (router?.isReady && address) {
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
          const notary = await readContract({
            address: addresses[2].address as `0x${string}`,
            abi: ABI_NOTARY,
            functionName: 'getVoteInfo',
            args: ['0x548BEbCb845BD6Df3AC105BebbA60918Fd322bFd']
          })
          // console.log(notary, 'notary')
        }
      }
      fetchData();
    }
  }, [router?.query?.productId, router?.isReady, formattedId, address])

  useEffect(() => {
    // console.log(fetchedData, 'fetchedData');
    // @ts-ignore
    if (fetchedData && typeof fetchedData === 'object' && Number(fetchedData?._type) !== 0) { 
      // @ts-ignore
      const type =  Number(fetchedData?._type) 
      const coder = ethers?.utils?.defaultAbiCoder;
      const result = coder?.decode([
        "tuple(uint256, string, string, uint256, uint256, address, address, uint256, uint256, bytes, uint256)",
        // @ts-ignore
      ], fetchedData?.data);
      const id = +result[0][0].toString();
      const title = result[0][1];
      const description = result[0][2]
      const ownedBy = result[0][5]
      const buyer = result[0][6]
     
      const price = +ethers.utils.formatEther(BigNumber?.from(result[0][3]));
      const collateral = result[0][6]
      const cid = web3?.utils?.hexToAscii(result[0][9])
      
      const saleEndDateNew = parseInt(result[0][7]?._hex, 16) * 1000
      const pastTime = Date.now() > new Date(+saleEndDateNew).getTime()
      const isDispute = Date.now() < new Date(parseInt(result[0][10]?._hex, 16)).getTime() * 1000
      
      let saleEndDate = new Date(+saleEndDateNew).toLocaleDateString()
      if (bidsData && Array.isArray(bidsData)) {
        const decryptedBidData = bidsData.map((item) => {
          const currentBid = ethers.utils.formatEther(BigNumber?.from(item.bid._hex));
          return currentBid;
        })
        setBidsAmount(decryptedBidData.length);
      }
      const respStatus = Number(result[0][10]) 
      
      const active =
        respStatus === 0 && !pastTime ? 0 : // Open
        respStatus === 0 && pastTime ? 4 : // Wait finalaze
        respStatus === 3 ? 3 : // Dispute
        respStatus === 1 ? 1 : // Canceled
        respStatus === 2 ? 2 : // Close
        respStatus === 4 && isDispute ? 5 : // Buyed
        respStatus === 4 && !isDispute ? 6 : 0 // Wait Reward
      
      const status = result[0][10] && convertStatus(active)
      const decryptedData = {
        id,
        title,
        price,
        ownedBy,
        saleEndDate,
        description,
        status,
        totalBids: bidsAmount,
        buyer,
        collateral,
        cid,
        pastTime,
        isDispute,
        activeContract: addresses[3]?.address,
        type
      }
      setItem(decryptedData)
    }
  }, [fetchedData, bidsData, bidsAmount]);

  useEffect(() => {
    // console.log(fetchedData, 'fetchedData');
    // @ts-ignore
    if (fetchedData && typeof fetchedData === 'object' && Number(fetchedData?._type) !== 1) {
       // @ts-ignore
      const type =  Number(fetchedData?._type)    
      const coder = ethers?.utils?.defaultAbiCoder;
      const result = coder?.decode([
        "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, uint256, bytes, uint256)"
        // @ts-ignore
      ], fetchedData?.data);
      const id = +result[0][0].toString();
      const title = result[0][1];
      const description = result[0][2]
      const ownedBy = result[0][7]
      const buyer = result[0][8]
     
      const price = +ethers.utils.formatEther(BigNumber?.from(result[0][3]));
      const priceStart = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
      const priceEnd = + ethers.utils.formatEther(BigNumber?.from(result[0][5]));
      const collateral = result[0][6]
      const cid = web3?.utils?.hexToAscii(result[0][11])
      
      const saleEndDateNew = parseInt(result[0][9]?._hex, 16) * 1000
      const pastTime = Date.now() > new Date(+saleEndDateNew).getTime()
      const isDispute = Date.now() < new Date(parseInt(result[0][10]?._hex, 16)).getTime() * 1000
      console.log(new Date(parseInt(result[0][9]?._hex, 16) * 1000));
      
      let saleEndDate = new Date(+saleEndDateNew).toLocaleDateString()
      if (bidsData && Array.isArray(bidsData)) {
        const decryptedBidData = bidsData.map((item) => {
          const currentBid = ethers.utils.formatEther(BigNumber?.from(item.bid._hex));
          return currentBid;
        })
        setBidsAmount(decryptedBidData.length);
      }
      const respStatus = Number(result[0][12]) 
      
      const active =
        respStatus === 0 && !pastTime ? 0 : // Open
        respStatus === 0 && pastTime ? 4 : // Wait finalaze
        respStatus === 3 ? 3 : // Dispute
        respStatus === 1 ? 1 : // Canceled
        respStatus === 2 ? 2 : // Close
        respStatus === 4 && isDispute ? 5 : // Buyed
        respStatus === 4 && !isDispute ? 6 : 0 // Wait Reward
      
      const status = result[0][12] && convertStatus(active)
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
        buyer,
        collateral,
        cid,
        pastTime,
        isDispute,
        activeContract: addresses[1]?.address,
        type
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
        const bidDate = new Date(item?.timestamp?._hex * 1000).toDateString();
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
