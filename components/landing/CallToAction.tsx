import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "./animationVariants";

const CallToAction: React.FC = () => (
  <section className="relative py-20 md:py-[120px] px-4 md:px-6 border-t border-white/10 overflow-hidden bg-black">
    {/* Radial glow background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] md:w-[1000px] md:h-[500px] bg-white/5 rounded-[100%] blur-[80px] md:blur-[100px] pointer-events-none" />

    <div className="relative max-w-[720px] mx-auto text-center z-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
        >
          Create Professional
          <br />
          Photos Today.
        </motion.h2>
        <motion.p
          variants={fadeUpVariants}
          className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 font-light"
        >
          Get started right from your phone. No equipment required.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="bg-white hover:bg-gray-200 text-black px-8 py-3.5 md:py-4 rounded-lg font-semibold text-lg hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center">
            Try Nexiro Free
          </button>
          <button className="bg-black border border-white/20 hover:bg-white/5 text-white px-8 py-3.5 md:py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors">
            Get 10 Free Credits
          </button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CallToAction;
