import SignInModal from "@/components/UI/SignInModal";
import { getChartData, getDexScreenerData } from "@/utils/axios-requests";
import { type PortfolioAsset } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import AssetSpotlight from "@/components/portfolio/AssetSpotlight";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  // set default sorting if no sort order is set
  useEffect(() => {
    if (router && router.query.sidebar === undefined) {
      void router.push({
        pathname: router.pathname,
        query: { ...router.query, sidebar: "open" },
      });
    }
  });

  const [showModal, setShowModal] = useState(false);

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
      enabled: !!sessionData,
    }
  );

  // query for external chart data
  const { data: chartData } = useQuery({
    queryKey: ["getChartData"],
    queryFn: () => getChartData(assetsData),
    refetchOnWindowFocus: false,
    enabled: !!assetsData && assetsData.length > 0,
  });

  //query for external dexscreener data
  const { data: dexScreenerData } = useQuery({
    queryKey: ["getDexScreenData"],
    queryFn: () => getDexScreenerData(assetsData),
    refetchOnWindowFocus: false,
    enabled: !!assetsData && assetsData.length > 0,
  });

  return (
    <>
      <Head>
        <title>Assets</title>
        <meta name="description" content="Your Assers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-h-screen overflow-y-auto">
        {sessionData ? (
          <div>
            <PortfolioOverview
              assetsData={assetsData}
              dexScreenerData={dexScreenerData}
            />
            <AssetSpotlight
              assets={assetsData}
              dexScreenerData={dexScreenerData}
              chartData={chartData}
            />
          </div>
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

export default Home;
