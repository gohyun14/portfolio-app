import React from "react";
import SideNav from "./SideNav";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: sessionData } = useSession();
  return (
    <main className="flex">
      {sessionData?.user && (
        <motion.div
          initial={{ x: -224, width: 0 }}
          animate={{
            x: 0,
            width: "auto",
            transition: { duration: 0.4, ease: "easeOut" },
          }}
          className="h-screen"
        >
          <SideNav user={sessionData?.user} />
        </motion.div>
      )}
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
    </main>
  );
};

export default MainLayout;
