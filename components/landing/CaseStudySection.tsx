import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { fadeUpVariants } from "./animationVariants";
import pureDesiImg from "@/images/pure_desi.jpg";
import kurtosImg from "@/images/kurtos.jpg";
import ustaImg from "@/images/usta.jpg";

interface ShowcaseItem {
  label: string;
  title: string;
  desc: string;
  img: string;
  caption: string;
  creator: string;
}

const SHOWCASE_DATA: ShowcaseItem[] = [
  {
    label: "Skin Care Example",
    title: "Pure Desi cosmetics campaign",
    desc: "A female entrepreneur in Pakistan used Nexiro to generate stunning, lifestyle-oriented campaign visuals for her organic skincare brand.",
    img: pureDesiImg,
    caption: "Product photo → Natural skincare campaign",
    creator: "Pure Desi",
  },
  {
    label: "Restaurant Example",
    title: "Kurtos Bistro menu upgrade",
    desc: "Enhanced basic food photography into high-end, mouth-watering marketing visuals using reference style images.",
    img: kurtosImg,
    caption: "Basic food shot → Billboard-ready visual",
    creator: "Kurtos Bistro",
  },
  {
    label: "Restaurant Example",
    title: "Usta Kebabs social campaign",
    desc: "A Levant cuisine restaurant transformed everyday kitchen photos into deeply lit, appetizing social media visuals.",
    img: ustaImg,
    caption: "Kitchen photo → Premium social visual",
    creator: "Usta Kebabs",
  },
];

interface MobileImageCardProps {
  item: ShowcaseItem;
}

const MobileImageCard: React.FC<MobileImageCardProps> = ({ item }) => (
  <div className="md:hidden mt-8 w-full rounded-[20px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden bg-white/5 p-2 aspect-[4/5] sm:aspect-square">
    <div className="w-full h-full relative rounded-[14px] overflow-hidden">
      <div
        style={{ backgroundImage: `url(${item.img})` }}
        className="absolute inset-0 bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-white/60 text-sm font-medium mb-1 drop-shadow-md">
          {item.creator}
        </div>
        <div className="text-white font-bold text-lg leading-tight drop-shadow-md">
          {item.caption}
        </div>
      </div>
    </div>
  </div>
);

interface CaseStudyBlockProps {
  item: ShowcaseItem;
  index: number;
  setActiveIndex: (index: number) => void;
}

const CaseStudyBlock: React.FC<CaseStudyBlockProps> = ({
  item,
  index,
  setActiveIndex,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.6 }}
      className="min-h-auto md:min-h-[450px] flex flex-col justify-center py-12 md:py-0"
    >
      <div className="text-xs font-bold tracking-widest text-[#4A4A4A] bg-white/5 w-max px-3 py-1 rounded-full mb-6 border border-white/5 uppercase">
        {item.label}
      </div>
      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {item.title}
      </h3>
      <p className="text-lg text-gray-400 font-light leading-relaxed max-w-[90%] md:max-w-[400px]">
        {item.desc}
      </p>

      <MobileImageCard item={item} />
    </motion.div>
  );
};

const CaseStudySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      id="showcase"
      className="py-20 md:py-[120px] bg-black border-y border-white/10 relative"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Created with Nexiro
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-400 max-w-[700px] mx-auto font-light leading-relaxed"
          >
            Thousands of creators and brands are already turning everyday photos
            into campaign-ready visuals.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-20 relative">
          <div className="w-full md:w-[45%]">
            {SHOWCASE_DATA.map((item, i) => (
              <CaseStudyBlock
                key={i}
                item={item}
                index={i}
                setActiveIndex={setActiveIndex}
              />
            ))}
            <div className="hidden md:block h-[30vh]"></div>
          </div>

          <div className="hidden md:block w-full md:w-[55%] relative">
            <div className="sticky top-[120px] h-[520px] lg:h-[600px] w-full max-w-[600px] ml-auto rounded-[24px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-xl border border-white/10 p-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none rounded-[24px]" />
              <AnimatePresence>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-2 rounded-[14px] overflow-hidden bg-[#0A0A0A]"
                >
                  <motion.div
                    style={{
                      y: yImage,
                      backgroundImage: `url(${SHOWCASE_DATA[activeIndex].img})`,
                    }}
                    className="absolute inset-[-15%] bg-cover bg-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="text-white/80 text-sm font-medium tracking-wider mb-2 drop-shadow-md uppercase">
                      {SHOWCASE_DATA[activeIndex].creator}
                    </div>
                    <div className="text-white font-bold text-2xl leading-tight drop-shadow-md max-w-[80%]">
                      {SHOWCASE_DATA[activeIndex].caption}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
