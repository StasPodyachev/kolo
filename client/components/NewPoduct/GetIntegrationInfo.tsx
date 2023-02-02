import { ISaleTypeMenuItem } from "@/types";
import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";
import { useContractRead } from "wagmi";

const GetIntegrationInfo = ({
  activeItem,
  startPrice,
  setValue,
  myCollateral,
}: {
  activeItem: ISaleTypeMenuItem;
  startPrice: string;
  setValue: (col: string) => void;
  myCollateral: string;
}) => {
  const { data } = useContractRead({
    address: activeItem.address as any,
    abi: activeItem.abi,
    functionName: "getIntegrationInfo",
  });
  useEffect(() => {
    let priceOfStart = +startPrice.split(",").join("");
    if (data) {
      const collateralAmountValue = BigNumber?.from(data.collateralAmount);
      const minCollateralAmount = +ethers.utils.formatEther(
        collateralAmountValue
      );
      const collateralPercentValue = BigNumber?.from(data.collateralAmount);
      const minCollateralPercent = +ethers.utils.formatEther(
        collateralPercentValue
      );
      const minimalCollateral =
      priceOfStart * minCollateralPercent > minCollateralAmount
          ? priceOfStart * minCollateralPercent
          : minCollateralAmount;
      const myCollateral =
        minimalCollateral >= (priceOfStart * minCollateralPercent) / 1e18
          ? minimalCollateral
          : priceOfStart * minCollateralPercent
      const value =
        myCollateral > minimalCollateral
          ? myCollateral.toFixed(2)
          : minimalCollateral.toFixed(2);
      setValue(value);
    }
  }, [data, myCollateral, setValue, startPrice]);
  return <></>;
};

export default GetIntegrationInfo