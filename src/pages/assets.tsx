import SignInModal from "@/components/UI/SignInModal";
import { AnimatePresence } from "framer-motion";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

import AssetTable from "@/components/assets/AssetTable";

const Assets: NextPage = () => {
  const { data: sessionData } = useSession();

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Head>
        <title>Assets</title>
        <meta name="description" content="Your Assers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto min-h-screen">
        {sessionData ? (
          <AssetTable />
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
