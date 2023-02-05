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
  const [sellerActiveItemsCount, setSellerActiveItemsCount] = useState(0);
  const [sellerWaitForPaymentCount, setSellerWaitForPaymentCount] = useState(0);
  const [sellerDisputCount, setSellerDisputCount] = useState(0);
  const [buyerActiveItemsCount, setBuyerActiveItemsCount] = useState(0);
  const [buyerWaitForPaymentCount, setBuyerWaitForPaymentCount] = useState(0);
  const [buyerDisputCount, setBuyerDisputCount] = useState(0);
  const [purchases, setPurchases] = useState<IAuctionItem[] | []>([]);
  const [bids, setBids] = useState<IAuctionItem[] | []>([]);
  const [lockedInBids, setLockedInBids] = useState(0);
  const [sellerRevenue, setSellerRevenue] = useState(0);
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
        const collateral = result[0][6]
        const buyerAddress = result[0][8]
        const status = result[0][12] && convertStatus(Number(result[0][12]));
        const saleEndDateNew = status?.title == "Open" ? parseInt(result[0][9]?._hex, 16) : parseInt(result[0][9]?._hex, 16) * 1000
        let saleEndDate = new Date(+saleEndDateNew).toLocaleDateString()

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
          collateral,
        };
      });
      const filteredDealsBySeller = decryptedData.filter((item: IAuctionItem) => item?.ownedBy === address);
      const filteredDealsByBuyer = decryptedData.filter((item: IAuctionItem) => item?.buyerAddress === address);
      const activeItemsCountSeller = filteredDealsBySeller.filter((item: IAuctionItem) => item?.status?.title === "Open").length;
      setSellerActiveItemsCount(activeItemsCountSeller);
      const waitForPaymentItemsCountSeller = filteredDealsBySeller.filter((item: IAuctionItem) => item?.status?.title === "Wait finalize").length;
      setSellerWaitForPaymentCount(waitForPaymentItemsCountSeller);
      const itemsInDisputCountSeller = filteredDealsBySeller.filter((item: IAuctionItem) => item?.status?.title === "Dispute").length;
      setSellerDisputCount(itemsInDisputCountSeller);
      const activeItemsCountBuyer = filteredDealsByBuyer.filter((item: IAuctionItem) => item?.status?.title === "Open").length;
      setBuyerActiveItemsCount(activeItemsCountBuyer);
      const waitForPaymentItemsCountBuyer = filteredDealsByBuyer.filter((item: IAuctionItem) => item?.status?.title === "Wait finalize").length;
      setBuyerWaitForPaymentCount(waitForPaymentItemsCountBuyer);
      const itemsInDisputCountBuyer = filteredDealsByBuyer.filter((item: IAuctionItem) => item?.status?.title === "Dispute").length;
      setBuyerDisputCount(itemsInDisputCountBuyer);
      const buyerPurchases = filteredDealsByBuyer.filter((item: IAuctionItem) => item?.status?.title === "Wait finalize");
      setPurchases(buyerPurchases);
      const buyerBids = filteredDealsByBuyer.filter((item: IAuctionItem) => item?.status?.title === "Open");
      setBids(buyerBids);
      const lockedMoneyInBids = filteredDealsByBuyer.filter((item: IAuctionItem) => item?.status.title !== "Wait finalize").reduce((a, b) => a + b.price, 0);
      setLockedInBids(lockedMoneyInBids);
      const totalRevenue = filteredDealsBySeller.filter((item: IAuctionItem) => item?.status?.title === "Wait finalize").reduce((a, b) => a + b.price, 0);
      setSellerRevenue(totalRevenue);
      setDealsBySeller(filteredDealsBySeller);
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
      value: sellerRevenue,
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
      value: lockedInBids,
    }
  ];

  return (
    <Layout pageTitle="Dashboard" isCenteredBlock={isConnected ? false : true}>
      {isConnected ? (
        <Tabs tabs={DashboardTabs}>
          <MyStorePanel deals={dealsBySeller} blocks={storeBlocks} />
          <MyPurchasesPanel purchases={purchases} bids={bids} blocks={purchasesBlocks} />
        </Tabs>
      ) : (
        <Plug title="to see your info" isNeedConnectBtn  />
      )}
    </Layout>
  );
};
export default Dashboard;
