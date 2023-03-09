import { type DexScreenerType } from "@/utils/axios-requests";
import { type PortfolioAsset } from "@prisma/client";
import { useEffect, useState } from "react";

import PortfolioHeader from "./PortfolioHeader";
import PortfolioBody from "./PortfolioBody";

type PortfolioOverviewType = {
  assetsData: PortfolioAsset[] | undefined;
  dexScreenerData: DexScreenerType[] | undefined;
};

const PortfolioOverview = ({
  assetsData,
  dexScreenerData,
}: PortfolioOverviewType) => {
  const [portfolioValue, setPortfolioValue] = useState<number | undefined>(
    undefined
  );
  const [portfolioChange, setPortfolioChange] = useState<string | undefined>(
    undefined
  );
  const [chartData, setChartData] = useState<
    | {
        value: number;
        label: string;
      }[]
    | undefined
  >(undefined);

  // calculate portoflio stats
  useEffect(() => {
    if (assetsData && dexScreenerData) {
      //  get chart data and total portfolio value
      const data: {
        value: number;
        label: string;
      }[] = [];
      let total = 0;
      assetsData.forEach((asset) => {
        const assetEntry = dexScreenerData.find(
          (assetEntry) => assetEntry.symbol === asset.assetSymbol
        );
        if (assetEntry) {
          const value = Math.round(
            asset.amount * parseFloat(assetEntry.data.priceUsd)
          );
          total += value;
          data.push({
            value: value,
            label: asset.assetSymbol,
          });
        }
      });
      setPortfolioValue(total);
      setChartData(data);

      // get portfolio change
      let change = 0;
      assetsData?.forEach((asset) => {
        const assetEntry = dexScreenerData.find(
          (assetEntry) => assetEntry.symbol === asset.assetSymbol
        );
        if (assetEntry) {
          const value = asset.amount * parseFloat(assetEntry.data.priceUsd);
          const assetChange = assetEntry.data.priceChange.h24;
          change += (value / total) * assetChange;
        }
      });
      setPortfolioChange(change.toFixed(2));
    }
  }, [assetsData, dexScreenerData]);

  return (
    <div className="mt-8">
      <PortfolioHeader
        portfolioValue={portfolioValue}
        portfolioChange={portfolioChange}
      />
      <PortfolioBody
        chartData={chartData}
        top3={dexScreenerData
          ?.filter((asset) => asset.data.priceChange.h24 > 0)
          .sort((a, b) => b.data.priceChange.h24 - a.data.priceChange.h24)
          .slice(0, 3)}
        bottom3={dexScreenerData
          ?.filter((asset) => asset.data.priceChange.h24 < 0)
          .sort((a, b) => a.data.priceChange.h24 - b.data.priceChange.h24)
          .slice(0, 3)}
      />
    </div>
  );
};

export default PortfolioOverview;
