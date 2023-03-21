import { zodResolver } from "@hookform/resolvers/zod";
import { type PortfolioAsset } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import Modal from "@/components/UI/Modal";
import { api } from "@/utils/api";
import AssetDropdown from "./AssetDropdown";

const FormSchema = z.object({
  transactionType: z.enum(["BUY", "SELL"], {
    invalid_type_error: "Transaction type is required.",
  }),
  assetSymbol: z
    .string({ invalid_type_error: "Asset is required." })
    .min(1, { message: `Asset is required.` }),
  amount: z
    .number({
      invalid_type_error: "Amount is required.",
    })
    .gt(0, { message: "Must be greater than 0." }),
});

export type FormSchemaType = {
  transactionType: "BUY" | "SELL" | "";
  assetSymbol: string;
  amount: number | undefined;
};

type AddTransactionModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchTransactions: () => void;
  refetchAssets: () => void;
  assetList: PortfolioAsset[] | undefined;
};

const AddTransactionModal = ({
  setOpen,
  refetchTransactions,
  refetchAssets,
  assetList,
}: AddTransactionModalProps) => {
  const { data: sessionData } = useSession();

  const createTransactionMutation =
    api.assetTransaction.createTransaction.useMutation();

  const updateAssetAmountMutation =
    api.portfolioAsset.updateAssetAmountById.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      transactionType: "",
      assetSymbol: "",
      amount: undefined,
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    const asset = assetList?.find(
      (asset) => asset.assetSymbol === data.assetSymbol
    );
    if (data.amount && asset && asset.amount) {
      if (data.transactionType === "SELL" && data.amount >= asset?.amount) {
        setError("amount", {
          type: "manual",
          message: "Cannot sell more than you own.",
        });
      } else {
        createTransactionMutation.mutate(
          {
            userId: sessionData?.user?.id as string,
            symbol: data.assetSymbol,
            amount: data.amount,
            type: data.transactionType as "BUY" | "SELL",
            portfolioAssetId: asset.id,
          },
          {
            onSuccess: () => {
              updateAssetAmountMutation.mutate({
                assetId: asset.id,
                amount:
                  data.transactionType === "BUY"
                    ? asset.amount + (data.amount as number)
                    : asset.amount - (data.amount as number),
              });
              setOpen(false);
              refetchTransactions();
            },
          }
        );
      }
    }
  };

  return (
    <Modal setOpen={setOpen}>
      <form
        //eslint-disable-next-line
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        action="#"
        method="POST"
      >
        <div className="bg-white">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Transaction
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new transaction you&apos;ve made.
              </p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <fieldset>
                <legend className="contents text-base font-medium text-gray-900">
                  Transaction type
                </legend>
                <p className="text-sm text-gray-500">
                  The type of the transaction you made.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="transaction-buy"
                      type="radio"
                      value="BUY"
                      className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                      {...register("transactionType", { required: true })}
                    />
                    <label
                      htmlFor="transaction-buy"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Buy
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="transaction-sell"
                      type="radio"
                      value="SELL"
                      className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                      {...register("transactionType", { required: true })}
                    />
                    <label
                      htmlFor="transaction-sell"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Sell
                    </label>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.transactionType && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: { duration: 0.1 },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.1 },
                      }}
                      className="mt-[2px] text-xs text-red-600"
                    >
                      {errors.transactionType.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </fieldset>

              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-base font-medium text-gray-700"
                    >
                      Asset
                      <p className=" text-sm font-normal text-gray-500">
                        Asset transacted.
                      </p>
                    </label>
                    <Controller
                      control={control}
                      name="assetSymbol"
                      render={({ field: { onChange, value } }) => (
                        <AssetDropdown
                          onChange={onChange}
                          value={value}
                          assetList={assetList?.map(
                            (asset) => asset.assetSymbol
                          )}
                        />
                      )}
                    />
                    <AnimatePresence>
                      {errors.assetSymbol && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: { duration: 0.1 },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: { duration: 0.1 },
                          }}
                          className="mt-[2px] text-xs text-red-600"
                        >
                          {errors.assetSymbol.message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-base font-medium text-gray-700"
                    >
                      Amount
                      <p className=" text-sm font-normal text-gray-500">
                        Amount transacted.
                      </p>
                    </label>
                    <input
                      type="text"
                      id="amount"
                      // defaultValue={formData.amount}
                      {...register("amount", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                    <AnimatePresence>
                      {errors.amount && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: { duration: 0.1 },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: { duration: 0.1 },
                          }}
                          className="mt-[2px] text-xs text-red-600"
                        >
                          {errors.amount.message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
