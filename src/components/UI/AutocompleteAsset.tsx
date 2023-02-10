import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { type SearchAssetType } from "../assets/AddAssetModal";

type AutocompleteAssetProps = {
  onChange: (...event: any[]) => void;
  value: SearchAssetType;
  assetList: string[] | undefined;
};

const AutocompleteAsset = ({
  onChange,
  value,
  assetList,
}: AutocompleteAssetProps) => {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce<string>(query, 500);

  const {
    data: queryData,
    isLoading: isQueryLoading,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ["searchAssets"],
    queryFn: async () => {
      // eslint-disable-next-line
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/search?query=${debouncedQuery}`
      );
      // eslint-disable-next-line
      return data.coins
        .map((asset: { symbol: string; api_symbol: string }) => ({
          symbol: asset.symbol,
          name: asset.api_symbol,
        }))
        .filter(
          (asset: SearchAssetType) => !assetList?.includes(asset.name)
        ) as SearchAssetType[];
    },
    enabled: debouncedQuery !== "",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (debouncedQuery !== "") {
      refetchQuery().catch((err) => console.log(err));
    }
  }, [debouncedQuery, refetchQuery]);

  return (
    <div className="">
      <Combobox value={value} onChange={onChange}>
        <div className="relative w-full">
          <Combobox.Input
            as="input"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            displayValue={(asset: SearchAssetType) => asset.symbol}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="fixed z-10 mt-1 max-h-52 w-min overflow-y-scroll rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {queryData?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                queryData?.map((asset) => (
                  <Combobox.Option
                    key={asset.symbol + asset.name}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={asset}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          <span className="capitalize">
                            {asset.name.split("-").join(" ")}
                          </span>{" "}
                          ({asset.symbol})
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default AutocompleteAsset;
