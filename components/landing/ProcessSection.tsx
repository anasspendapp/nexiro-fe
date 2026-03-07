import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  fadeUpVariants,
  staggerContainer,
  scaleInVariants,
} from "./animationVariants";
import generatedImg from "@/images/generated.jpg";

interface ProcessStepProps {
  num: string;
  title: string;
  desc: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ num, title, desc }) => (
  <motion.div
    variants={fadeUpVariants}
    className="pl-8 py-6 border-l-2 border-white/10 relative group"
  >
    <div className="absolute top-6 -left-[5px] w-2 h-2 rounded-full bg-gray-600 group-hover:bg-white group-hover:shadow-[0_0_10px_white] group-hover:scale-150 transition-all duration-300" />
    <div className="text-sm font-bold text-gray-500 mb-2">STEP {num}</div>
    <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 font-light leading-relaxed">{desc}</p>
  </motion.div>
);

const ProcessSection: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section
      className="py-20 md:py-[120px] px-4 md:px-6 bg-black"
      id="how-it-works"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 md:mb-16"
        >
          <motion.h2
            variants={fadeUpVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            How it works
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            className="text-lg md:text-xl text-gray-400 max-w-[720px] font-light"
          >
            Generate professional photos in three simple steps.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            variants={scaleInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] aspect-square shadow-[0_20px_50px_rgba(255,255,255,0.02)] border border-white/10 h-[350px] md:h-[500px] w-full"
          >
            <motion.div
              style={{
                y: yImage,
                backgroundImage: `url('${generatedImg}')`,
              }}
              className="absolute inset-[-15%] bg-cover bg-center opacity-80 mix-blend-screen"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            <ProcessStep
              num="01"
              title="Upload Source Image"
              desc="Start by uploading a basic, actual photo of the product you want to feature."
            />
            <ProcessStep
              num="02"
              title="Upload Reference Style"
              desc="Find a photo that has the lighting, mood, or background you want, and upload it as your style guide."
            />
            <ProcessStep
              num="03"
              title="Configure & Generate"
              desc="Select your aspect ratio, choose your use-case (Social Media, Menu, Banner), pick a background, select export quality, and hit generate."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
