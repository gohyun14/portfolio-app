import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";

const Portfolio: NextPage = () => {
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
        No portfolio yet, but you can create one!
      </main>
    </>
  );
};

export default Portfolio;
