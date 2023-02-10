import React from "react";
import Modal from "./Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";

type SignOutModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  message: string;
  labelCancel: string;
  labelSubmit: string;
  onCancel: () => void;
  onSubmit: () => void;
};

const WarningModal = ({
  setOpen,
  title,
  message,
  labelCancel,
  labelSubmit,
  onCancel,
  onSubmit,
}: SignOutModalProps) => {
  return (
    <>
      <Modal setOpen={setOpen}>
        <div className=" sm:w-[24rem]">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <ExclamationTriangleIcon
                className="h-8 w-8 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-4">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              onClick={onSubmit}
            >
              {labelSubmit}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              onClick={onCancel}
            >
              {labelCancel}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WarningModal;
