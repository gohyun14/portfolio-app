import { useState } from "react";
import { api } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import WarningModal from "../UI/WarningModal";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AssetExpandedPropsType = {
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
}: AssetExpandedPropsType) => {
  const deleteAssetMutation = api.portfolioAsset.deleteAssetById.useMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const chartSettings = {
    options: {
      chart: {
        id: "basic-bar",
        type: "area" as const,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ["#0D9488"],
      xaxis: {
        //eslint-disable-next-line
        type: "datetime" as const,
      },
      tooltip: {
        x: {
          show: true,
          format: "dd MMM HH:mm:ss",
          formatter: undefined,
        },
      },
    },
    series: [
      {
        name: "Price ($)",
        type: "area",
        //eslint-disable-next-line
        data: chartData
          ? (chartData?.map((data) => [
              data.timestamp * 1000,
              data.price.toFixed(4),
            ]) as any)
          : [],
      },
    ],
  };

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
        <Chart
          options={chartSettings.options}
          series={chartSettings.series}
          type="area"
          width={"100%"}
          height={300}
        />
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
