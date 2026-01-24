import React, { useState, useEffect } from "react";
import {
  User,
  ToolType,
  ImageAsset,
  AspectRatio,
  ImageQuality,
  BackgroundMode,
  CameraAngle,
  UsageScenario,
} from "../types";
import { authService } from "../services/authService";
import {
  enhanceImage,
  analyzeImage,
  StyleInput,
  EnhancementOptions,
} from "../services/geminiService";
import ImageUploader from "../components/ImageUploader";

interface EnhanceToolProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onError: (msg: string) => void;
  errorMsg: string;
  onUpgradeRequired: () => void;
  toolType: ToolType;
}

const EnhanceTool: React.FC<EnhanceToolProps> = ({
  user,
  onUpdateUser,
  onError,
  errorMsg,
  onUpgradeRequired,
  toolType,
}) => {
  // Assets
  const [sourceImage, setSourceImage] = useState<ImageAsset | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageAsset | null>(null);
  const [stylePrompt, setStylePrompt] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [customBgImage, setCustomBgImage] = useState<ImageAsset | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [subjectDetails, setSubjectDetails] = useState("");

  // Generation State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Settings State
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [quality, setQuality] = useState<ImageQuality>("1K");
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(
    BackgroundMode.REFERENCE_STYLE,
  );
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>(
    CameraAngle.EYE_LEVEL,
  );
  const [usageScenario, setUsageScenario] = useState<UsageScenario>(
    UsageScenario.SOCIAL_LIFESTYLE,
  );
  const [customInstructions, setCustomInstructions] = useState("");

  // Reset when tool type changes
  useEffect(() => {
    setSourceImage(null);
    setReferenceImage(null);
    setGeneratedImage(null);
    setStylePrompt("");
    setProductDescription("");
    setSubjectDetails("");
    onError("");
  }, [toolType, onError]);

  const handleSourceImageChange = async (img: ImageAsset | null) => {
    setSourceImage(img);
    if (img) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeImage(img.base64, toolType);
        setSubjectDetails(result.details);
      } catch (e) {
        console.error("Analysis failed", e);
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setSubjectDetails("");
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;

    // Check credits
    const cost = referenceImage ? 4 : 1;
    if (user.credits < cost) {
      onUpgradeRequired();
      return;
    }

    setIsProcessing(true);
    onError("");

    try {
      // 1. Deduct credits (optimistic or actual)
      const updatedUser = await authService.consumeCredits(user.email, cost);
      onUpdateUser(updatedUser);

      // 2. Prepare options
      const styleInput: StyleInput = referenceImage
        ? { type: "IMAGE", data: referenceImage.base64 }
        : {
            type: "TEXT",
            description:
              stylePrompt ||
              "Professional studio lighting, high end commercial photography",
          };

      const options: EnhancementOptions = {
        toolType,
        aspectRatio,
        quality,
        backgroundMode,
        customBackground: customBgImage?.base64,
        backgroundColor,
        cameraAngle,
        usageScenario,
        customInstructions: customInstructions,
        productDescription: productDescription || undefined,
        detectedSubjectDetails: subjectDetails || undefined,
      };

      // 3. Call API
      const resultBase64 = await enhanceImage(
        sourceImage.base64,
        styleInput,
        options,
      );
      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
    } catch (err: any) {
      console.error(err);
      onError(err.message || "Generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Column: Controls */}
      <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* 1. ASSETS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">
              1
            </span>
            Upload Source
          </h3>
          <ImageUploader
            label="Source Image"
            subLabel={toolType === "FOOD" ? "Plate of food" : "Product item"}
            image={sourceImage}
            onImageChange={handleSourceImageChange}
            disabled={isProcessing}
          />

          <div className="grid gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                Subject Name
              </label>
              <input
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder={
                  toolType === "FOOD"
                    ? "e.g. Double Cheeseburger"
                    : "e.g. Chanel No.5 Perfume"
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
                disabled={isProcessing}
              />
            </div>

            {(isAnalyzing || subjectDetails) && (
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  {isAnalyzing
                    ? "Analyzing Details..."
                    : "Locked Details (AI Detected)"}
                </label>
                <textarea
                  value={subjectDetails}
                  onChange={(e) => setSubjectDetails(e.target.value)}
                  className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2 text-xs text-gray-300 outline-none h-16 resize-none"
                  disabled={isAnalyzing || isProcessing}
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. STYLE */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">
              2
            </span>
            Define Style
          </h3>

          <div className="p-1 bg-white/5 rounded-xl flex">
            <button
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                !referenceImage
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => {
                setReferenceImage(null);
              }}
            >
              Text Prompt
            </button>
            <button
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                referenceImage
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => {
                /* Switch logic implicit */
              }}
            >
              Image Reference
            </button>
          </div>

          <ImageUploader
            label="Style Reference (Optional)"
            subLabel="Match this look"
            image={referenceImage}
            onImageChange={setReferenceImage}
            disabled={isProcessing}
          />

          <textarea
            value={stylePrompt}
            onChange={(e) => setStylePrompt(e.target.value)}
            disabled={isProcessing || !!referenceImage}
            placeholder={
              referenceImage
                ? "Using reference image..."
                : "Describe the lighting, mood, and environment..."
            }
            className={`w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all ${
              referenceImage ? "opacity-50" : ""
            }`}
          />
        </div>

        {/* 3. SETTINGS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">
              3
            </span>
            Settings
          </h3>

          {/* Composition Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="9:16">9:16 (Story)</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="4:5">4:5 (Portrait)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as ImageQuality)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="1K">1K (Fast)</option>
                <option value="2K">2K (Balanced)</option>
                <option value="4K">4K (High Res)</option>
              </select>
            </div>
          </div>

          {/* Angle & Scenario Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                Camera Angle
              </label>
              <select
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value as CameraAngle)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value={CameraAngle.EYE_LEVEL}>Eye Level (0°)</option>
                <option value={CameraAngle.FORTY_FIVE}>Standard (45°)</option>
                <option value={CameraAngle.TOP_DOWN}>Flat Lay (90°)</option>
                <option value={CameraAngle.MACRO}>Macro</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                Usage Scenario
              </label>
              <select
                value={usageScenario}
                onChange={(e) =>
                  setUsageScenario(e.target.value as UsageScenario)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value={UsageScenario.SOCIAL_LIFESTYLE}>
                  Social Media
                </option>
                <option value={UsageScenario.ECOMMERCE_MENU}>
                  {toolType === "FOOD" ? "Menu" : "E-Commerce"}
                </option>
                <option value={UsageScenario.WEBSITE_HERO}>Website Hero</option>
              </select>
            </div>
          </div>

          {/* Background Row */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              Background
            </label>
            <select
              value={backgroundMode}
              onChange={(e) =>
                setBackgroundMode(e.target.value as BackgroundMode)
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value={BackgroundMode.REFERENCE_STYLE}>
                Match Style Reference
              </option>
              <option value={BackgroundMode.TRANSPARENT}>Transparent</option>
              <option value={BackgroundMode.COLOR}>Solid Color</option>
              <option value={BackgroundMode.KEEP_ORIGINAL}>
                Keep Original
              </option>
              <option value={BackgroundMode.CUSTOM}>Custom Image</option>
            </select>
          </div>

          {backgroundMode === BackgroundMode.COLOR && (
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
              />
              <span className="text-sm text-gray-300 font-mono">
                {backgroundColor}
              </span>
            </div>
          )}

          {backgroundMode === BackgroundMode.CUSTOM && (
            <ImageUploader
              label="Custom Background"
              subLabel="Upload environment"
              image={customBgImage}
              onImageChange={setCustomBgImage}
              disabled={isProcessing}
            />
          )}

          {/* Custom Instructions */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
              Custom Instructions
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              disabled={isProcessing}
              placeholder="Specific constraints (e.g., 'no green leaves', 'make lighting warmer')..."
              className="w-full h-16 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={
            isProcessing ||
            !sourceImage ||
            (backgroundMode === BackgroundMode.CUSTOM && !customBgImage)
          }
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enhancing...
            </>
          ) : (
            <>
              Generate{" "}
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
                {referenceImage ? "4 Credits" : "1 Credit"}
              </span>
            </>
          )}
        </button>

        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}
      </div>

      {/* Right Column: Preview */}
      <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-300">Preview</h3>
          {generatedImage && (
            <div className="flex gap-2">
              <a
                href={generatedImage}
                download={`nexiro-${toolType.toLowerCase()}-${Date.now()}.jpg`}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
            </div>
          )}
        </div>

        <div className="flex-grow bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden relative group">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Result"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p>Generated image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhanceTool;
