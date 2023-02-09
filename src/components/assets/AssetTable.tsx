import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { useRouter } from "next/router";
import { type PortfolioAsset } from "@prisma/client";

import { api } from "@/utils/api";
import AssetTableRow from "./AssetTableRow";
import AddAssetModal from "@/components/assets/AddAssetModal";
import AssetTableHeader from "./AssetTableHeader";

const AssetTable = () => {
  const { query } = useRouter();
  const { data: sessionData } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedAssetData, setsortedAssetData] = useState<
    PortfolioAsset[] | undefined
  >(undefined);

  const {
    data: assetsData,
    isLoading: isAssetsDataLoading,
    refetch: refetchAssetData,
  } = api.portfolioAsset.getAllAssetsByUserId.useQuery(
    { userId: sessionData?.user?.id as string },
    {
      refetchOnWindowFocus: false,
      enabled: !!sessionData,
    }
  );

  const assetDexscreenerMapRef = useRef(
    new Map<string, { price: number; change: number; value: number }>()
  );

  const addAssetToDexscreenerMap = (
    symbol: string,
    price: number,
    change: number,
    value: number
  ) => {
    assetDexscreenerMapRef.current.set(symbol, { price, change, value });
  };

  useEffect(() => {
    if (assetsData && query.sort && query.order) {
      setsortedAssetData([
        ...assetsData.sort((a, b) => {
          const aEntry = assetDexscreenerMapRef.current.get(a.assetSymbol);
          const bEntry = assetDexscreenerMapRef.current.get(b.assetSymbol);

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
                ? aEntry.price - bEntry.price
                : bEntry.price - aEntry.price;
            else return 0;
          } else if (query.sort === "value") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? aEntry.value - bEntry.value
                : bEntry.value - aEntry.value;
            else return 0;
          } else if (query.sort === "change") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? aEntry.change - bEntry.change
                : bEntry.change - aEntry.change;
            else return 0;
          } else {
            return 0;
          }
        }),
      ]);
    }
  }, [query, assetsData, assetDexscreenerMapRef]);

  return (
    <>
      <div>
        <div className="sm:flex sm:items-center">
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
              className="max-h-[80vh] divide-y divide-gray-300 overflow-y-scroll rounded-b-md text-left"
            >
              <AnimatePresence>
                {sortedAssetData?.map((asset, i) => (
                  <AssetTableRow
                    key={asset.id}
                    index={i}
                    id={asset.id}
                    symbol={asset.assetSymbol}
                    name={asset.assetName}
                    amount={asset.amount}
                    type={asset.type}
                    addToMap={addAssetToDexscreenerMap}
                    refetchAssets={() => void refetchAssetData()}
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
            refetchAssets={() => void refetchAssetData()}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AssetTable;
