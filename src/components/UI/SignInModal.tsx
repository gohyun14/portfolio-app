import React from "react";
import Modal from "./Modal";
import { signIn, getProviders } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

type SignInModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignInModal = ({ setOpen }: SignInModalProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["getProviders"],
    queryFn: () => getProviders(),
  });

  return (
    <>
      <Modal setOpen={setOpen}>
        <div className="flex flex-col items-center">
          {data &&
            Object.values(data).map((provider) => (
              <div key={provider.name}>
                <button
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => void signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default SignInModal;
