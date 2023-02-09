import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";

import { api } from "../utils/api";
import AddAssetModal from "@/components/assets/AddAssetModal";
import AssetTable from "@/components/assets/AssetTable";

const Assets: NextPage = () => {
  return (
    <>
      <Head>
        <title>Assets</title>
        <meta name="description" content="Your Assers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen mx-auto">
        <AssetTable />
      </main>
    </>
  );
};

export default Assets;
