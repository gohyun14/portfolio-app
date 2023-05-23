import React from "react";
import { type AssetTransaction } from "@prisma/client";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

type RecentTransactionsProps = {
  transactions: AssetTransaction[];
};

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <motion.section
      className="my-8 rounded-md border border-zinc-300 bg-zinc-100 p-2 text-center text-gray-600 shadow-lg"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.14, ease: "easeInOut" },
      }}
    >
      <h3 className="mb-3 text-center text-xl">Recent Transactions</h3>
      <div className="flex flex-row justify-center">
        <ol className="flex flex-col gap-y-2">
          {transactions.map((transaction, idx) => (
            <li
              key={idx}
              className="flex flex-row items-center justify-start text-lg"
            >
              {transaction.type === "SELL" ? (
                <MinusIcon className="mr-2 h-5 w-5 rounded-full bg-red-500 p-0 text-red-700" />
              ) : (
                <PlusIcon className="mr-2 h-5 w-5 rounded-full bg-green-500 p-0 text-green-700" />
              )}
              <p>
                <span>{transaction.type === "SELL" ? "Sold" : "Bought"}</span>{" "}
                <span className="font-semibold">{`${transaction.amount} ${transaction.assetSymbol}`}</span>{" "}
                on{" "}
                <span className="underline">
                  {transaction.date.toLocaleDateString()}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </motion.section>
  );
};

export default RecentTransactions;
