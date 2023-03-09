import SignInModal from "@/components/UI/SignInModal";
import { getChartData, getDexScreenerData } from "@/utils/axios-requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AssetTable from "@/components/assets/AssetTable";
import { api } from "@/utils/api";

const Assets: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  // set default sorting if no sort order is set
  useEffect(() => {
    if (router && router.query.sort === undefined) {
      void router.push({
        pathname: router.pathname,
        query: { ...router.query, sort: "none", order: "asc" },
      });
    }
  });

  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = api.portfolioAsset.getAllAssetsByUserId.getQueryKey(
    {
      userId: sessionData?.user?.id as string,
    },
    "query"
  );
  const assetQueryData = queryClient.getQueryData(queryKey);

  // query for assets from trpc
  const {
    data: assetsData,
    isLoading: isAssetsDataLoading,
    refetch: refetchAssetData,
    isFetching: isAssetsDataFetching,
  } = api.portfolioAsset.getAllAssetsByUserId.useQuery(
    { userId: sessionData?.user?.id as string },
    {
      refetchOnWindowFocus: false,
      enabled: !!sessionData && assetQueryData === undefined,
    }
  );

  // query for external chart data
  const { data: chartData, refetch: refetchChartData } = useQuery({
    queryKey: ["getChartData"],
    queryFn: () => getChartData(assetsData),
    refetchOnWindowFocus: false,
    enabled: !!assetsData && assetsData.length > 0,
  });

  //query for external dexscreener data
  const { data: dexScreenerData, refetch: refetchDexScreenerData } = useQuery({
    queryKey: ["getDexScreenData"],
    queryFn: () => getDexScreenerData(assetsData),
    refetchOnWindowFocus: false,
    enabled: !!assetsData && assetsData.length > 0,
    onSuccess: () => {
      console.log("dexScreenerData", dexScreenerData);
    },
  });

  return (
    <>
      <Head>
        <title>Assets</title>
        <meta name="description" content="Your Assers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto">
        {sessionData ? (
          <AssetTable
            assetsData={assetsData}
            chartData={chartData}
            dexScreenerData={dexScreenerData}
            refetchAssets={() =>
              void refetchAssetData().then(() =>
                refetchChartData().then(() => refetchDexScreenerData())
              )
            }
          />
        ) : (
          <div className="flex min-h-screen items-center">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setShowModal(true)}
            >
              Sign in
            </button>
          </div>
        )}
      </main>
      <AnimatePresence>
        {showModal && <SignInModal setOpen={setShowModal} />}
      </AnimatePresence>
    </>
  );
};

export default Assets;
