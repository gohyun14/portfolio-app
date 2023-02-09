import { api } from "@/utils/api";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AssetExpandedPropsType = {
  // chartData:
  //   | {
  //       timestamp: number;
  //       price: number;
  //     }[]
  //   | undefined;
  id: string;
  refetchAssets: () => void;
};

const AssetExpanded = ({ id, refetchAssets }: AssetExpandedPropsType) => {
  const deleteAssetMutation = api.portfolioAsset.deleteAssetById.useMutation();

  // const chartSettings = {
  //   options: {
  //     chart: {
  //       id: "basic-bar",
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     colors: ["#0D9488"],
  //     xaxis: {
  //       type: "datetime",
  //     },
  //     tooltip: {
  //       x: {
  //         show: true,
  //         format: "dd MMM HH:mm:ss",
  //         formatter: undefined,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       name: "Price ($)",
  //       data: chartData?.map((data) => [
  //         data.timestamp * 1000,
  //         data.price.toFixed(4),
  //       ]),
  //     },
  //   ],
  // };

  return (
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
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 sm:w-auto"
        onClick={() =>
          deleteAssetMutation.mutate(
            { id: id },
            {
              onSuccess: () => refetchAssets(),
            }
          )
        }
      >
        Delete Asset
      </button>
      {/* <Chart
        options={chartSettings.options}
        series={chartSettings.series}
        type="area"
        width={"100%"}
        height={300}
      /> */}
    </motion.div>
  );
};

export default AssetExpanded;
