import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now(),
  });
});

// AI Design Co-Pilot Chat Endpoint
app.post('/api/ai/design-chat', async (req, res) => {
  try {
    const { message, projectContext, selectedContext, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trong hệ thống. Vui lòng kiểm tra cài đặt Secrets.',
      });
    }

    const systemInstruction = `
Bạn là "WebStudio AI Co-Pilot" - Trợ lý kiến trúc sư & chuyên gia thiết kế website UI/UX hàng đầu.
Nhiệm vụ của bạn là hỗ trợ người dùng chỉnh sửa, bổ sung, tối ưu hóa giao diện website trên nền tảng WebStudio thông qua việc trò chuyện và tạo ra các lệnh thay đổi cấu trúc dữ liệu JSON thực tế.

Website hiện tại bao gồm:
- Tiêu đề dự án: "${projectContext?.name || 'Website'}"
- Mô tả: "${projectContext?.description || ''}"
- Theme hiện tại: ${JSON.stringify(projectContext?.theme || {})}
- Danh sách các section hiện có (${projectContext?.sections?.length || 0} sections): ${JSON.stringify(
      (projectContext?.sections || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        elementsCount: s.elements?.length,
      }))
    )}
- Phần tử / Section đang được người dùng chọn: ${JSON.stringify(selectedContext || 'Không có')}

QUY TẮC PHẢN HỒI:
1. Bạn phải luôn trả lời bằng tiếng Việt thân thiện, súc tích, chuyên nghiệp và truyền cảm hứng.
2. Bạn phải xuất ra phản hồi ở định dạng JSON có cấu trúc rõ ràng với:
   - "reply": Lời giải thích ngắn gọn, súc tích về thay đổi hoặc lời khuyên thiết kế (1-3 câu).
   - "actionType": Loại thao tác thực hiện ('ADD_SECTION' | 'UPDATE_THEME' | 'UPDATE_ELEMENT' | 'REPLACE_ALL_SECTIONS' | 'REWRITE_CONTENT' | 'OPTIMIZE_DESIGN' | 'NONE')
   - "actionSummary": Tóm tắt ngắn hành động (ví dụ: "Thêm Section Bảng Giá 3 Gói", "Đổi Theme Cyberpunk Neon", "Cập nhật tiêu đề Hero").
   - "suggestedActions": Danh sách 2-4 câu lệnh gợi ý tiếp theo người dùng có thể nhấp vào.
   - "actionPayload": Dữ liệu chi tiết tương ứng với actionType:
     * Nếu actionType === 'ADD_SECTION': Một object CanvasSection hoàn chỉnh (id ngẫu nhiên kiểu "sec-" + Date.now(), name, category: 'hero'|'features'|'pricing'|'testimonials'|'faq'|'cta'|'stats'|'contact'|'footer', layout: 'container'|'split-2'|'grid-3'|'grid-4'|'bento', styles: { backgroundColor, textColor, paddingTop: 60, paddingBottom: 60, ... }, elements: [danh sách CanvasElement phong phú, đẹp mắt]).
     * Nếu actionType === 'UPDATE_THEME': Object WebsiteTheme hoàn chỉnh (id, name, fontHeading, fontBody, primaryColor, secondaryColor, accentColor, backgroundColor, cardBackground, textColor, textMuted, radius).
     * Nếu actionType === 'UPDATE_ELEMENT': Object chứa { sectionId, elementId, updates: { content, styles, variant, items, ... } }.
     * Nếu actionType === 'REPLACE_ALL_SECTIONS': Danh sách mảng các CanvasSection tạo nên toàn bộ landing page mới đầy đủ từ Header -> Hero -> Features -> Pricing -> Testimonials -> CTA -> Footer.
     * Nếu actionType === 'REWRITE_CONTENT': Object chứa { target: 'all'|'hero'|'selected', sections: [...] hoặc updates: {...} }.
     * Nếu actionType === 'NONE': null.

CÁC ELEMENT TYPE HỖ TRỢ:
'heading', 'paragraph', 'button', 'image', 'icon', 'badge', 'card', 'pricing-card', 'testimonial-card', 'accordion', 'form-input', 'divider', 'spacer', 'stats-item'.
Tất cả hình ảnh dùng nguồn Unsplash chất lượng cao (https://images.unsplash.com/...) phù hợp chủ đề.
Tất cả icon dùng tên icon Lucide hợp lệ (e.g. 'Sparkles', 'Shield', 'Zap', 'Check', 'Star', 'ArrowRight', 'Layers', 'Globe', 'Cpu', 'Users', 'TrendingUp', 'Heart', 'Mail', 'Phone', 'Lock').
`;

    // Format chat history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [
        {
          text: `Yêu cầu của người dùng: "${message}". Hãy phân tích và đưa ra giải pháp thiết kế cùng payload JSON thay đổi phù hợp.`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Lời giải thích và tư vấn thiết kế cho người dùng bằng tiếng Việt.',
            },
            actionType: {
              type: Type.STRING,
              description:
                'Loại thao tác: ADD_SECTION, UPDATE_THEME, UPDATE_ELEMENT, REPLACE_ALL_SECTIONS, REWRITE_CONTENT, OPTIMIZE_DESIGN, hoặc NONE.',
            },
            actionSummary: {
              type: Type.STRING,
              description: 'Tóm tắt ngắn gọn 1 dòng về thao tác.',
            },
            suggestedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Gợi ý 2-4 câu lệnh tiếp theo cho người dùng.',
            },
            actionPayload: {
              type: Type.OBJECT,
              description: 'Dữ liệu payload JSON để áp dụng trực tiếp vào dự án WebStudio.',
            },
          },
          required: ['reply', 'actionType', 'actionSummary', 'suggestedActions'],
        },
      },
    });

    const rawText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON response:', rawText);
      parsedResult = {
        reply: rawText,
        actionType: 'NONE',
        actionSummary: 'Tư vấn thiết kế',
        suggestedActions: ['Tạo section bảng giá', 'Đổi sang màu tối sang trọng', 'Thêm phần đánh giá'],
        actionPayload: null,
      };
    }

    return res.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error('Gemini AI API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi xử lý yêu cầu AI',
    });
  }
});

// Quick AI Text Enhancer
app.post('/api/ai/enhance-text', async (req, res) => {
  try {
    const { text, tone = 'persuasive', target = 'headline' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Hãy viết lại và tối ưu hóa nội dung website sau đây thành 3 biến thể xuất sắc hơn:
Nội dung gốc: "${text}"
Mục đích: ${target} (ví dụ tiêu đề chính, mô tả, nút kêu gọi hành động)
Phong cách (Tone): ${tone} (chuyên nghiệp, thuyết phục, hiện đại, kích thích chuyển đổi).

Trả về JSON danh sách 3 biến thể:
{"variations": ["biến thể 1", "biến thể 2", "biến thể 3"]}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{"variations": []}');
    return res.json({ success: true, variations: parsed.variations || [] });
  } catch (err: any) {
    console.error('Error enhancing text:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WebStudio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
