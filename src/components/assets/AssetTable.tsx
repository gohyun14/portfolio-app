import {
  type ChartDataType,
  type DexScreenerType
} from "@/utils/axios-requests";
import { type PortfolioAsset } from "@prisma/client";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AddAssetModal from "@/components/assets/AddAssetModal";
import AssetTableHeader from "./AssetTableHeader";
import AssetTableRow from "./AssetTableRow";

type AssetTableProps = {
  assetsData: PortfolioAsset[] | undefined;
  chartData: ChartDataType[] | undefined;
  dexScreenerData: DexScreenerType[] | undefined;
  refetchAssets: () => void;
};

const AssetTable = ({
  assetsData,
  chartData,
  dexScreenerData,
  refetchAssets,
}: AssetTableProps) => {
  const { query } = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedAssetData, setsortedAssetData] = useState<
    PortfolioAsset[] | undefined
  >(undefined);

  useEffect(() => {
    if (assetsData && dexScreenerData && query.sort && query.order) {
      setsortedAssetData([
        ...assetsData.sort((a, b) => {
          const aEntry = dexScreenerData?.find(
            (asset) => asset.symbol === a.assetSymbol
          );
          const bEntry = dexScreenerData?.find(
            (asset) => asset.symbol === b.assetSymbol
          );

          if (query.sort === "asset") {
            return query.order === "asc"
              ? a.assetSymbol.localeCompare(b.assetSymbol)
              : b.assetSymbol.localeCompare(a.assetSymbol);
          } else if (query.sort === "amount") {
            return query.order === "asc"
              ? a.amount - b.amount
              : b.amount - a.amount;
          } else if (query.sort === "price") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? aEntry.data.priceUsd.localeCompare(bEntry.data.priceUsd)
                : bEntry.data.priceUsd.localeCompare(aEntry.data.priceUsd);
            else return 0;
          } else if (query.sort === "value") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? a.amount * parseFloat(aEntry.data.priceUsd) -
                    b.amount * parseFloat(bEntry.data.priceUsd)
                : b.amount * parseFloat(bEntry.data.priceUsd) -
                    a.amount * parseFloat(aEntry.data.priceUsd);
            else return 0;
          } else if (query.sort === "change") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? aEntry.data.priceChange.h24 - bEntry.data.priceChange.h24
                : bEntry.data.priceChange.h24 - aEntry.data.priceChange.h24;
            else return 0;
          } else {
            return 0;
          }
        }),
      ]);
    } else {
      setsortedAssetData(assetsData);
    }
  }, [query, assetsData, dexScreenerData]);

  return (
    <>
      <div className="mt-10">
        <div className="mb-5 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Assets</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the assets in your portfolio including their symbol,
              name, amount, price and 24 hour price change.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Add asset
            </button>
          </div>
        </div>
        <div className="flex flex-col rounded-md border border-gray-300 shadow-md">
          <AssetTableHeader />
          <LayoutGroup>
            <motion.ul
              layout
              className="max-h-[77vh] divide-y divide-gray-300 overflow-y-auto rounded-b-md text-left"
            >
              <AnimatePresence>
                {sortedAssetData?.map((asset, i) => (
                  <AssetTableRow
                    key={asset.id}
                    index={i}
                    id={asset.id}
                    symbol={asset.assetSymbol}
                    amount={asset.amount}
                    chartData={chartData?.find(
                      (item) => item.symbol === asset.assetSymbol
                    )}
                    dexScreenerData={dexScreenerData?.find(
                      (item) => item.symbol === asset.assetSymbol
                    )}
                    refetchAssets={refetchAssets}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <AddAssetModal
            setOpen={setIsModalOpen}
            refetchAssets={refetchAssets}
            assetList={assetsData?.map((asset) => asset.assetName)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AssetTable;
