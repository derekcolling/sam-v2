import { motion } from "framer-motion";

export const Greeting = () => {
  return (
    <div className="mx-auto mt-4 flex w-full max-w-2xl flex-col px-0 md:mt-8">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Downtown Santa Monica"
          className="size-[64px] rounded-full shadow-md"
          src="/images/dtsm-logo-circle.jpeg"
        />
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Hey, I'm Sam
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-lg text-muted-foreground"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Your guide to Downtown Santa Monica — restaurants, parking, events, and more.
      </motion.div>
    </div>
  );
};
