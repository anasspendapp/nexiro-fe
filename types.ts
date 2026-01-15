export interface ImageAsset {
  file: File;
  previewUrl: string;
  base64: string;
}

export enum PlanType {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO'
}

export interface User {
  email: string;
  credits: number;
  plan: PlanType;
  isPro?: boolean; // Added to match backend and frontend usage
  isDriveConnected?: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ToolType = 'FOOD' | 'PRODUCT';

export enum BackgroundMode {
  REFERENCE_STYLE = 'REFERENCE_STYLE',
  KEEP_ORIGINAL = 'KEEP_ORIGINAL',
  TRANSPARENT = 'TRANSPARENT',
  CUSTOM = 'CUSTOM',
  COLOR = 'COLOR'
}

export enum CameraAngle {
  TOP_DOWN = 'TOP_DOWN',
  FORTY_FIVE = 'FORTY_FIVE',
  EYE_LEVEL = 'EYE_LEVEL',
  MACRO = 'MACRO'
}

export enum UsageScenario {
  ECOMMERCE_MENU = 'ECOMMERCE_MENU', // Used for Catalog/Menu
  SOCIAL_LIFESTYLE = 'SOCIAL_LIFESTYLE',
  WEBSITE_HERO = 'WEBSITE_HERO'
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageQuality = '1K' | '2K' | '4K';

export interface GenerationSettings {
  aspectRatio: AspectRatio;
  quality: ImageQuality;
  backgroundMode: BackgroundMode;
  cameraAngle: CameraAngle;
  usageScenario: UsageScenario;
}