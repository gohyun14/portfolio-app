import React from "react";
import { type DexScreenerType } from "@/utils/axios-requests";
import { motion } from "framer-motion";

import AssetDonutChart from "./AssetDonutChart";

type PortfolioBodyProps = {
  chartData:
    | {
        value: number;
        label: string;
      }[]
    | undefined;
  top3: DexScreenerType[] | undefined;
  bottom3: DexScreenerType[] | undefined;
};

const PortfolioBody = ({ chartData, top3, bottom3 }: PortfolioBodyProps) => {
  return (
    <section className="mt-8 flex flex-row gap-x-6">
      {chartData && chartData.length > 0 && (
        <motion.div
          className="basis-2/3 rounded-md border border-zinc-300 bg-zinc-100 p-2 text-gray-600 shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.14, ease: "easeInOut" },
          }}
        >
          <h3 className="mb-3 text-center text-xl">Portfolio Composition</h3>
          <AssetDonutChart chartData={chartData} />
        </motion.div>
      )}

      <div className="flex basis-1/3 flex-col justify-start gap-y-8">
        {top3 && top3.length > 0 && (
          <motion.div
            className="rounded-md border border-green-500 bg-green-300 p-2 text-green-800 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.14, ease: "easeInOut" },
            }}
          >
            <h3 className="mb-2 text-center text-xl">Best Performers</h3>
            <ol className="relative text-left">
              {top3.map((asset, idx) => (
                <li key={asset.symbol} className="mb-2 ml-5">
                  <span className="absolute -left-[3px] rounded-full bg-green-800 px-1 text-green-400">
                    {idx + 1}
                  </span>
                  <span className="font-semibold">{asset.symbol}</span>:{" "}
                  <span>
                    {asset.data.priceChange.h24}
                    <span className="text-sm"> %</span>
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
        {bottom3 && bottom3.length > 0 && (
          <motion.div
            className="rounded-md border border-red-500 bg-red-300 p-2 text-red-800 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.14, ease: "easeInOut" },
            }}
          >
            <h3 className="mb-2 text-center text-xl">Worst Performers</h3>
            <ol className="relative text-left">
              {bottom3.map((asset, idx) => (
                <li key={asset.symbol} className="mb-2 ml-5">
                  <span className="absolute -left-[3px] rounded-full bg-red-800 px-1 text-red-400">
                    {idx + 1}
                  </span>
                  <span className="font-semibold">{asset.symbol}</span>:{" "}
                  <span>
                    {asset.data.priceChange.h24}
                    <span className="text-sm"> %</span>
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PortfolioBody;
