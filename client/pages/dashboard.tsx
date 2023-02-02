import { NextPage } from "next";
import Layout from "@/components/Layout";
import { DashboardTabs } from "@/constants/shared";
import Tabs from "@/components/ui/Tabs";
import MyPurchasesPanel from "@/components/Dashboard/MyPurchasesPanel";
import MyStorePanel from "@/components/Dashboard/MyStorePanel";
import { useAccount, useContractRead } from "wagmi";
import Plug from "@/components/ui/Plug";
import addresses from "@/contracts/addresses";
import ABI_FACTORY from "../contracts/abi/Factory.json";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { IAuctionItem } from "@/types";
import { convertStatus } from "@/helpers";


const Dashboard: NextPage = () => {
  const [dealsBySeller, setDealsBySeller] = useState<IAuctionItem[] | []>([]);
  const [dealsByBuyer, setDealsByBuyer] = useState<IAuctionItem[] | []>([]);
  const [sellerActiveItemsCount, setSellerActiveItemsCount] = useState(0);
  const [sellerWaitForPaymentCount, setSellerWaitForPaymentCount] = useState(0);
  const [sellerDisputCount, setSellerDisputCount] = useState(0);
  const [buyerActiveItemsCount, setBuyerActiveItemsCount] = useState(0);
  const [buyerWaitForPaymentCount, setBuyerWaitForPaymentCount] = useState(0);
  const [buyerDisputCount, setBuyerDisputCount] = useState(0);
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { data } = useContractRead({
    address: addresses[0].address as `0x${string}`,
    abi: ABI_FACTORY,
    functionName: "getAllDeals",
  });
  useEffect(() => {
    if (Array.isArray(data)) {
      const decryptedData = data?.map((item: any) => {
        const coder = ethers.utils.defaultAbiCoder;
        const result = coder.decode([
          "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
        ], item.data);

        const id = +result[0][0].toString();
        const title = result[0][1];
        const description = result[0][2]
        const ownedBy = result[0][7]
        const buyerAddress = result[0][8];
        const saleEndDateNew = result[0][9]
        const price = +ethers.utils.formatEther(BigNumber?.from(result[0][3]));
        const priceStart = +ethers.utils.formatEther(BigNumber?.from(result[0][4]));
        const priceEnd = + ethers.utils.formatEther(BigNumber?.from(result[0][5]));

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
        let saleEndDate = days + ' ' + month.slice(0, 3) + ' ' +  " " + year;

        return {
          id,
          title,
          price: price < priceStart ? priceStart : price,
          ownedBy,
          buyerAddress,
          saleEndDate,
          priceStart,
          priceEnd,
          description,
          status,
          totalBids: 20,
        };
      });
      const filteredDealsBySeller = decryptedData.filter((item: any) => item.ownedBy === address);
      const filteredDealsByBuyer = decryptedData.filter((item: any) => item.buyerAddress === address);
      const activeItemsCountSeller = filteredDealsBySeller.filter((item: any) => item.status === "Active").length;
      setSellerActiveItemsCount(activeItemsCountSeller);
      const waitForPaymentItemsCountSeller = filteredDealsBySeller.filter((item: any) => item.status === "Finalize").length;
      setSellerWaitForPaymentCount(waitForPaymentItemsCountSeller);
      const itemsInDisputCountSeller = filteredDealsBySeller.filter((item: any) => item.status === "Dispute").length;
      setSellerDisputCount(itemsInDisputCountSeller);
      const activeItemsCountBuyer = filteredDealsByBuyer.filter((item: any) => item.status === "Active").length;
      setBuyerActiveItemsCount(activeItemsCountBuyer);
      const waitForPaymentItemsCountBuyer = filteredDealsByBuyer.filter((item: any) => item.status === "Finalize").length;
      setBuyerWaitForPaymentCount(waitForPaymentItemsCountBuyer);
      const itemsInDisputCountBuyer = filteredDealsByBuyer.filter((item: any) => item.status === "Dispute").length;
      setBuyerDisputCount(itemsInDisputCountBuyer);

      setDealsBySeller(filteredDealsBySeller);
      setDealsByBuyer(filteredDealsByBuyer);
    }
  }, [data, address]);

  const storeBlocks = [
    {
      title: "Active Items",
      value: sellerActiveItemsCount,
    },
    {
      title: "Wait to send payment",
      value: sellerWaitForPaymentCount,
    },
    {
      title: "In dispute",
      value: sellerDisputCount,
    },
    {
      title: "Total revenue",
      value: 54.317,
    }
  ];

  const purchasesBlocks = [
    {
      title: "Active Items",
      value: buyerActiveItemsCount,
    },
    {
      title: "Wait to send payment",
      value: buyerWaitForPaymentCount,
    },
    {
      title: "In dispute",
      value: buyerWaitForPaymentCount,
    },
    {
      title: "Locked in bids",
      value: 21.317,
    }
  ];

  return (
    <Layout pageTitle="Dashboard" isCenteredBlock={isConnected ? false : true}>
      {isConnected ? (
        <Tabs tabs={DashboardTabs}>
          <MyStorePanel deals={dealsBySeller} blocks={storeBlocks} />
          <MyPurchasesPanel purchases={dealsByBuyer} bids={dealsByBuyer} blocks={purchasesBlocks} />
        </Tabs>
      ) : (
        <Plug title="to see your info" isNeedConnectBtn  />
      )}
    </Layout>
  );
};
export default Dashboard;
