import {
  type ChartDataType,
  type DexScreenerType,
} from "@/utils/axios-requests";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import AssetExpanded from "./AssetExpanded";

type AssetTableRowProps = {
  index: number;
  id: string;
  symbol: string;
  amount: number;
  chartData: ChartDataType | undefined;
  dexScreenerData: DexScreenerType | undefined;
  refetchAssets: () => void;
};

const AssetTableRow = ({
  index,
  id,
  symbol,
  amount,
  chartData,
  dexScreenerData,
  refetchAssets,
}: AssetTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      {dexScreenerData ? (
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
            {parseFloat(dexScreenerData.data.priceUsd).toFixed(2)}
          </div>
          <div className="basis-1/5 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
            <span className="text-xs font-semibold text-teal-600">$</span>{" "}
            {(amount * parseFloat(dexScreenerData.data.priceUsd)).toFixed(2)}
          </div>
          <div className="flex basis-1/5 justify-between py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
            <div
              className={`max-w-fit rounded-full ${
                dexScreenerData.data.priceChange.h24 >= 0
                  ? "bg-green-300 px-2 text-green-800"
                  : "bg-red-300 px-2 text-red-800"
              }`}
            >
              <span>{dexScreenerData.data.priceChange.h24}</span>{" "}
              <span className="text-xs">%</span>
            </div>
            <ChevronUpIcon
              className={`h-5 w-5 stroke-2 text-teal-600 ${
                !isExpanded ? "rotate-180" : "rotate-0"
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
            chartData={chartData?.prices}
            refetchAssets={refetchAssets}
          />
        )}
      </AnimatePresence>
    </motion.li>
  );
};

export default AssetTableRow;
