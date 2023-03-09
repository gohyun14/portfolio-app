import { type PortfolioAsset } from "@prisma/client";
import axios from "axios";

export type ChartDataType = {
  symbol: string;
  name: string;
  prices: {
    timestamp: number;
    price: number;
  }[];
};

export const getChartData = async (
  assetsData: PortfolioAsset[] | undefined
) => {
  const coins = assetsData
    ?.map((asset) => `coingecko:${asset.assetName.toLowerCase()}`)
    .join(",");
  // eslint-disable-next-line
  const { data } = await axios.get(
    `https://coins.llama.fi/chart/${
      coins as string
    }?start=${Date.now().toString()}&span=24&period=1H&searchWidth=1H`
  );
  return assetsData?.map((asset) => {
    return {
      symbol: asset.assetSymbol,
      name: asset.assetName,
      // eslint-disable-next-line
      prices:
        // eslint-disable-next-line
        data.coins[`coingecko:${asset.assetName.toLowerCase()}`].prices,
    };
  }) as ChartDataType[];
};

export type DexScreenerReturnType = {
  baseToken: { symbol: string };
  priceChange: { m5: number; h1: number; h6: number; h24: number };
  priceUsd: string;
};

export const getDexScreenerDataSingleAsset = async (symbol: string) => {
  // eslint-disable-next-line
  const { data } = await axios.get(
    `https://api.dexscreener.com/latest/dex/search?q=${symbol}`
  );
  // eslint-disable-next-line
  return data.pairs
    .map((pair: DexScreenerReturnType) => {
      return {
        baseToken: { symbol: pair.baseToken.symbol },
        priceChange: pair.priceChange,
        priceUsd: pair.priceUsd,
      };
    })
    .find(
      (pair: DexScreenerReturnType) => pair.baseToken.symbol === symbol
    ) as DexScreenerReturnType;
};

export type DexScreenerType = {
  symbol: string;
  name: string;
  data: DexScreenerReturnType;
};

export const getDexScreenerData = async (
  assetsData: PortfolioAsset[] | undefined
) => {
  return Promise.all(
    assetsData?.map(async (asset) => {
      return {
        symbol: asset.assetSymbol,
        name: asset.assetName,
        // eslint-disable-next-line
        data: await getDexScreenerDataSingleAsset(asset.assetSymbol),
      };
    }) as Promise<DexScreenerType>[]
  );
};
