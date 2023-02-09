import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

const headerColums = [
  { name: "Asset", sort: "asset" },
  { name: "Amount", sort: "amount" },
  { name: "Price", sort: "price" },
  { name: "Value", sort: "value" },
  { name: "Change (24h)", sort: "change" },
];

const AssetTableHeader = () => {
  const router = useRouter();

  return (
    <header className="flex flex-row rounded-t-md border-b border-b-gray-300 bg-gray-100">
      {headerColums.map((column) => (
        <div
          key={column.name}
          onClick={() =>
            void router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                sort: column.sort,
                order:
                  router.query.sort === column.sort
                    ? router.query.order === "asc"
                      ? "desc"
                      : "asc"
                    : router.query.order,
              },
            })
          }
          className="group flex basis-1/5 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 hover:cursor-pointer sm:pl-6"
        >
          {column.name}
          {router.query.sort && (
            <span
              className={
                router.query.sort === column.sort
                  ? "ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300"
                  : "invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
              }
            >
              <ChevronDownIcon
                aria-hidden="true"
                className={`h-5 w-5 ${
                  router.query.order === "asc" ? "rotate-180" : "rotate-0"
                } transition duration-[150ms] ease-in-out`}
              />
            </span>
          )}
        </div>
      ))}
    </header>
  );
};

export default AssetTableHeader;
