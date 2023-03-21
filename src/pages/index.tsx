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
import Link from "next/link";

import AssetSpotlight from "@/components/portfolio/AssetSpotlight";
import RecentTransactions from "@/components/portfolio/RecentTransactions";
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

  // query for transactions from trpc
  const {
    data: transactionsData,
    isLoading: isTransactionsDataLoading,
    refetch: refetchTransactionsData,
  } = api.assetTransaction.getAllTransactionsByUserId.useQuery(
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
            {assetsData && assetsData.length > 0 ? (
              <div>
                <PortfolioOverview
                  assetsData={assetsData}
                  dexScreenerData={dexScreenerData}
                />
                {/* <AssetSpotlight
                  assets={assetsData}
                  dexScreenerData={dexScreenerData}
                  chartData={chartData}
                /> */}
                {transactionsData && transactionsData.length > 0 && (
                  <RecentTransactions
                    transactions={transactionsData.slice(0, 5)}
                  />
                )}
              </div>
            ) : (
              <div className="mt-12 text-center">
                <h1 className="text-3xl font-medium text-gray-800 md:text-5xl">
                  Your portfolio is worth... Nothing!
                </h1>
                <h2 className="mt-3 text-xl font-medium text-gray-700 md:text-3xl">
                  Go to the{" "}
                  <Link
                    href={`/assets?sort=asset&order=asc&sidebar=${
                      router.query.sidebar
                        ? (router.query.sidebar as string)
                        : "open"
                    }`}
                    className="text-teal-600 underline hover:cursor-pointer hover:text-teal-700"
                  >
                    Assets Page
                  </Link>{" "}
                  start your portfolio!
                </h2>
              </div>
            )}
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
