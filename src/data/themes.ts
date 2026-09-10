import { WebsiteTheme } from '../types';

export const THEME_PRESETS: WebsiteTheme[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark Tech',
    fontHeading: 'Outfit',
    fontBody: 'Inter',
    primaryColor: '#6366f1', // Indigo 500
    secondaryColor: '#ec4899', // Pink 500
    accentColor: '#06b6d4', // Cyan 500
    backgroundColor: '#0f172a', // Slate 900
    cardBackground: '#1e293b', // Slate 800
    textColor: '#f8fafc', // Slate 50
    textMuted: '#94a3b8', // Slate 400
    radius: '0.75rem',
  },
  {
    id: 'clean-saas',
    name: 'Clean SaaS Light',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    primaryColor: '#2563eb', // Blue 600
    secondaryColor: '#4f46e5', // Indigo 600
    accentColor: '#10b981', // Emerald 500
    backgroundColor: '#ffffff',
    cardBackground: '#f8fafc',
    textColor: '#0f172a',
    textMuted: '#64748b',
    radius: '0.5rem',
  },
  {
    id: 'luxury-gold',
    name: 'Luxury & Editorial',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    primaryColor: '#d97706', // Amber 600
    secondaryColor: '#b45309', // Amber 700
    accentColor: '#f59e0b', // Amber 500
    backgroundColor: '#0c0a09', // Stone 950
    cardBackground: '#1c1917', // Stone 900
    textColor: '#fafaf9', // Stone 50
    textMuted: '#a8a29e', // Stone 400
    radius: '0.25rem',
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Growth & Eco',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    primaryColor: '#059669', // Emerald 600
    secondaryColor: '#0d9488', // Teal 600
    accentColor: '#84cc16', // Lime 500
    backgroundColor: '#f0fdf4', // Green 50
    cardBackground: '#ffffff',
    textColor: '#064e3b', // Emerald 900
    textMuted: '#047857', // Emerald 700
    radius: '1rem',
  },
  {
    id: 'vibrant-purple',
    name: 'Violet Creative Agency',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    primaryColor: '#8b5cf6', // Violet 500
    secondaryColor: '#d946ef', // Fuchsia 500
    accentColor: '#38bdf8', // Sky 400
    backgroundColor: '#18181b', // Zinc 900
    cardBackground: '#27272a', // Zinc 800
    textColor: '#fafafa',
    textMuted: '#a1a1aa',
    radius: '1.25rem',
  },
  {
    id: 'warm-minimalist',
    name: 'Warm Terracotta Minimal',
    fontHeading: 'Playfair Display',
    fontBody: 'Plus Jakarta Sans',
    primaryColor: '#ea580c', // Orange 600
    secondaryColor: '#c2410c', // Orange 700
    accentColor: '#d97706', // Amber 600
    backgroundColor: '#fffbeb', // Amber 50
    cardBackground: '#ffffff',
    textColor: '#451a03', // Amber 950
    textMuted: '#78350f', // Amber 900
    radius: '0.75rem',
  },
];
