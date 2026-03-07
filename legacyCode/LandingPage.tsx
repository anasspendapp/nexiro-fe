import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { ChevronRight, Camera, Wand2, Sparkles } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

// ==========================================
// Animation Variants
// ==========================================
const smoothEase = [0.16, 1, 0.3, 1] as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: smoothEase }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: smoothEase }
  }
};

// ==========================================
// 1. HERO SECTION
// ==========================================
const HeroSection = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 800], [0, 200]);

  const [currentStep, setCurrentStep] = useState(0);
  const sequence = [
    { label: "RAW UPLOAD", img: "/source.jpg", duration: 3000 },
    { label: "PROCESSING", img: "/reference.jpg", duration: 2500 },
    { label: "PRODUCTION READY", img: "/generated.jpg", duration: 4000 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % sequence.length);
    }, sequence[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <section className="relative min-h-[90vh] md:min-h-[95vh] flex items-center pt-[100px] pb-[80px] md:pt-[120px] md:pb-[120px] overflow-hidden">
      {/* Dark mode glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-white/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 md:gap-16 items-center z-10">

        {/* Left Aligned Content */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-[720px] text-center lg:text-left mt-10 lg:mt-0">
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
            Take a simple picture of your product. Tell Nexiro how you want it to look. Get professional photos instantly.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-white text-center hover:bg-gray-200 text-black px-6 md:px-8 py-3.5 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:-translate-y-0.5 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Start Creating
            </button>
            <button className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center gap-2 transition-colors">
              Try Nexiro Free <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side Visual */}
        <motion.div
          style={{ y: yImage }} variants={scaleInVariants} initial="hidden" animate="visible"
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0A0A0A]"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.8 } }}
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
              <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${currentStep === 2 ? 'bg-green-400' : 'bg-blue-400 animate-pulse'}`} />
              {sequence[currentStep].label}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 2. TRUST / SOCIAL PROOF (MARQUEE)
// ==========================================
const BRANDS = [
  "Kurtos Bistro", "Subdeli", "RedApple", "Pure Desi", "Usta Kebabs", "Scents & Secrets", "Iron Plate"
];

const TrustSection = () => (
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
            <div key={i} className="text-xl md:text-3xl font-bold text-white/50 hover:text-white transition-colors px-8 md:px-12 flex items-center shrink-0 tracking-wide pointer-events-auto cursor-default">
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

// ==========================================
// 3. VALUE PROPOSITION SECTION
// ==========================================
const ValueCard = ({ icon: Icon, title, desc }: any) => (
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

const ValueProposition = () => (
  <section className="py-20 md:py-[120px] bg-black px-4 md:px-6">
    <div className="max-w-[1200px] mx-auto text-center">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Skip the expensive photoshoots.
        </motion.h2>
        <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-gray-400 font-light max-w-[720px] mx-auto mb-10 md:mb-16">
          Stop struggling with backdrops, cameras, and lighting setups. Create perfect content right from your laptop.
        </motion.p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
        <ValueCard icon={Camera} title="Reference Images" desc="Upload a picture you like, and your product photo will perfectly match its style and lighting." />
        <ValueCard icon={Wand2} title="Perfect Lighting" desc="No more struggling with shadows. Nexiro automatically lights your product beautifully." />
        <ValueCard icon={Sparkles} title="Realistic Materials" desc="Leather looks like leather, glass looks like glass. The results are completely realistic." />
      </motion.div>
    </div>
  </section>
);

// ==========================================
// 4. PROCESS / HOW IT WORKS
// ==========================================
const ProcessStep = ({ num, title, desc }: any) => (
  <motion.div variants={fadeUpVariants} className="pl-8 py-6 border-l-2 border-white/10 relative group">
    <div className="absolute top-6 -left-[5px] w-2 h-2 rounded-full bg-gray-600 group-hover:bg-white group-hover:shadow-[0_0_10px_white] group-hover:scale-150 transition-all duration-300" />
    <div className="text-sm font-bold text-gray-500 mb-2">STEP {num}</div>
    <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 font-light leading-relaxed">{desc}</p>
  </motion.div>
);

const ProcessSection = () => {
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section className="py-20 md:py-[120px] px-4 md:px-6 bg-black" id="how-it-works">
      <div className="max-w-[1200px] mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-10 md:mb-16">
          <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">How it works</motion.h2>
          <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-gray-400 max-w-[720px] font-light">Generate professional photos in three simple steps.</motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            variants={scaleInVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] aspect-square shadow-[0_20px_50px_rgba(255,255,255,0.02)] border border-white/10 h-[350px] md:h-[500px] w-full"
          >
            <motion.div style={{ y: yImage, backgroundImage: `url('/sequence.gif'), url('/generated.jpg')` }} className="absolute inset-[-15%] bg-cover bg-center opacity-80 mix-blend-screen" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="flex flex-col">
            <ProcessStep num="01" title="Upload Source Image" desc="Start by uploading a basic, actual photo of the product you want to feature." />
            <ProcessStep num="02" title="Upload Reference Style" desc="Find a photo that has the lighting, mood, or background you want, and upload it as your style guide." />
            <ProcessStep num="03" title="Configure & Generate" desc="Select your aspect ratio, choose your use-case (Social Media, Menu, Banner), pick a background, select export quality, and hit generate." />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. FEATURE GRID
// ==========================================
const FeatureGridCard = ({ title, desc, alt = false }: any) => (
  <motion.div
    variants={fadeUpVariants}
    whileHover={{ scale: 1.03, y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`p-10 rounded-2xl border border-white/10 flex flex-col justify-end min-h-[300px] ${alt ? "bg-[#0A0A0A] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] border-white/20" : "bg-[#111]"} relative overflow-hidden group`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <h3 className="text-2xl font-bold mb-3 text-white relative z-10">{title}</h3>
    <p className="text-gray-400 font-light relative z-10 max-w-[80%]">{desc}</p>
  </motion.div>
);

const FeatureGrid = () => (
  <section className="py-20 md:py-[120px] bg-black px-4 md:px-6">
    <div className="max-w-[1200px] mx-auto">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-5xl font-bold tracking-tight mb-10 md:mb-16 text-white text-center md:text-left">
          AI Creative Engine
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureGridCard title="Change Backgrounds" desc="Easily erase messy areas and place your product in modern, clean settings." alt={true} />
          <FeatureGridCard title="Make Images Clearer" desc="Take a blurry phone picture and instantly turn it into a high-quality photo." />
          <FeatureGridCard title="High Quality Export" desc="Download sharp, large images you can use anywhere, from Instagram to printed posters." />
          <FeatureGridCard title="Multiple Sizes" desc="Create one picture and automatically get the right sizes for stories, posts, and banners." alt={true} />
        </div>
      </motion.div>
    </div>
  </section>
);

// ==========================================
// 6. SCROLL INTERACTIVE SHOWCASE
// ==========================================
const SHOWCASE_DATA = [
  {
    label: "Skin Care Example",
    title: "Pure Desi cosmetics campaign",
    desc: "A female entrepreneur in Pakistan used Nexiro to generate stunning, lifestyle-oriented campaign visuals for her organic skincare brand.",
    img: "/pure_desi.jpg",
    caption: "Product photo → Natural skincare campaign",
    creator: "Pure Desi"
  },
  {
    label: "Restaurant Example",
    title: "Kurtos Bistro menu upgrade",
    desc: "Enhanced basic food photography into high-end, mouth-watering marketing visuals using reference style images.",
    img: "/kurtos.jpg",
    caption: "Basic food shot → Billboard-ready visual",
    creator: "Kurtos Bistro"
  },
  {
    label: "Restaurant Example",
    title: "Usta Kebabs social campaign",
    desc: "A Levant cuisine restaurant transformed everyday kitchen photos into deeply lit, appetizing social media visuals.",
    img: "/usta.jpg",
    caption: "Kitchen photo → Premium social visual",
    creator: "Usta Kebabs"
  }
];

const MobileImageCard = ({ item }: any) => (
  <div className="md:hidden mt-8 w-full rounded-[20px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden bg-white/5 p-2 aspect-[4/5] sm:aspect-square">
    <div className="w-full h-full relative rounded-[14px] overflow-hidden">
      <div style={{ backgroundImage: `url(${item.img})` }} className="absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-white/60 text-sm font-medium mb-1 drop-shadow-md">{item.creator}</div>
        <div className="text-white font-bold text-lg leading-tight drop-shadow-md">{item.caption}</div>
      </div>
    </div>
  </div>
);

const CaseStudyBlock = ({ item, index, setActiveIndex }: any) => {
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
      <div className="text-xs font-bold tracking-widest text-[#4A4A4A] bg-white/5 w-max px-3 py-1 rounded-full mb-6 border border-white/5 uppercase">{item.label}</div>
      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{item.title}</h3>
      <p className="text-lg text-gray-400 font-light leading-relaxed max-w-[90%] md:max-w-[400px]">{item.desc}</p>

      <MobileImageCard item={item} />
    </motion.div>
  );
};

const CaseStudySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section className="py-20 md:py-[120px] bg-black border-y border-white/10 relative">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Created with Nexiro
          </motion.h2>
          <motion.p variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-lg md:text-xl text-gray-400 max-w-[700px] mx-auto font-light leading-relaxed">
            Thousands of creators and brands are already turning everyday photos into campaign-ready visuals.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-20 relative">
          <div className="w-full md:w-[45%]">
            {SHOWCASE_DATA.map((item, i) => (
              <CaseStudyBlock key={i} item={item} index={i} setActiveIndex={setActiveIndex} />
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
                    style={{ y: yImage, backgroundImage: `url(${SHOWCASE_DATA[activeIndex].img})` }}
                    className="absolute inset-[-15%] bg-cover bg-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="text-white/80 text-sm font-medium tracking-wider mb-2 drop-shadow-md uppercase">{SHOWCASE_DATA[activeIndex].creator}</div>
                    <div className="text-white font-bold text-2xl leading-tight drop-shadow-md max-w-[80%]">{SHOWCASE_DATA[activeIndex].caption}</div>
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

// ==========================================
// 8. PRICING SECTION (API DRIVEN)
// ==========================================
const CreditCalculator = ({ plans }: any) => {
  const [type, setType] = useState<"prompt" | "reference">("prompt");
  const [quality, setQuality] = useState<"standard" | "high">("standard");
  const [quantity, setQuantity] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    if (plans && plans.length > 0 && selectedPlanId === null) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  let costPerImage = type === "reference" ? 4 : 2;
  if (quality === "high") {
    costPerImage = type === "reference" ? 10 : 8;
  }

  const totalCredits = costPerImage * quantity;

  const selectedPlan = plans?.find((p: any) => p.id === selectedPlanId) || plans?.[0];
  const costPerCredit = selectedPlan ? parseFloat(selectedPlan.price) / selectedPlan.credits : 0;

  const dollarTotalCost = (totalCredits * costPerCredit).toFixed(2);
  const dollarCostPerImage = (costPerImage * costPerCredit).toFixed(2);

  const studioCost = quantity * 20;
  const savings = (studioCost - parseFloat(dollarTotalCost)).toFixed(2);

  return (
    <motion.div variants={fadeUpVariants} className="mt-16 md:mt-24 max-w-[800px] mx-auto p-6 md:p-10 rounded-2xl border border-white/10 bg-[#0A0A0A] relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[100%] pointer-events-none" />
      <h3 className="text-2xl font-bold text-white mb-8 text-center md:text-left">Calculate Your Savings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
          {plans && plans.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Plan to Compare</label>
              <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
                {plans.map((plan: any) => (
                  <button key={plan.id} onClick={() => setSelectedPlanId(plan.id)} className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${selectedPlanId === plan.id ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>{plan.name}</button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Generation Type</label>
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
              <button onClick={() => setType("prompt")} className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${type === "prompt" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>Prompt Based</button>
              <button onClick={() => setType("reference")} className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${type === "reference" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>Reference Based</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Quality</label>
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
              <button onClick={() => setQuality("standard")} className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${quality === "standard" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>1K / 2K</button>
              <button onClick={() => setQuality("high")} className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all ${quality === "high" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}>4K Ultra</button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">Number of Images</label>
              <span className="text-white font-bold">{quantity}</span>
            </div>
            <input
              type="range"
              min="1" max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8 bg-[#111] rounded-xl border border-white/5 mt-4 md:mt-0">
          <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
            <div>
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Credits</div>
              <div className="text-3xl font-bold text-white">{totalCredits}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Est. Cost</div>
              <div className="text-3xl font-bold text-white">${dollarTotalCost}</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-sm">Cost per image</span>
            <span className="text-white font-medium">${dollarCostPerImage}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">Approx Studio Cost</span>
            <span className="text-gray-500 line-through font-medium">${studioCost.toFixed(2)}</span>
          </div>

          <div className="mt-auto bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">You Save</div>
            <div className="text-4xl font-bold text-emerald-400">${savings}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FreeCreditsBanner = () => (
  <motion.div variants={fadeUpVariants} className="mt-16 max-w-[600px] mx-auto text-center px-4">
    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Free Credits to Get Started</h3>
    <p className="text-gray-400 font-light leading-relaxed mb-6 text-sm md:text-base">
      Start learning and exploring Nexiro's powerful AI photography features without any payment. Sign up to receive free credits and experiment with our advanced tools to discover what's possible with your images.
    </p>
    <p className="text-xs md:text-sm text-gray-500 italic">
      No credit card required to get started. Upgrade anytime as you create more stunning visuals.
    </p>
  </motion.div>
);

const PricingCard = ({ plan, isLoading }: any) => {
  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl border border-white/5 bg-[#0A0A0A] flex flex-col min-h-[400px] animate-pulse">
        <div className="w-32 h-6 bg-white/10 rounded mb-8" />
        <div className="w-24 h-12 bg-white/10 rounded mb-4" />
        <div className="w-16 h-6 bg-white/10 rounded-full mb-8" />
        <div className="space-y-3 mb-8">
          <div className="w-full h-4 bg-white/10 rounded" />
          <div className="w-[90%] h-4 bg-white/10 rounded" />
          <div className="w-[80%] h-4 bg-white/10 rounded" />
        </div>
        <div className="w-full h-12 bg-white/10 rounded-lg mt-auto" />
      </div>
    );
  }

  const isLuxe = plan.name === "LUXE";

  return (
    <motion.div
      variants={fadeUpVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`p-8 rounded-2xl border ${isLuxe ? "border-white/30 bg-[#111]" : "border-white/10 bg-[#0A0A0A]"} relative flex flex-col min-h-[400px] overflow-hidden group transition-colors`}
    >
      {isLuxe && <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[100%] pointer-events-none" />}

      <div className="text-sm font-bold tracking-widest text-gray-400 mb-8">{plan.name}</div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl md:text-5xl font-bold text-white">${plan.price}</span>
        <span className="text-gray-500 font-light">/mo</span>
      </div>

      <div className="inline-flex mb-8">
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest ${isLuxe ? "bg-white text-black" : "bg-white/10 text-white"}`}>
          {plan.credits} CREDITS
        </span>
      </div>

      <p className="text-gray-400 font-light text-sm leading-relaxed mb-10">{plan.description}</p>

      <button className={`mt-auto w-full py-4 rounded-lg font-semibold transition-all ${isLuxe ? "bg-white text-black hover:bg-gray-200" : "bg-transparent border border-white/20 text-white hover:bg-white/5"} flex justify-center items-center`}>
        Select {plan.name}
      </button>
    </motion.div>
  );
};

