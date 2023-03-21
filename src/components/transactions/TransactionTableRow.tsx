import { type DexScreenerType } from "@/utils/axios-requests";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import WarningModal from "@/components/UI/WarningModal";
import { api } from "@/utils/api";

type TransactionTableRowProps = {
  index: number;
  id: string;
  symbol: string;
  assetId: string;
  transactionAmount: number;
  totalAmount: number;
  date: Date;
  type: "BUY" | "SELL" | "INITIAL";
  dexScreenerData: DexScreenerType | undefined;
  refetchTransactions: () => void;
  refetchAssets: () => void;
};

const TransactionTableRow = ({
  index,
  id,
  symbol,
  assetId,
  transactionAmount,
  totalAmount,
  date,
  type,
  dexScreenerData,
  refetchTransactions,
  refetchAssets,
}: TransactionTableRowProps) => {
  const deleteTransactionMutation =
    api.assetTransaction.deleteTransactionById.useMutation();

  const updateAssetAmountMutation =
    api.portfolioAsset.updateAssetAmountById.useMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const transactionType =
    type === "INITIAL" ? "Asset Added" : type === "BUY" ? "Buy" : "Sell";

  return (
    <>
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
        className="group flex flex-col bg-white last:rounded-b-md"
      >
        {dexScreenerData ? (
          <div className="flex flex-row">
            <div className="basis-1/6 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              <span>{symbol}</span>
            </div>
            <div className="basis-1/6 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
              {transactionAmount.toFixed(2)}
            </div>
            <div className="basis-1/6 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
              <span className="text-xs font-semibold text-teal-600">$</span>{" "}
              {(
                transactionAmount * parseFloat(dexScreenerData.data.priceUsd)
              ).toFixed(2)}
            </div>
            <div className="basis-1/6 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
              {date.toLocaleDateString()}
            </div>
            <div className="flex basis-1/6 justify-between py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
              <div
                className={`max-w-fit rounded-full px-2 ${
                  transactionType === "Buy"
                    ? "bg-green-300 text-green-800"
                    : transactionType === "Sell"
                    ? "bg-red-300 text-red-800"
                    : "bg-blue-300 text-blue-800"
                }`}
              >
                <span>{transactionType}</span>
              </div>
            </div>
            {type !== "INITIAL" && (
              <div className="flex basis-1/6 flex-row justify-end gap-x-4 py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
                {(type === "SELL" ||
                  (type === "BUY" && transactionAmount < totalAmount)) && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="font-semibold text-red-600 hover:cursor-pointer hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex basis-full animate-pulse flex-row p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="basis-1/6 rounded-full">
                <div className="h-2 w-2/3 rounded-full bg-teal-600 bg-opacity-40 py-3 pl-4 pr-3"></div>
              </div>
            ))}
          </div>
        )}
      </motion.li>
      <AnimatePresence>
        {isModalOpen && (
          <WarningModal
            setOpen={setIsModalOpen}
            title="Delete asset"
            message="Are you sure you want to delete this asset? This cannot be undone."
            labelCancel="Cancel"
            labelSubmit="Delete"
            onCancel={() => setIsModalOpen(false)}
            onSubmit={() =>
              deleteTransactionMutation.mutate(
                { id: id },
                {
                  onSuccess: () => {
                    updateAssetAmountMutation.mutate(
                      {
                        assetId: assetId,
                        amount:
                          type === "BUY"
                            ? totalAmount - transactionAmount
                            : totalAmount + transactionAmount,
                      },
                      {
                        onSuccess: () => {
                          refetchAssets();
                        },
                      }
                    );
                    setIsModalOpen(false);
                    refetchTransactions();
                  },
                }
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TransactionTableRow;
