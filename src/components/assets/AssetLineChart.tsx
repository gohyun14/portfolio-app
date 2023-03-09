import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AssetLineChartProps = {
  chartData:
    | {
        timestamp: number;
        price: number;
      }[]
    | undefined;
};

const AssetLineChart = ({ chartData }: AssetLineChartProps) => {
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
    <Chart
      options={chartSettings.options}
      series={chartSettings.series}
      type="area"
      width={"100%"}
      height={300}
    />
  );
};

export default AssetLineChart;
