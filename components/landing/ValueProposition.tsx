import React from "react";
import { motion } from "framer-motion";
import { Camera, Wand2, Sparkles, LucideIcon } from "lucide-react";
import { fadeUpVariants, staggerContainer } from "./animationVariants";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon: Icon, title, desc }) => (
  <motion.div
    variants={fadeUpVariants}
    className="p-8 border border-white/10 rounded-xl bg-[#0A0A0A] hover:bg-[#111] hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-lg bg-white/5 text-white flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-6 h-6 stroke-[1.5]" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-400 font-light leading-relaxed">{desc}</p>
  </motion.div>
);

const ValueProposition: React.FC = () => (
  <section className="py-20 md:py-[120px] bg-black px-4 md:px-6">
    <div className="max-w-[1200px] mx-auto text-center">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white"
        >
          Skip the expensive photoshoots.
        </motion.h2>
        <motion.p
          variants={fadeUpVariants}
          className="text-lg md:text-xl text-gray-400 font-light max-w-[720px] mx-auto mb-10 md:mb-16"
        >
          Stop struggling with backdrops, cameras, and lighting setups. Create
          perfect content right from your laptop.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left"
      >
        <ValueCard
          icon={Camera}
          title="Reference Images"
          desc="Upload a picture you like, and your product photo will perfectly match its style and lighting."
        />
        <ValueCard
          icon={Wand2}
          title="Perfect Lighting"
          desc="No more struggling with shadows. Nexiro automatically lights your product beautifully."
        />
        <ValueCard
          icon={Sparkles}
          title="Realistic Materials"
          desc="Leather looks like leather, glass looks like glass. The results are completely realistic."
        />
      </motion.div>
    </div>
  </section>
);

export default ValueProposition;
