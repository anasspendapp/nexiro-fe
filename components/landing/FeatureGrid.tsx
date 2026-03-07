import React from "react";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "./animationVariants";
import { Replace, Sparkles, Download, Grid, LucideIcon } from "lucide-react";

interface FeatureGridCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  alt?: boolean;
}

const FeatureGridCard: React.FC<FeatureGridCardProps> = ({
  title,
  desc,
  icon: Icon,
  alt = false,
}) => (
  <motion.div
    variants={fadeUpVariants}
    whileHover={{
      scale: 1.03,
      y: -5,
      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
    }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`p-10 rounded-2xl border border-white/10 flex flex-col justify-end min-h-[180px] ${alt ? "bg-[#0A0A0A] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] border-white/20" : "bg-[#111]"} relative overflow-hidden group`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <Icon className="w-12 h-12 mb-4 text-indigo-500 relative z-10" />
    <h3 className="text-2xl font-bold mb-3 text-white relative z-10">
      {title}
    </h3>
    <p className="text-gray-400 font-light relative z-10 max-w-[80%]">{desc}</p>
  </motion.div>
);

const FeatureGrid: React.FC = () => (
  <section id="features" className="py-20 md:py-[120px] bg-black px-4 md:px-6">
    <div className="max-w-[1200px] mx-auto">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.h2
          variants={fadeUpVariants}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-10 md:mb-16 text-white text-center md:text-left"
        >
          AI Creative Engine
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureGridCard
            title="Change Backgrounds"
            desc="Easily erase messy areas and place your product in modern, clean settings."
            icon={Replace}
            alt={true}
          />
          <FeatureGridCard
            title="Make Images Clearer"
            desc="Take a blurry phone picture and instantly turn it into a high-quality photo."
            icon={Sparkles}
          />
          <FeatureGridCard
            title="High Quality Export"
            desc="Download sharp, large images you can use anywhere, from Instagram to printed posters."
            icon={Download}
          />
          <FeatureGridCard
            title="Multiple Sizes"
            desc="Create one picture and automatically get the right sizes for stories, posts, and banners."
            icon={Grid}
            alt={true}
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default FeatureGrid;
