import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AssetDonutChartProps = {
  chartData:
    | {
        value: number;
        label: string;
      }[]
    | undefined;
};

const AssetDonutChart = ({ chartData }: AssetDonutChartProps) => {
  const chartSettings = {
    series: chartData?.map((data) => data.value),
    options: {
      labels: chartData?.map((data) => data.label),
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val: number) {
            return "$" + val.toString();
          },
          title: {
            formatter: function (seriesName: string) {
              return seriesName + ":";
            },
          },
        },
      },
      chart: {
        type: "donut" as const,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <Chart
      options={chartSettings.options}
      series={chartSettings.series}
      type="donut"
      width={"100%"}
      height={300}
    />
  );
};

export default AssetDonutChart;
