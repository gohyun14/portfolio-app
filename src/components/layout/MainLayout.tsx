import { useEffect, useState } from "react";
import SideNav from "./SideNav";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: sessionData } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (router && router.query.sidebar === undefined) {
      void router.push({
        pathname: router.pathname,
        query: { ...router.query, sidebar: "open" },
      });
    }
  });

  return (
    <main className="relative flex">
      {/* {sessionData?.user && ( */}
      {router.query.sidebar === "closed" && (
        <Bars3Icon
          className="absolute left-2 top-2 h-9 w-9 rounded-full bg-transparent p-[5px] text-gray-800 hover:cursor-pointer hover:bg-gray-700 hover:text-white"
          onClick={() =>
            void router.push({
              pathname: router.pathname,
              query: { ...router.query, sidebar: "open" },
            })
          }
        />
      )}
      <AnimatePresence>
        {router.query.sidebar === "open" && (
          <>
            <motion.div
              onClick={() =>
                void router.push({
                  pathname: router.pathname,
                  query: { ...router.query, sidebar: "closed" },
                })
              }
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.1, ease: "easeIn" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.1, ease: "easeOut" },
              }}
              className="absolute h-full w-full bg-black bg-opacity-20 sm:hidden"
            ></motion.div>
            <motion.div
              initial={{ x: -224, width: 0 }}
              animate={{
                x: 0,
                width: "auto",
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              exit={{
                x: -224,
                width: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              className="h-screen"
            >
              <SideNav user={sessionData?.user} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* )} */}
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
    </main>
  );
};

export default MainLayout;
