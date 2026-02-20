import {
  AspectRatio,
  ImageQuality,
  BackgroundMode,
  CameraAngle,
  UsageScenario,
  ToolType,
} from "../types";
import { apiClient } from "./api";

// --- Types ---

export type StyleInput =
  | { type: "IMAGE"; data: string }
  | { type: "TEXT"; description: string };

export interface EnhancementOptions {
  toolType: ToolType;
  aspectRatio: AspectRatio;
  quality: ImageQuality;
  backgroundMode?: BackgroundMode;
  customBackground?: string | null;
  backgroundColor?: string;
  excludedProps?: string[];
  detectedSubjectDetails?: string;
  useHighFidelity?: boolean;
  cameraAngle?: CameraAngle;
  usageScenario?: UsageScenario;
  customInstructions?: string;
  productDescription?: string;
}

/**
 * 1. Analyze Image
 * Analyzes source image to identify ingredients (food) or text/materials (product)
 * Endpoint: POST /api/analyze-image
 */
export const analyzeImage = async (
  base64: string,
  toolType: ToolType = "FOOD",
): Promise<{ details: string; props: string[] }> => {
  try {
    const response = await apiClient.post("/analyze-image", {
      base64,
      toolType,
    });
    return response.data;
  } catch (error) {
    console.error("Analysis failed:", error);
    return { details: "", props: [] };
  }
};

/**
 * 2. Analyze Reference Props
 * Identifies props in a reference/style image
 * Endpoint: POST /api/analyze-reference
 */
export const analyzeReferenceProps = async (
  referenceBase64: string,
): Promise<string[]> => {
  try {
    const response = await apiClient.post("/analyze-reference", {
      referenceBase64,
    });
    return response.data.props || [];
  } catch (error) {
    console.warn("Reference analysis failed:", error);
    return [];
  }
};

/**
 * 3. Enhance Image - Main Generation Pipeline
 * Generates enhanced/styled image using AI
 * Endpoint: POST /api/enhance-image
 */
export const enhanceImage = async (
  sourceBase64: string,
  styleInput: StyleInput,
  options: EnhancementOptions,
): Promise<string> => {
  try {
    const response = await apiClient.post("/enhance-image", {
      sourceBase64,
      styleInput,
      options,
    });

    // Backend returns { imageBase64: "..." }
    return response.data.imageBase64;
  } catch (error) {
    console.error("Enhancement failed:", error);
    throw error;
  }
};
