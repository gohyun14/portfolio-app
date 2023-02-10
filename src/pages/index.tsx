import { AnimatePresence } from "framer-motion";
import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

import SignInModal from "@/components/UI/SignInModal";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery(
    { text: "from tRPC" },
    { refetchOnWindowFocus: false }
  );

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-gray-700">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined, refetchOnWindowFocus: false }
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-gray-700">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={
            sessionData ? () => void signOut() : () => setShowModal(true)
          }
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
      <AnimatePresence>
        {showModal && <SignInModal setOpen={setShowModal} />}
      </AnimatePresence>
    </>
  );
};
