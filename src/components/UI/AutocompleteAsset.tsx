import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "usehooks-ts";
import { type SearchAssetType } from "../portfolio/AddAssetModal";
import axios from "axios";

type AutocompleteAssetProps = {
  selected: SearchAssetType;
  setSelected: (asset: SearchAssetType) => void;
};

const AutocompleteAsset = ({
  selected,
  setSelected,
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
      return data.coins.map((asset: { symbol: string; name: string }) => ({
        symbol: asset.symbol,
        name: asset.name,
      })) as SearchAssetType[];
    },
    enabled: debouncedQuery !== "",
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {}, [debouncedQuery]);

  console.log(queryData);

  return (
    <div className="fixed top-16 w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(asset: SearchAssetType) => asset.symbol}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {queryData?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                queryData?.map((asset) => (
                  <Combobox.Option
                    key={asset.symbol}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
                          {asset.name} ({asset.symbol})
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