const PricingSection = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/price-books/current/plans');
        const data = await response.json();
        // Sort by price ascending
        const sortedPlans = (data.plans || []).sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
        setPlans(sortedPlans);
      } catch (error) {
        console.error("Failed to fetch pricing plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <section className="py-20 md:py-[120px] px-4 md:px-6 bg-black border-t border-white/10" id="pricing">
      <div className="max-w-[1000px] mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <div className="mb-10 md:mb-16 text-center">
            <motion.h2 variants={fadeUpVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Simple, Transparent Pricing</motion.h2>
            <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-gray-400 max-w-[720px] mx-auto font-light">Credits never expire. Generate campaign assets only when you need them.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[800px] mx-auto">
            {loading ? (
              <>
                <PricingCard isLoading={true} />
                <PricingCard isLoading={true} />
              </>
            ) : (
              plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} isLoading={false} />
              ))
            )}
          </div>

          <CreditCalculator plans={plans} />
          <FreeCreditsBanner />

        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 9. CALL TO ACTION
// ==========================================
const CallToAction = () => (
  <section className="relative py-20 md:py-[120px] px-4 md:px-6 border-t border-white/10 overflow-hidden bg-black">
    {/* Radial glow background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] md:w-[1000px] md:h-[500px] bg-white/5 rounded-[100%] blur-[80px] md:blur-[100px] pointer-events-none" />

    <div className="relative max-w-[720px] mx-auto text-center z-10">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <motion.h2 variants={fadeUpVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">Create Professional<br />Photos Today.</motion.h2>
        <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 font-light">Get started right from your phone. No equipment required.</motion.p>

        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
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

// ==========================================
// Main Landing Page Assembly
// ==========================================
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <ValueProposition />
        <ProcessSection />
        <FeatureGrid />
        <CaseStudySection />
        <PricingSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
