export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type SidebarTab = 'templates' | 'blocks' | 'elements' | 'layers' | 'theme' | 'settings' | 'github';

export type ElementType =
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'icon'
  | 'badge'
  | 'card'
  | 'pricing-card'
  | 'testimonial-card'
  | 'accordion'
  | 'form-input'
  | 'divider'
  | 'spacer'
  | 'video'
  | 'stats-item';

export type BlockCategory =
  | 'all'
  | 'header'
  | 'hero'
  | 'features'
  | 'stats'
  | 'pricing'
  | 'testimonials'
  | 'gallery'
  | 'faq'
  | 'cta'
  | 'contact'
  | 'footer';

export type TemplateCategory =
  | 'all'
  | 'saas'
  | 'ecommerce'
  | 'portfolio'
  | 'restaurant'
  | 'education'
  | 'agency'
  | 'realestate';

export interface StyleProps {
  backgroundColor?: string;
  bgGradient?: string;
  backgroundImage?: string;
  textColor?: string;
  accentColor?: string;
  fontSize?: string; // 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  fontWeight?: string; // 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: string;
  paddingTop?: number; // in px or rem scale
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  borderRadius?: string; // 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  opacity?: number;
  maxWidth?: string; // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  animation?: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'zoomIn' | 'pulse';
  gap?: number;
  columns?: number; // 1, 2, 3, 4
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  content?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  src?: string;
  alt?: string;
  iconName?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  badgeText?: string;
  badgeVariant?: 'subtle' | 'solid' | 'outline';
  styles: StyleProps;
  // Specific data for complex elements
  items?: Array<{
    id: string;
    title?: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    image?: string;
    price?: string;
    period?: string;
    popular?: boolean;
    features?: string[];
    buttonText?: string;
    rating?: number;
    author?: string;
    role?: string;
    avatar?: string;
    question?: string;
    answer?: string;
    statNumber?: string;
    statLabel?: string;
    placeholder?: string;
  }>;
  placeholder?: string;
  inputType?: 'text' | 'email' | 'textarea' | 'tel';
}

export interface CanvasSection {
  id: string;
  name: string;
  category: BlockCategory;
  layout: 'container' | 'full-width' | 'split-2' | 'grid-3' | 'grid-4' | 'bento';
  styles: StyleProps;
  elements: CanvasElement[];
  locked?: boolean;
  hidden?: boolean;
}

export interface WebsiteTheme {
  id: string;
  name: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  textMuted: string;
  radius: string;
}

export interface WebsiteProject {
  id: string;
  name: string;
  description: string;
  theme: WebsiteTheme;
  sections: CanvasSection[];
  settings: {
    title: string;
    metaDescription: string;
    faviconUrl?: string;
    customCss?: string;
    customJs?: string;
  };
  lastModified: number;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  categoryName: string;
  thumbnail: string;
  description: string;
  theme: WebsiteTheme;
  sections: CanvasSection[];
  tags: string[];
}

export interface BlockPreset {
  id: string;
  name: string;
  category: BlockCategory;
  categoryName: string;
  description: string;
  thumbnail?: string;
  section: CanvasSection;
}
