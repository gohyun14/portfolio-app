import {
  ChartBarIcon,
  ListBulletIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { type Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { signOut } from "next-auth/react";

import WarningModal from "../UI/WarningModal";

const navigation = [
  {
    name: "Portfolio",
    icon: ChartBarIcon,
    href: "/?sidebar=open",
    path: "/",
    current: true,
  },
  {
    name: "Assets",
    icon: CurrencyDollarIcon,
    href: "/assets?sidebar=open&sort=asset&order=asc",
    path: "/assets",
    current: false,
  },
  {
    name: "Transactions",
    icon: ListBulletIcon,
    href: "/transactions?sidebar=open",
    path: "/transactions",
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type SideNavProps = {
  user: Session["user"];
};

const SideNav = ({ user }: SideNavProps) => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex h-full min-h-0 w-56 flex-1 flex-col bg-gray-800">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <XMarkIcon
            className="absolute left-2 top-2 h-9 w-9 rounded-full bg-gray-800 p-1 text-gray-300 hover:cursor-pointer hover:bg-gray-700 hover:text-white"
            onClick={() =>
              void router.push({
                pathname: router.pathname,
                query: { ...router.query, sidebar: "closed" },
              })
            }
          />
          <nav
            className="mt-11 flex-1 space-y-2 bg-gray-800 px-2"
            aria-label="Sidebar"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  router.pathname === item.path
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                )}
              >
                <item.icon
                  className={classNames(
                    router.pathname === item.path
                      ? "text-gray-300"
                      : "text-gray-400 group-hover:text-gray-300",
                    "mr-3 h-7 w-7 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        {user && (
          <div className="flex flex-shrink-0 bg-gray-700 p-4">
            <button
              onClick={() => setModalOpen(true)}
              className="group block w-full flex-shrink-0"
            >
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.image || ""}
                    alt=""
                  />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    Sign out
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {modalOpen && (
          <WarningModal
            setOpen={setModalOpen}
            title="Sign out"
            message="Are you sure you want to sign out?"
            labelCancel="Cancel"
            labelSubmit="Sign out"
            onCancel={() => setModalOpen(false)}
            onSubmit={() => {
              setModalOpen(false);
              void signOut();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SideNav;
