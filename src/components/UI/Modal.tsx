import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

type ModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const Modal = ({ setOpen, children }: ModalProps) => {
  return (
    <Dialog as="div" className="relative z-10" onClose={setOpen} open={true}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.13, ease: "circOut" },
        }}
        exit={{ opacity: 0, transition: { duration: 0.15, ease: "circIn" } }}
        className="fixed inset-0 bg-black bg-opacity-30"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel
            as={motion.div}
            initial={{ opacity: 0, scale: 0.7, y: 35 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.13, ease: "circOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0,
              transition: { duration: 0.15, ease: "circIn" },
            }}
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
          >
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
