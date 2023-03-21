import { useState, useEffect } from "react";
import { type PortfolioAsset } from "@prisma/client";
import {
  type DexScreenerType,
  type ChartDataType,
} from "@/utils/axios-requests";

import AssetLineChart from "@/components/assets/AssetLineChart";
import Dropdown from "@/components/UI/Dropdown";

type AssetSpotlightProps = {
  assets: PortfolioAsset[] | undefined;
  dexScreenerData: DexScreenerType[] | undefined;
  chartData: ChartDataType[] | undefined;
};

const AssetSpotlight = ({
  assets,
  dexScreenerData,
  chartData,
}: AssetSpotlightProps) => {
  const [selectedAsset, setSelectedAsset] = useState<
    PortfolioAsset | undefined
  >(undefined);

  const [selectedDexScreener, setSelectedDexScreener] = useState<
    DexScreenerType | undefined
  >(undefined);

  useEffect(() => {
    if (selectedAsset === undefined) {
      setSelectedAsset(assets?.[0]);
    }
  }, [assets, selectedAsset]);

  useEffect(() => {
    if (selectedAsset && dexScreenerData) {
      const dexScreenerEntry = dexScreenerData?.find(
        (asset) => asset.symbol === selectedAsset.assetSymbol
      );
      setSelectedDexScreener(dexScreenerEntry);
    }
  }, [selectedAsset, dexScreenerData]);

  return (
    <section className="my-8 rounded-md border border-zinc-300 bg-zinc-100 p-2 text-center text-gray-600 shadow-lg">
      <h3 className="mb-3 text-center text-xl">Asset Spotlight</h3>
      <Dropdown
        options={assets}
        selected={selectedAsset}
        setSelected={setSelectedAsset}
      />
      <div className="mt-2 text-xs">
        {selectedAsset && selectedDexScreener && (
          <span className="">
            Portfolio Value: $
            {(
              selectedAsset.amount *
              parseFloat(selectedDexScreener.data.priceUsd)
            ).toFixed(2)}
          </span>
        )}
        {" - "}
        {selectedDexScreener && (
          <span className="">
            Price Change: {selectedDexScreener.data.priceChange.h24}%
          </span>
        )}
      </div>
      <AssetLineChart
        chartData={
          chartData?.find(
            (asset) => asset.symbol === selectedAsset?.assetSymbol
          )?.prices
        }
      />
    </section>
  );
};

export default AssetSpotlight;
