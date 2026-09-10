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

// Helper to extract JSON from any LLM response text
function cleanAndParseJSON(rawText: string) {
  if (!rawText) return null;
  let text = rawText.trim();

  // Remove markdown code blocks if present
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    // Attempt to extract the first JSON object {}
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const extracted = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(extracted);
      } catch (innerErr) {
        // failed
      }
    }
    return null;
  }
}

// Test Connection Endpoint for Custom LLMs
app.post('/api/ai/test-connection', async (req, res) => {
  const startTime = Date.now();
  try {
    const { providerConfig } = req.body;
    const provider = providerConfig?.provider || 'gemini';

    if (provider === 'gemini') {
      const apiKey = providerConfig?.apiKey?.trim() || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ success: false, error: 'Chưa có Gemini API Key' });
      }
      const client = new GoogleGenAI({ apiKey });
      let modelName = providerConfig?.model || 'gemini-3.8-flash';
      let testRes: any;
      let fallbackUsed = false;

      try {
        testRes = await client.models.generateContent({
          model: modelName,
          contents: 'Xin chào, trả lời ngắn gọn "OK" để xác nhận kết nối.',
        });
      } catch (geminiErr: any) {
        const errMsg = geminiErr?.message || '';
        const isHighDemand =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429');

        if (isHighDemand && modelName !== 'gemini-2.5-flash') {
          console.warn(`Gemini ${modelName} experiencing high demand, falling back to gemini-2.5-flash for test...`);
          modelName = 'gemini-2.5-flash';
          fallbackUsed = true;
          testRes = await client.models.generateContent({
            model: modelName,
            contents: 'Xin chào, trả lời ngắn gọn "OK" để xác nhận kết nối.',
          });
        } else {
          throw geminiErr;
        }
      }

      const latencyMs = Date.now() - startTime;
      return res.json({
        success: true,
        latencyMs,
        provider: 'gemini',
        model: modelName,
        message: fallbackUsed
          ? `Kết nối thành công đến Google Gemini (${modelName})! (Tự động chuyển sang bản 2.5 Flash ổn định vì bản 3.8 Flash đang có lưu lượng truy cập cao từ Google). Độ trễ: ${latencyMs}ms`
          : `Kết nối thành công đến Google Gemini (${modelName})! Độ trễ: ${latencyMs}ms`,
        sampleResponse: testRes.text?.trim() || 'OK',
      });
    }

    // OpenAI-compatible / Custom LLM (OpenAI, DeepSeek, OpenRouter, Ollama, Custom)
    const baseUrl = (providerConfig?.baseUrl || '').trim().replace(/\/+$/, '');
    const model = (providerConfig?.model || '').trim();
    const apiKey = (providerConfig?.apiKey || '').trim();

    if (!baseUrl) {
      return res.status(400).json({ success: false, error: 'Base URL không được để trống' });
    }
    if (!model) {
      return res.status(400).json({ success: false, error: 'Model name không được để trống' });
    }

    const endpoint = `${baseUrl}/chat/completions`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://webstudio.dev';
      headers['X-Title'] = 'WebStudio AI Co-Pilot';
    }

    const testPayload = {
      model: model,
      messages: [
        { role: 'system', content: 'Bạn là trợ lý AI. Trả lời cực ngắn.' },
        { role: 'user', content: 'Ping test. Trả lời "OK".' },
      ],
      max_tokens: 50,
      temperature: 0.1,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        success: false,
        latencyMs,
        error: `Máy chủ trả về HTTP ${response.status}: ${errText.slice(0, 300)}`,
      });
    }

    const json: any = await response.json();
    const replyText = json.choices?.[0]?.message?.content?.trim() || 'OK';

    return res.json({
      success: true,
      latencyMs,
      provider,
      model,
      message: `Kết nối thành công đến ${provider.toUpperCase()} (${model})! Độ trễ: ${latencyMs}ms`,
      sampleResponse: replyText,
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('LLM Connection Test Failed:', error);

    const errorMsg = error.message || '';
    const isLocalhost =
      req.body?.providerConfig?.baseUrl?.includes('localhost') ||
      req.body?.providerConfig?.baseUrl?.includes('127.0.0.1');

    let userFriendlyError = error.message || 'Không thể kết nối đến endpoint Custom LLM';

    if (error.name === 'AbortError') {
      userFriendlyError = 'Kết nối quá thời gian chờ (Timeout sau 15s). Kiểm tra lại Base URL và mạng.';
    } else if (isLocalhost || errorMsg.includes('fetch failed') || errorMsg.includes('ECONNREFUSED')) {
      userFriendlyError = `Không thể kết nối tới ${req.body?.providerConfig?.baseUrl}: WebStudio đang chạy trên máy chủ Cloud nên không thể chạm tới cổng localhost trên máy tính cá nhân của bạn. Gợi ý: Hãy dùng ngrok (chạy "ngrok http <cổng>") rồi dán URL https://...ngrok-free.app vào Base URL, hoặc dùng Groq Cloud miễn phí (https://api.groq.com/openai/v1).`;
    }

    return res.status(500).json({
      success: false,
      latencyMs,
      error: userFriendlyError,
    });
  }
});

