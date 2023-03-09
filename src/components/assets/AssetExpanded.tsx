import { api } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
        <div className="mb-3 mr-2 text-right">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-2 py-2 text-xs font-normal text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Delete Asset
          </button>
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
