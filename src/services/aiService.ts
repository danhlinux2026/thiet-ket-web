import { WebsiteProject, CanvasSection, WebsiteTheme, CanvasElement, AIProviderConfig, LLMProviderType } from '../types';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  actionType?: 'ADD_SECTION' | 'UPDATE_THEME' | 'UPDATE_ELEMENT' | 'REPLACE_ALL_SECTIONS' | 'REWRITE_CONTENT' | 'OPTIMIZE_DESIGN' | 'NONE';
  actionSummary?: string;
  actionPayload?: any;
  suggestedActions?: string[];
  applied?: boolean;
}

export interface SendAIChatParams {
  message: string;
  project: WebsiteProject;
  selectedSectionId?: string | null;
  selectedElementId?: string | null;
  history?: AIChatMessage[];
  providerConfig?: AIProviderConfig;
}

export const DEFAULT_PROVIDER_CONFIG: AIProviderConfig = {
  provider: 'gemini',
  name: 'Google Gemini (Mặc định)',
  baseUrl: '',
  apiKey: '',
  model: 'gemini-3.8-flash',
  temperature: 0.7,
};

export const PRESET_PROVIDERS: {
  provider: LLMProviderType;
  title: string;
  description: string;
  badge: string;
  defaultBaseUrl: string;
  defaultModel: string;
  recommendedModels: { id: string; name: string; tag: string }[];
  requiresApiKey: boolean;
  supportsApiKey?: boolean;
  apiKeyHelpUrl?: string;
  defaultTemp: number;
}[] = [
  {
    provider: 'gemini',
    title: 'Google Gemini',
    description: 'Mô hình nhanh, thông minh & hỗ trợ xuất cấu trúc JSON hoàn hảo từ Google.',
    badge: 'Khuyên Dùng',
    defaultBaseUrl: '',
    defaultModel: 'gemini-3.8-flash',
    recommendedModels: [
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Mới nhất, Siêu nhanh)', tag: 'Khuyên Dùng' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Lý luận sâu sắc, UI cao cấp)', tag: 'Mạnh Mẽ' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Tối ưu tốc độ)', tag: 'Tốc độ' },
    ],
    requiresApiKey: false,
    defaultTemp: 0.7,
  },
  {
    provider: 'deepseek',
    title: 'DeepSeek AI',
    description: 'Mô hình lập trình và thiết kế cực mạnh với chi phí siêu rẻ.',
    badge: 'Phổ Biến',
    defaultBaseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    recommendedModels: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat (V3 - Đa năng & Code tốt)', tag: 'Mặc định' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1 - Suy luận sâu)', tag: 'Lý Luận' },
    ],
    requiresApiKey: true,
    apiKeyHelpUrl: 'https://platform.deepseek.com/api_keys',
    defaultTemp: 0.6,
  },
  {
    provider: 'openrouter',
    title: 'OpenRouter',
    description: 'Cổng kết nối hàng trăm mô hình mã nguồn mở & thương mại (Claude, Llama, Qwen, Mistral).',
    badge: 'Đa Năng',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    recommendedModels: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Thiết kế & Copywriting đỉnh cao)', tag: 'Đỉnh Cao' },
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3 (Nhanh & Rẻ)', tag: 'Tiết kiệm' },
      { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B (Chuyên Code Web)', tag: 'Coder' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', tag: 'Mạnh mẽ' },
    ],
    requiresApiKey: true,
    apiKeyHelpUrl: 'https://openrouter.ai/keys',
    defaultTemp: 0.7,
  },
  {
    provider: 'openai',
    title: 'OpenAI (GPT-4o)',
    description: 'Mô hình chuẩn mực với độ chính xác cao và khả năng viết copy xuất sắc.',
    badge: 'Chuẩn Mực',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    recommendedModels: [
      { id: 'gpt-4o', name: 'GPT-4o (Thông minh, toàn diện)', tag: 'Mạnh mẽ' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Nhanh, phản hồi tức thì)', tag: 'Tốc độ' },
      { id: 'o3-mini', name: 'o3-mini (Lập trình logic)', tag: 'Logic' },
    ],
    requiresApiKey: true,
    apiKeyHelpUrl: 'https://platform.openai.com/api-keys',
    defaultTemp: 0.7,
  },
  {
    provider: 'ollama',
    title: 'Ollama (Chạy Cục Bộ Local)',
    description: 'Chạy mô hình AI trực tiếp trên máy tính riêng, 100% riêng tư & miễn phí.',
    badge: 'Local / Offline',
    defaultBaseUrl: 'http://localhost:11434/v1',
    defaultModel: 'qwen2.5-coder:7b',
    recommendedModels: [
      { id: 'qwen2.5-coder:7b', name: 'Qwen 2.5 Coder (7B / 14B / 32B)', tag: 'Khuyên Dùng' },
      { id: 'llama3.3', name: 'Llama 3.3 (8B / 70B)', tag: 'Đa Năng' },
      { id: 'deepseek-coder:6.7b', name: 'DeepSeek Coder (6.7B)', tag: 'Lập Trình' },
      { id: 'mistral', name: 'Mistral (7B Instruct)', tag: 'Nhẹ Nhàng' },
    ],
    requiresApiKey: false,
    supportsApiKey: true,
    defaultTemp: 0.5,
  },
  {
    provider: 'custom',
    title: 'Custom Endpoint (OpenAI API)',
    description: 'Tùy chỉnh bất kỳ dịch vụ nào hỗ trợ chuẩn OpenAI (Groq, Together AI, vLLM, LM Studio, Kiro).',
    badge: 'Tự Do',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    recommendedModels: [
      { id: 'llama-3.3-70b-versatile', name: 'Groq: Llama 3.3 70B (Siêu Tốc & Miễn Phí)', tag: 'Khuyên Dùng' },
      { id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B (Chuyên Code Web)', tag: 'Coder' },
      { id: 'kiro', name: 'Kiro (Model Tùy Chọn Của Bạn)', tag: 'Custom' },
      { id: 'local-model', name: 'LM Studio / LocalAI', tag: 'Local' },
    ],
    requiresApiKey: true,
    supportsApiKey: true,
    apiKeyHelpUrl: 'https://console.groq.com/keys',
    defaultTemp: 0.7,
  },
];

