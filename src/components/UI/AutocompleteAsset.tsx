import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { type SearchAssetType } from "../assets/AddAssetModal";
import { ControllerRenderProps } from "react-hook-form";

const AutocompleteAsset = ({
  onChange,
  onBlur,
  value,
  name,
}: ControllerRenderProps) => {
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

  useEffect(() => {
    if (debouncedQuery !== "") {
      refetchQuery().catch((err) => console.log(err));
    }
  }, [debouncedQuery, refetchQuery]);

  console.log(queryData);

  return (
    <div className="">
      <Combobox value={value as SearchAssetType} onChange={onChange}>
        <div className="relative w-full">
          <div className="relative w-full cursor-default overflow-hidden rounded-md text-left shadow-sm">
            <Combobox.Input
              as="input"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              displayValue={(asset: SearchAssetType) => asset.symbol}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 mt-1 flex items-center pr-2">
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
            <Combobox.Options className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {queryData?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                queryData?.map((asset) => (
                  <Combobox.Option
                    key={asset.symbol + asset.name}
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
