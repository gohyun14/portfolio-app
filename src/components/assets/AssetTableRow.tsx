import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

import AssetExpanded from "./AssetExpanded";

type assetDexscreenerType = {
  baseToken: { symbol: string };
  priceChange: { h24: number };
  priceUsd: string;
};

type AssetTableRowProps = {
  index: number;
  id: string;
  symbol: string;
  name: string;
  amount: number;
  type: "CRYPTO" | "STOCK";
  addToMap: (
    symbol: string,
    price: number,
    change: number,
    value: number
  ) => void;
  refetchAssets: () => void;
};

const AssetTableRow = ({
  index,
  id,
  symbol,
  name,
  amount,
  type,
  addToMap,
  refetchAssets,
}: AssetTableRowProps) => {
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [value, setValue] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: assetDataDexscreener,
    isLoading: isAssetDataDexscreenerLoading,
  } = useQuery({
    queryKey: ["getAssetData", symbol, type],
    queryFn: async () => {
      // eslint-disable-next-line
      const { data } = await axios.get(
        `https://api.dexscreener.com/latest/dex/search?q=${symbol}`
      );
      // eslint-disable-next-line
      return data.pairs
        .map((pair: assetDexscreenerType) => {
          return {
            baseToken: pair.baseToken,
            priceChange: pair.priceChange,
            priceUsd: pair.priceUsd,
          };
        })
        .find(
          (pair: assetDexscreenerType) => pair.baseToken.symbol === symbol
        ) as assetDexscreenerType;
    },
    refetchOnWindowFocus: false,
  });

  const { data: chartDataLlama, isLoading: isChartDataLlamaLoading } = useQuery(
    {
      queryKey: ["getChartData", symbol, type],
      queryFn: async () => {
        // eslint-disable-next-line
        const { data } = await axios.get(
          `https://coins.llama.fi/chart/coingecko:${name.toLowerCase()}?start=${Date.now().toString()}&span=24&period=1H&searchWidth=1M`
        );
        // eslint-disable-next-line
        return data.coins[`coingecko:${name.toLowerCase()}`]?.prices as {
          timestamp: number;
          price: number;
        }[];
      },
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (assetDataDexscreener) {
      setPrice(parseFloat(assetDataDexscreener.priceUsd));
      setChange(assetDataDexscreener.priceChange.h24);
      setValue(amount * parseFloat(assetDataDexscreener.priceUsd));
      addToMap(assetDataDexscreener.baseToken.symbol, price, change, value);
    }
  }, [assetDataDexscreener, addToMap, amount, price, change, value]);

  return (
    <motion.li
      layout
      variants={{
        hidden: (index) => ({ opacity: 0, y: -50 * index }),
        visible: (index) => ({
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.075 },
        }),
        removed: { opacity: 0 },
      }}
      initial="hidden"
      animate="visible"
      exit="removed"
      custom={index}
      className="group flex flex-col bg-white last:rounded-b-md hover:cursor-pointer"
    >
      {!isAssetDataDexscreenerLoading && assetDataDexscreener ? (
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex flex-row"
        >
          <div className="basis-1/5 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
            <span>{symbol}</span>
          </div>
          <div className="basis-1/5 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
            {amount.toFixed(2)}
          </div>
          <div className="basis-1/5 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
            <span className="text-xs font-semibold text-teal-600">$</span>{" "}
            {price.toFixed(2)}
          </div>
          <div className="basis-1/5 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
            <span className="text-xs font-semibold text-teal-600">$</span>{" "}
            {value.toFixed(2)}
          </div>
          <div className="flex basis-1/5 justify-between py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
            <div
              className={`max-w-fit rounded-full ${
                change >= 0
                  ? "bg-green-300 px-2 text-green-800"
                  : "bg-red-300 px-2 text-red-800"
              }`}
            >
              <span>{change}</span> <span className="text-xs">%</span>
            </div>
            <ChevronUpIcon
              className={`h-5 w-5 stroke-2 text-teal-600 ${
                isExpanded ? "rotate-180" : "rotate-0"
              } rounded-full p-[2px] transition duration-[150ms] ease-in-out group-hover:bg-teal-800 group-hover:bg-opacity-70 group-hover:text-white`}
            />
          </div>
        </div>
      ) : (
        <div className="flex basis-full animate-pulse flex-row p-4">
          <div className="basis-1/5 rounded-full">
            <div className="h-2 w-2/3 rounded-full bg-teal-600 bg-opacity-40 py-3 pl-4 pr-3"></div>
          </div>
          <div className="basis-1/5 rounded-full">
            <div className="h-2 w-2/3 rounded-full bg-teal-600 bg-opacity-40 py-3 pl-4 pr-3"></div>
          </div>
          <div className="basis-1/5 rounded-full">
            <div className="h-2 w-2/3 rounded-full bg-teal-600 bg-opacity-40 py-3 pl-4 pr-3"></div>
          </div>
          <div className="basis-1/5 rounded-full">
            <div className="h-2 w-2/3 rounded-full bg-teal-600 bg-opacity-40 py-3 pl-4 pr-3"></div>
          </div>
          <div className="basis-1/5 rounded-full">
            <div className="h-2 w-2/3 rounded-full bg-teal-600 bg-opacity-40 py-3 pl-4 pr-3"></div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isExpanded && (
          <AssetExpanded
            id={id}
            chartData={chartDataLlama}
            refetchAssets={refetchAssets}
          />
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default AssetTableRow;
