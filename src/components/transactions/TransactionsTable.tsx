import {
  type ChartDataType,
  type DexScreenerType,
} from "@/utils/axios-requests";
import { type PortfolioAsset, type AssetTransaction } from "@prisma/client";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AddTransactionModal from "./AddTransactionModal";
import TransactionTableHeader from "./TransactionTableHeader";
import TransactionTableRow from "./TransactionTableRow";

type TransactionTableProps = {
  assetsData: PortfolioAsset[] | undefined;
  transactionsData: AssetTransaction[] | undefined;
  dexScreenerData: DexScreenerType[] | undefined;
  refetchTransactions: () => void;
  refetchAssets: () => void;
};

const TransactionTable = ({
  assetsData,
  transactionsData,
  dexScreenerData,
  refetchTransactions,
  refetchAssets,
}: TransactionTableProps) => {
  const { query } = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedTransactionData, setSortedTransactionData] = useState<
    AssetTransaction[] | undefined
  >(undefined);

  useEffect(() => {
    if (transactionsData && dexScreenerData && query.sort && query.order) {
      setSortedTransactionData([
        ...transactionsData.sort((a, b) => {
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
          } else if (query.sort === "value") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? a.amount * parseFloat(aEntry.data.priceUsd) -
                    b.amount * parseFloat(bEntry.data.priceUsd)
                : b.amount * parseFloat(bEntry.data.priceUsd) -
                    a.amount * parseFloat(aEntry.data.priceUsd);
            else return 0;
          } else if (query.sort === "date") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? a.date.getTime() - b.date.getTime()
                : b.date.getTime() - a.date.getTime();
            else return 0;
          } else if (query.sort === "type") {
            if (aEntry && bEntry)
              return query.order === "asc"
                ? a.type.localeCompare(b.type)
                : b.type.localeCompare(a.type);
            else return 0;
          } else {
            return 0;
          }
        }),
      ]);
    } else {
      setSortedTransactionData(transactionsData);
    }
  }, [query, transactionsData, dexScreenerData]);

  return (
    <>
      <div className="mt-10">
        <div className="mb-5 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the transactions you&apos;ve made in your portfolio
              including the asset&apos;s symbol, amount, and date.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Add transaction
            </button>
          </div>
        </div>
        <div className="flex flex-col rounded-md border border-gray-300 shadow-md">
          <TransactionTableHeader />
          <LayoutGroup>
            <motion.ul
              layout
              className="max-h-[77vh] divide-y divide-gray-300 overflow-y-auto rounded-b-md text-left"
            >
              <AnimatePresence>
                {sortedTransactionData?.map((transaction, i) => (
                  <TransactionTableRow
                    key={transaction.id}
                    index={i}
                    id={transaction.id}
                    symbol={transaction.assetSymbol}
                    assetId={transaction.portfolioAssetId}
                    transactionAmount={transaction.amount}
                    totalAmount={
                      assetsData?.find(
                        (asset) => asset.assetSymbol === transaction.assetSymbol
                      )?.amount as number
                    }
                    date={transaction.date}
                    type={transaction.type}
                    dexScreenerData={dexScreenerData?.find(
                      (item) => item.symbol === transaction.assetSymbol
                    )}
                    refetchTransactions={refetchTransactions}
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
          <AddTransactionModal
            setOpen={setIsModalOpen}
            refetchTransactions={refetchTransactions}
            refetchAssets={refetchAssets}
            assetList={assetsData}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TransactionTable;
