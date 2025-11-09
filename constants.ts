
import { ChatbotConfig, Tone, AnimationStyle } from './types';

export const DEFAULT_CONFIG: ChatbotConfig = {
  websiteInfo: 'Our company, "Innovate Inc.", specializes in cutting-edge software solutions for businesses. We offer products for project management, customer relationship management (CRM), and data analytics. Our mission is to empower teams to achieve more with intuitive and powerful tools.',
  systemPrompt: 'You are a friendly and helpful sales and support assistant for Innovate Inc. Your goal is to answer user questions about our products and services, and guide them to the right solution for their needs. Be concise and clear in your answers.',
  tone: Tone.FRIENDLY,
  primaryColor: '#3b82f6',
  logoUrl: null,
  animationStyle: AnimationStyle.FADE_IN_UP,
};
