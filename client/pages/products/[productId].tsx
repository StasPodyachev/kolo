import { NextPage } from "next";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  Flex,
  Text,
  Box,
  Heading,
  HStack,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { auctionItems } from "@/constants/shared";
import CardImage from "@/icons/cardImage.svg";
import { FileIcon, UserIcon } from "@/icons";
import BidsTable from "@/components/Products/BidsTable";
import AddressCopy from "@/components/ui/AddressCopy";
import { useAccount } from "wagmi";
import { readContract } from '@wagmi/core'
import Tooltip from "@/components/ui/Tooltip";
import useDevice from "@/hooks/useDevice";

import BigDecimal from "decimal.js-light";
import ABI_AUCTION_FILE from "@/contracts/abi/AuctionFile.json";
import addresses from "@/contracts/addresses";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { IAuctionItem } from "@/types";
import { BIG_1E18 } from "@/helpers/misc";
import { convertExpNumberToNormal, convertStatus } from "@/helpers";
import NumberInput from "@/components/ui/NumberInput/NumberInput";
import Product from "@/components/Product/Product";

const ProductPage: NextPage = () => {
  const [item, setItem] = useState<IAuctionItem>({} as IAuctionItem);
  const [formattedId, setFormattedId] = useState("");
  const [fetchedData, setFetchedData] = useState<unknown>();
  const [bidsData, setBidsData] = useState<unknown>();
  const [bidsAmount, setBidsAmount] = useState();
  const [bid, setBid] = useState("");
  const { isConnected } = useAccount();
  const router = useRouter();
  const { isDesktopHeader } = useDevice();
  const isItemsInColumn = useMediaQuery("(max-width: 899px)");

  useEffect(() => {
    if (router.isReady) {
      const productId = Number(router?.query?.productId);
      setFormattedId(convertExpNumberToNormal(productId));

      const fetchData = async () => {
        if (formattedId) {
          const data = await readContract({
            address: addresses[1].address as `0x${string}`,
            abi: ABI_AUCTION_FILE,
            functionName: `getDeal`,
            args: [ formattedId ],
          })
          setFetchedData(data);
          const totalBids = await readContract({
            address: addresses[1].address as `0x${string}`,
            abi: ABI_AUCTION_FILE,
            functionName: `getBidHistory`,
            args: [ formattedId ],
          })
          setBidsData(totalBids);
        }
      }
      fetchData();
    }
  }, [router.isReady, router?.query?.productId, formattedId])

  useEffect(() => {
    if (fetchedData && typeof fetchedData === 'object') {
      const coder = ethers.utils.defaultAbiCoder;
      const result = coder.decode([
        "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
        // @ts-ignore
      ], fetchedData?.data);
      const id = +ethers.utils.formatEther(BigNumber?.from(result[0][0]));
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
      // Hours part from the timestamp
      let month = monthList[date.getMonth()];
      // Minutes part from the timestamp
      let days = date.getDay();
      let year =  dateYear.getFullYear();
      // Will display time in 10:30:23 format
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
        const currentBid = +ethers.utils.formatEther(BigNumber?.from(item.bid._hex));
        setBid(currentBid.toString());
      })
    }
  }, [fetchedData, bidsData]);
  return (
    <Layout pageTitle="Item">
      <Product item={item} bid={bid} setBid={setBid} />
    </Layout>
  );
};
export default ProductPage;
