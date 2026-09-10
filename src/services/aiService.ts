import { WebsiteProject, CanvasSection, WebsiteTheme, CanvasElement } from '../types';

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

  try {
    const res = await fetch('/api/ai/design-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
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
