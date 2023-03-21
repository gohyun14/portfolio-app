import { api } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import WarningModal from "../UI/WarningModal";
import AssetLineChart from "./AssetLineChart";

type AssetExpandedProps = {
  id: string;
  chartData:
    | {
        timestamp: number;
        price: number;
      }[]
    | undefined;
  refetchAssets: () => void;
};

const AssetExpanded = ({
  id,
  chartData,
  refetchAssets,
}: AssetExpandedProps) => {
  const router = useRouter();

  const deleteAssetMutation = api.portfolioAsset.deleteAssetById.useMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, height: 0 },
          visible: {
            opacity: 1,
            height: "auto",
            transition: { delay: 0.05 },
          },
          closed: { opacity: 0, height: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="closed"
        className="px-2"
      >
        <AssetLineChart chartData={chartData} />
        <div className="mb-3 mr-2 flex flex-row justify-end gap-x-2">
          <motion.button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-2 py-2 text-xs font-normal text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => setIsModalOpen(true)}
            whileTap={{
              scale: 0.95,
              borderRadius: "8px",
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 8,
              mass: 0.5,
            }}
          >
            Delete asset
          </motion.button>
          <Link
            href={`/transactions?sidebar=${
              router.query.sidebar ? (router.query.sidebar as string) : "open"
            }&sort=date&order=desc`}
          >
            <motion.button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-2 py-2 text-xs font-normal text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
              whileTap={{
                scale: 0.95,
                borderRadius: "8px",
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 8,
                mass: 0.5,
              }}
            >
              Add transaction
            </motion.button>
          </Link>
        </div>
      </motion.div>
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
              deleteAssetMutation.mutate(
                { id: id },
                {
                  onSuccess: () => {
                    refetchAssets();
                    setIsModalOpen(false);
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

export default AssetExpanded;