export function getStoredProviderConfig(): AIProviderConfig {
  try {
    const saved = localStorage.getItem('webstudio_ai_provider_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PROVIDER_CONFIG, ...parsed };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_PROVIDER_CONFIG;
}

export function saveStoredProviderConfig(config: AIProviderConfig) {
  try {
    localStorage.setItem('webstudio_ai_provider_config', JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save AI provider config:', e);
  }
}

export async function testLLMConnection(config: AIProviderConfig): Promise<{
  success: boolean;
  latencyMs?: number;
  message?: string;
  error?: string;
  sampleResponse?: string;
}> {
  try {
    const res = await fetch('/api/ai/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ providerConfig: config }),
    });

    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Không thể kết nối đến máy chủ WebStudio',
    };
  }
}

export async function sendAIDesignChat(params: SendAIChatParams): Promise<{
  reply: string;
  actionType: 'ADD_SECTION' | 'UPDATE_THEME' | 'UPDATE_ELEMENT' | 'REPLACE_ALL_SECTIONS' | 'REWRITE_CONTENT' | 'OPTIMIZE_DESIGN' | 'NONE';
  actionSummary: string;
  actionPayload: any;
  suggestedActions: string[];
}> {
  const currentSection = params.project.sections.find((s) => s.id === params.selectedSectionId);
  const currentElement = currentSection?.elements.find((e) => e.id === params.selectedElementId);

  const selectedContext = currentElement
    ? {
        type: 'element',
        elementType: currentElement.type,
        content: currentElement.content,
        id: currentElement.id,
        sectionId: currentSection?.id,
        sectionName: currentSection?.name,
        styles: currentElement.styles,
      }
    : currentSection
    ? {
        type: 'section',
        id: currentSection.id,
        name: currentSection.name,
        category: currentSection.category,
        styles: currentSection.styles,
      }
    : null;

  const providerConfig = params.providerConfig || getStoredProviderConfig();

  try {
    const res = await fetch('/api/ai/design-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        providerConfig,
        projectContext: {
          name: params.project.name,
          description: params.project.description,
          theme: params.project.theme,
          sections: params.project.sections.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            elements: s.elements.map((el) => ({
              id: el.id,
              type: el.type,
              content: el.content,
            })),
          })),
        },
        selectedContext,
        history: params.history?.map((h) => ({
          sender: h.sender,
          text: h.text,
        })),
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Lỗi kết nối máy chủ AI');
    }

    return json.data;
  } catch (err: any) {
    console.error('Error calling AI chat API:', err);
    throw err;
  }
}


export async function enhanceTextWithAI(text: string, tone = 'persuasive', target = 'headline'): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/enhance-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, tone, target }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Lỗi tạo gợi ý nội dung');
    }
    return json.variations || [];
  } catch (e) {
    console.error('AI Text enhancer error:', e);
    return [
      `Đột phá cùng ${text}`,
      `Nâng tầm giải pháp với ${text}`,
      `Trải nghiệm sự khác biệt từ ${text}`,
    ];
  }
}