// AI Design Co-Pilot Chat Endpoint
app.post('/api/ai/design-chat', async (req, res) => {
  try {
    const { message, projectContext, selectedContext, history = [], providerConfig } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
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
2. BẠN BẮT BUỘC PHẢI TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON HỢP LỆ VỚI CÁC TRƯỜNG CHÍNH XÁC SAU (TUYỆT ĐỐI KHÔNG KÈM TEXT TỰ DO NGOÀI JSON):
{
  "reply": "Lời giải thích ngắn gọn, súc tích về thay đổi hoặc lời khuyên thiết kế (1-3 câu)",
  "actionType": "ADD_SECTION" | "UPDATE_THEME" | "UPDATE_ELEMENT" | "REPLACE_ALL_SECTIONS" | "REWRITE_CONTENT" | "OPTIMIZE_DESIGN" | "NONE",
  "actionSummary": "Tóm tắt ngắn gọn hành động (ví dụ: 'Thêm Section Bảng Giá 3 Gói', 'Đổi Theme Cyberpunk Neon')",
  "suggestedActions": ["Gợi ý hành động 1", "Gợi ý hành động 2", "Gợi ý hành động 3"],
  "actionPayload": <Object JSON chi tiết hoặc null>
}

CHI TIẾT actionPayload:
- Nếu actionType === 'ADD_SECTION': Một object CanvasSection hoàn chỉnh (id ngẫu nhiên kiểu "sec-" + Date.now(), name: "Tên Khối", category: 'hero'|'features'|'pricing'|'testimonials'|'faq'|'cta'|'stats'|'contact'|'footer', layout: 'container'|'split-2'|'grid-3'|'grid-4'|'bento', styles: { backgroundColor: "#0f172a", textColor: "#ffffff", paddingTop: 60, paddingBottom: 60 }, elements: [danh sách các CanvasElement phong phú, đẹp mắt]).
- Nếu actionType === 'UPDATE_THEME': Object WebsiteTheme hoàn chỉnh (id, name, fontHeading, fontBody, primaryColor, secondaryColor, accentColor, backgroundColor, cardBackground, textColor, textMuted, radius).
- Nếu actionType === 'UPDATE_ELEMENT': Object chứa { sectionId, elementId, updates: { content, styles, variant, items, ... } }.
- Nếu actionType === 'REPLACE_ALL_SECTIONS': Danh sách mảng các CanvasSection tạo nên toàn bộ landing page mới đầy đủ.
- Nếu actionType === 'REWRITE_CONTENT': Object chứa { target: 'all'|'hero'|'selected', sections: [...] hoặc updates: {...} }.
- Nếu actionType === 'NONE': null.

CÁC ELEMENT TYPE HỖ TRỢ:
'heading', 'paragraph', 'button', 'image', 'icon', 'badge', 'card', 'pricing-card', 'testimonial-card', 'accordion', 'form-input', 'divider', 'spacer', 'stats-item'.
Tất cả hình ảnh dùng nguồn Unsplash (https://images.unsplash.com/...) chất lượng cao.
Tất cả icon dùng tên icon Lucide hợp lệ ('Sparkles', 'Shield', 'Zap', 'Check', 'Star', 'ArrowRight', 'Layers', 'Globe', 'Cpu', 'Users', 'TrendingUp', 'Heart', 'Mail', 'Phone', 'Lock').
`;

    const provider = providerConfig?.provider || 'gemini';

    // ================= BRANCH 1: DEFAULT / CUSTOM GEMINI =================
    if (provider === 'gemini') {
      const apiKey = providerConfig?.apiKey?.trim() || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'Chưa cấu hình GEMINI_API_KEY trong hệ thống. Vui lòng cung cấp API key trong phần Cài đặt LLM.',
        });
      }

      const client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

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

      let modelName = providerConfig?.model || 'gemini-3.8-flash';
      let response: any;

      try {
        response = await client.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction,
            temperature: providerConfig?.temperature ?? 0.7,
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
      } catch (geminiErr: any) {
        const errMsg = geminiErr?.message || '';
        const isOverloaded =
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429');

        if (isOverloaded && modelName !== 'gemini-2.5-flash') {
          console.warn(`Gemini ${modelName} overloaded (503), auto-falling back to gemini-2.5-flash...`);
          modelName = 'gemini-2.5-flash';
          response = await client.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction,
              temperature: providerConfig?.temperature ?? 0.7,
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
        } else {
          throw geminiErr;
        }
      }

      const rawText = response.text || '{}';
      let parsedResult = cleanAndParseJSON(rawText);

      if (!parsedResult) {
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
        provider: 'gemini',
        model: modelName,
        data: parsedResult,
      });
    }

    // ================= BRANCH 2: CUSTOM / OPENAI-COMPATIBLE LLM =================
    const baseUrl = (providerConfig?.baseUrl || '').trim().replace(/\/+$/, '');
    const model = (providerConfig?.model || '').trim();
    const apiKey = (providerConfig?.apiKey || '').trim();

    if (!baseUrl) {
      return res.status(400).json({ error: 'Base URL của Custom LLM không được để trống' });
    }
    if (!model) {
      return res.status(400).json({ error: 'Model name của Custom LLM không được để trống' });
    }

    const endpoint = `${baseUrl}/chat/completions`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://webstudio.dev';
      headers['X-Title'] = 'WebStudio AI Co-Pilot';
    }

    // Build messages array
    const messages: any[] = [
      {
        role: 'system',
        content: `${systemInstruction}\n\nCHÚ Ý QUAN TRỌNG: Bạn chỉ được trả lời đúng 1 chuỗi JSON hợp lệ. Không viết thêm lời chào hay giải thích ngoài khối JSON.`,
      },
    ];

    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        messages.push({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.text,
        });
      }
    }

    messages.push({
      role: 'user',
      content: `Yêu cầu của người dùng: "${message}". Hãy phân tích và đưa ra giải pháp thiết kế cùng payload JSON thay đổi phù hợp.`,
    });

    const requestPayload: any = {
      model,
      messages,
      temperature: providerConfig?.temperature ?? 0.7,
    };

    // Try response_format json_object for supported providers
    if (['openai', 'deepseek', 'openrouter'].includes(provider)) {
      requestPayload.response_format = { type: 'json_object' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `Custom LLM (${model}) trả về lỗi HTTP ${response.status}: ${errText.slice(0, 400)}`,
      });
    }

    const data: any = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    let parsedResult = cleanAndParseJSON(rawContent);

    if (!parsedResult) {
      parsedResult = {
        reply: rawContent,
        actionType: 'NONE',
        actionSummary: 'Tư vấn thiết kế',
        suggestedActions: ['Tạo section bảng giá', 'Đổi sang màu tối sang trọng', 'Thêm phần đánh giá'],
        actionPayload: null,
      };
    }

    return res.json({
      success: true,
      provider,
      model,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error('AI Co-Pilot Error:', error);
    const errorMsg = error.message || '';
    const isLocalhost =
      req.body?.providerConfig?.baseUrl?.includes('localhost') ||
      req.body?.providerConfig?.baseUrl?.includes('127.0.0.1');

    let userFriendlyError = error.message || 'Lỗi xử lý yêu cầu AI';

    if (error.name === 'AbortError') {
      userFriendlyError = 'Yêu cầu tới AI đã bị quá thời gian chờ (Timeout). Vui lòng thử lại.';
    } else if (errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('UNAVAILABLE')) {
      userFriendlyError = 'Mô hình Google Gemini đang có lượng truy cập cao đột biến từ phía Google (Lỗi 503 tạm thời). Bạn hãy thử lại sau giây lát, hoặc bấm vào biểu tượng Cài đặt AI (trên cùng) để chuyển sang dùng DeepSeek, OpenRouter, Groq hoặc OpenAI.';
    } else if (isLocalhost && (errorMsg.includes('fetch failed') || errorMsg.includes('ECONNREFUSED'))) {
      userFriendlyError = `Không thể kết nối đến ${req.body?.providerConfig?.baseUrl}: WebStudio đang chạy trên máy chủ Cloud nên không thể tự kết nối vào cổng localhost trên máy tính riêng của bạn. Gợi ý: Hãy dùng ngrok ("ngrok http <cổng>") để tạo link công khai, hoặc dùng Groq Cloud API miễn phí (Base URL: https://api.groq.com/openai/v1, Model: llama-3.3-70b-versatile).`;
    }

    return res.status(500).json({
      success: false,
      error: userFriendlyError,
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
