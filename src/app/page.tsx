"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "../components/ui/aurora-background";
import DecryptedText from "@/components/ui/decryptedText";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0,
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            <DecryptedText
              text="Find Bugs. Fix Bugs."
              speed={50}
              maxIterations={20}
              characters="ABCD1234!?"
              className="revealed"
              parentClassName="all-letters"
              encryptedClassName="encrypted"
              animateOn="view"
              sequential
            />
          </div>
          <div className="font-extralight text-base md:text-3xl dark:text-neutral-200 py-4 text-center">
            Login with your Team credentials and start debugging!
          </div>
          <button
            className="bg-black dark:bg-white rounded-none hover:font-semibold h-10 hover:rounded-4xl w-fit text-white dark:text-black px-4 py-2 cursor-pointer hover:bg-emerald-900 hover:text-white transition-all duration-300"
            onClick={() => router.push("/login")}
          >
            Debug now
          </button>
        </motion.div>
      </AuroraBackground>
    </>
  );
}
