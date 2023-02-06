import { useState, useEffect } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";

import { api } from "../utils/api";
import AddAssetModal from "@/components/assets/AddAssetModal";

const Assets: NextPage = () => {
  // const hello = api.example.hello.useQuery(
  //   { text: "from tRPC" },
  //   { refetchOnWindowFocus: false }
  // );
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Assets</title>
        <meta name="description" content="Your Assers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        No portfolio yet, but you can create one!
        <button onClick={() => setIsModalOpen(true)}>click me!</button>
      </main>
      <AnimatePresence>
        {isModalOpen && <AddAssetModal setOpen={setIsModalOpen} />}
      </AnimatePresence>
    </>
  );
};

export default Assets;
