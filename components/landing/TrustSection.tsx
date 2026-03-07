import React from "react";
import { motion } from "framer-motion";

const BRANDS = [
  "Kurtos Bistro",
  "Subdeli",
  "RedApple",
  "Pure Desi",
  "Usta Kebabs",
  "Scents & Secrets",
  "Iron Plate",
];

const TrustSection: React.FC = () => (
  <section className="py-12 border-y border-white/10 bg-black overflow-hidden flex flex-col items-center">
    <div className="max-w-[1200px] w-full text-center relative pointer-events-none">
      <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-wider">
        Used by teams creating modern content
      </p>

      {/* Marquee Container */}
      <div className="relative flex overflow-hidden w-full bg-black group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex flex-nowrap whitespace-nowrap min-w-max items-center"
        >
          {/* Duplicate list for seamless loop */}
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div
              key={i}
              className="text-xl md:text-3xl font-bold text-white/50 hover:text-white transition-colors px-8 md:px-12 flex items-center shrink-0 tracking-wide pointer-events-auto cursor-default"
            >
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default TrustSection;
