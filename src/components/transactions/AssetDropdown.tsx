import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

type AssetDropdownProps = {
  onChange: (...event: any[]) => void;
  value: string;
  assetList: string[] | undefined;
};

const AssetDropdown = ({ onChange, value, assetList }: AssetDropdownProps) => {
  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full">
          <Listbox.Button
            as="button"
            className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            <span className="block h-9 py-2 px-3 text-left">{value}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="fixed z-10 mt-1 max-h-52 w-min overflow-y-scroll rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {assetList?.map((asset, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-100 text-teal-900" : "text-gray-900"
                    }`
                  }
                  value={asset}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {asset}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default AssetDropdown;
