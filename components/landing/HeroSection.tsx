import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  fadeUpVariants,
  staggerContainer,
  scaleInVariants,
  smoothEase,
} from "./animationVariants";
import sourceImg from "@/images/source.jpg";
import referenceImg from "@/images/reference.jpg";
import generatedImg from "@/images/generated.jpg";

const sequence = [
  { label: "RAW UPLOAD", img: sourceImg, duration: 3000 },
  { label: "PROCESSING", img: referenceImg, duration: 2500 },
  { label: "PRODUCTION READY", img: generatedImg, duration: 4000 },
];

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 800], [0, 200]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % sequence.length);
    }, sequence[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-[95vh] flex items-center pt-[100px] pb-[80px] md:pt-[120px] md:pb-[120px] overflow-hidden"
    >
      {/* Dark mode glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-white/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 md:gap-16 items-center z-10">
        {/* Left Aligned Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[720px] text-center lg:text-left mt-10 lg:mt-0"
        >
          <motion.h1
            variants={fadeUpVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-tight text-white"
          >
            Create beautiful product photos in seconds.
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 leading-relaxed font-light px-4 lg:px-0"
          >
            Take a simple picture of your product. Tell Nexiro how you want it
            to look. Get professional photos instantly.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-center hover:bg-gray-200 text-black px-6 md:px-8 py-3.5 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:-translate-y-0.5 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Start Creating
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center gap-2 transition-colors"
            >
              Try Nexiro Free <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side Visual */}
        <motion.div
          style={{ y: yImage }}
          variants={scaleInVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0A0A0A]"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                scale: 0.95,
                filter: "blur(10px)",
                transition: { duration: 0.8 },
              }}
              transition={{ duration: 1.2, ease: smoothEase }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${sequence[currentStep].img}')` }}
            />
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 flex justify-between items-end">
            <motion.div
              key={`badge-${currentStep}`}
              initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-semibold tracking-wider text-white border border-white/10 flex items-center gap-2"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${currentStep === 2 ? "bg-green-400" : "bg-blue-400 animate-pulse"}`}
              />
              {sequence[currentStep].label}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
