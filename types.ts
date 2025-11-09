
export enum Tone {
  FRIENDLY = 'Friendly',
  PROFESSIONAL = 'Professional',
  WITTY = 'Witty',
  CARING = 'Caring',
  FORMAL = 'Formal',
}

export enum AnimationStyle {
  FADE_IN_UP = 'Fade In Up',
  SLIDE_IN_LEFT = 'Slide In Left',
  ZOOM_IN = 'Zoom In',
  NONE = 'None',
}

export interface ChatbotConfig {
  websiteInfo: string;
  systemPrompt: string;
  tone: Tone;
  primaryColor: string;
  logoUrl: string | null;
  animationStyle: AnimationStyle;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}
