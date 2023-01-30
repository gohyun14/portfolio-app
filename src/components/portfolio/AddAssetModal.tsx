import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

import Modal from "@/components/UI/Modal";
import AutocompleteAsset from "../UI/AutocompleteAsset";

const FormSchema = z.object({
  assetType: z.enum(["STOCK", "CRYPTO"], {
    invalid_type_error: "Asset type is required.",
  }),
  assedId: z
    .string({ invalid_type_error: "Name is required." })
    .min(1, { message: "Name is required." }),
  amount: z
    .number({
      invalid_type_error: "Amount is required.",
    })
    .gt(0, { message: "Must be greater than 0." }),
});

type FormSchemaType = {
  assetType: "STOCK" | "CRYPTO" | "";
  assedId: string;
  amount: number | undefined;
};

type AddAssetModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type SearchAssetType = {
  symbol: string;
  name: string;
};

const AddAssetModal = ({ setOpen }: AddAssetModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState<SearchAssetType>({
    symbol: "",
    name: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const [formData, setFormData] = useState<FormSchemaType>({
    assetType: "",
    assedId: "",
    amount: undefined,
  });

  console.log(formData);

  const onSubmit = (data: FormSchemaType) => {
    setFormData(data);
    console.log(data);
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
                Add Asset
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new asset to your portfolio.
              </p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <fieldset>
                <legend className="contents text-base font-medium text-gray-900">
                  Asset type
                </legend>
                <p className="text-sm text-gray-500">
                  The type of the asset you want to add.
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="asset-type"
                      type="radio"
                      value="STOCK"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      {...register("assetType", { required: true })}
                    />
                    <label
                      htmlFor="push-email"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Stock
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="asset-type"
                      type="radio"
                      value="CRYPTO"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      {...register("assetType", { required: true })}
                    />
                    <label
                      htmlFor="push-nothing"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Crypto
                    </label>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.assetType && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.1 },
                      }}
                      className="mt-[2px] text-xs text-red-600"
                    >
                      {errors.assetType.message}
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
                      Name
                      <p className=" text-sm font-normal text-gray-500">
                        The symbol/ticker of the asset.
                      </p>
                    </label>
                    <input
                      type="text"
                      id="assetId"
                      defaultValue={formData.assedId}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...register("assedId", { required: true })}
                    />
                    <AnimatePresence>
                      {errors.assedId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: { duration: 0.15 },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: { duration: 0.1 },
                          }}
                          className="mt-[2px] text-xs text-red-600"
                        >
                          {errors.assedId.message}
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
                        Asset quantity (not usd).
                      </p>
                    </label>
                    <input
                      type="text"
                      id="amount"
                      defaultValue={formData.amount}
                      {...register("amount", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <AnimatePresence>
                      {errors.amount && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: { duration: 0.15 },
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

                  <AutocompleteAsset
                    selected={selectedAsset}
                    setSelected={setSelectedAsset}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAssetModal;
