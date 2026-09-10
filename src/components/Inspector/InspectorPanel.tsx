import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  Link,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Send,
  Loader2,
  Check,
  Palette,
  PlusCircle,
  Wand2,
  FileText,
  HelpCircle,
  ArrowRight,
  Zap,
  Lightbulb,
  MousePointer,
  ChevronRight,
  ShieldCheck,
  Bot,
  Layers,
} from 'lucide-react';
import {
  CanvasElement,
  CanvasSection,
  StyleProps,
  WebsiteProject,
  WebsiteTheme,
} from '../../types';
import {
  sendAIDesignChat,
  AIChatMessage,
} from '../../services/aiService';

interface InspectorPanelProps {
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  selectedSectionId: string | null;
  selectedElementId: string | null;
  onClose: () => void;
  onOpenImagePickerForSelected?: () => void;
  initialTab?: 'inspector' | 'ai';
}

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: 'Xin chào! Tôi là Trợ Lý Thiết Kế AI (WebStudio Co-Pilot). Bạn muốn chỉnh sửa giao diện, thêm section, đổi màu sắc hay viết lại nội dung gì cho website?',
    timestamp: Date.now(),
    suggestedActions: [
      '✨ Thêm Section Bảng Giá 3 Gói Pro',
      '🎨 Đổi Theme sang Tối Sang Trọng (Luxury Dark)',
      '💬 Thêm phần Đánh Giá Khách Hàng (Testimonials)',
      '🚀 Tạo lại toàn bộ Landing Page theo chủ đề AI SaaS',
    ],
  },
];

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  project,
  setProject,
  selectedSectionId,
  selectedElementId,
  onClose,
  onOpenImagePickerForSelected,
  initialTab = 'ai',
}) => {
  // Find selected section & element
  const currentSection = project.sections.find((s) => s.id === selectedSectionId);
  const currentElement = currentSection?.elements.find((e) => e.id === selectedElementId);
  const hasSelection = Boolean(currentSection || currentElement);

  // Active right tab: 'inspector' or 'ai'
  const [activeTab, setActiveTab] = useState<'inspector' | 'ai'>(() => {
    return hasSelection ? 'inspector' : 'ai';
  });

  // Switch to inspector tab automatically when user clicks an element, if they want
  useEffect(() => {
    if (hasSelection && activeTab !== 'ai') {
      setActiveTab('inspector');
    }
  }, [selectedSectionId, selectedElementId, hasSelection]);

  // AI Chat State
  const [messages, setMessages] = useState<AIChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('webstudio_ai_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'sections' | 'themes' | 'copy' | 'audit'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'ai') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('webstudio_ai_chat_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Handle Section Style Update
  const updateSectionStyles = (newStyles: Partial<StyleProps>) => {
    if (!selectedSectionId) return;
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === selectedSectionId
          ? {
              ...sec,
              styles: { ...sec.styles, ...newStyles },
            }
          : sec
      ),
    }));
  };

  // Handle Element Style & Prop Update
  const updateElementProps = (updated: Partial<CanvasElement>) => {
    if (!selectedSectionId || !selectedElementId) return;
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === selectedSectionId
          ? {
              ...sec,
              elements: sec.elements.map((el) =>
                el.id === selectedElementId ? { ...el, ...updated } : el
              ),
            }
          : sec
      ),
    }));
  };

  const updateElementStyles = (newStyles: Partial<StyleProps>) => {
    if (!currentElement) return;
    updateElementProps({
      styles: { ...currentElement.styles, ...newStyles },
    });
  };

  // Execute Action Payload onto Project
  const handleApplyAction = (messageId: string, actionType: string, actionPayload: any) => {
    if (!actionPayload) return;

    try {
      if (actionType === 'ADD_SECTION') {
        const newSec: CanvasSection = {
          ...actionPayload,
          id: `sec-${Date.now()}`,
        };
        setProject((prev) => ({
          ...prev,
          sections: [...prev.sections, newSec],
          lastModified: Date.now(),
        }));
      } else if (actionType === 'UPDATE_THEME') {
        const newTheme: WebsiteTheme = {
          ...project.theme,
          ...actionPayload,
        };
        setProject((prev) => ({
          ...prev,
          theme: newTheme,
          lastModified: Date.now(),
        }));
      } else if (actionType === 'UPDATE_ELEMENT') {
        const { sectionId, elementId, updates } = actionPayload;
        const targetSecId = sectionId || selectedSectionId;
        const targetElId = elementId || selectedElementId;

        if (targetSecId && targetElId && updates) {
          setProject((prev) => ({
            ...prev,
            sections: prev.sections.map((sec) =>
              sec.id === targetSecId
                ? {
                    ...sec,
                    elements: sec.elements.map((el) =>
                      el.id === targetElId
                        ? { ...el, ...updates, styles: { ...el.styles, ...(updates.styles || {}) } }
                        : el
                    ),
                  }
                : sec
            ),
            lastModified: Date.now(),
          }));
        }
      } else if (actionType === 'REPLACE_ALL_SECTIONS') {
        if (Array.isArray(actionPayload) && actionPayload.length > 0) {
          setProject((prev) => ({
            ...prev,
            sections: actionPayload,
            lastModified: Date.now(),
          }));
        }
      } else if (actionType === 'REWRITE_CONTENT') {
        if (actionPayload.sections && Array.isArray(actionPayload.sections)) {
          setProject((prev) => ({
            ...prev,
            sections: actionPayload.sections,
            lastModified: Date.now(),
          }));
        } else if (actionPayload.name || actionPayload.description) {
          setProject((prev) => ({
            ...prev,
            name: actionPayload.name || prev.name,
            description: actionPayload.description || prev.description,
            lastModified: Date.now(),
          }));
        }
      }

      // Mark message as applied
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, applied: true } : msg))
      );
    } catch (err) {
      console.error('Failed to apply AI action:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendAIDesignChat({
        message: text,
        project,
        selectedSectionId,
        selectedElementId,
        history: messages,
      });

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: Date.now(),
        actionType: response.actionType,
        actionSummary: response.actionSummary,
        actionPayload: response.actionPayload,
        suggestedActions: response.suggestedActions,
        applied: false,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto-apply theme or element updates for fast fluid experience
      if (response.actionType === 'UPDATE_THEME' && response.actionPayload) {
        handleApplyAction(aiMsg.id, response.actionType, response.actionPayload);
      }
    } catch (err: any) {
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Đã có lỗi: ${err.message || 'Không thể kết nối đến máy chủ AI'}. Bạn có thể thử lại sau giây lát.`,
        timestamp: Date.now(),
        suggestedActions: ['Thêm section Bảng Giá 3 Gói', 'Đổi màu website sang Dark Mode'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem('webstudio_ai_chat_history');
  };

  const isEditingElement = Boolean(currentElement);
  const targetStyles = isEditingElement ? currentElement?.styles || {} : currentSection?.styles || {};

  const QUICK_PROMPTS = [
    {
      category: 'sections',
      icon: PlusCircle,
      label: 'Bảng Giá 3 Gói Pro',
      prompt: 'Thêm một section Bảng Giá (Pricing Table) 3 gói dịch vụ hiện đại có huy hiệu Phổ Biến Nhất và các nút đăng ký.',
    },
    {
      category: 'sections',
      icon: Sparkles,
      label: 'Đánh Giá Khách Hàng',
      prompt: 'Thêm một section Nhận xét & Đánh giá của khách hàng (Testimonials) với 3 thẻ avatar, sao đánh giá và lời chứng thực chân thực.',
    },
    {
      category: 'sections',
      icon: HelpCircle,
      label: 'FAQ Câu Hỏi Thường Gặp',
      prompt: 'Thêm một section Câu Hỏi Thường Gặp (FAQ) dạng Accordion giải đáp 4 thắc mắc phổ biến của khách hàng.',
    },
    {
      category: 'sections',
      icon: Zap,
      label: 'CTA Kêu Gọi Nổi Bật',
      prompt: 'Thêm một section Kêu gọi hành động (Call To Action - CTA) nền gradient nổi bật kèm form nhận ưu đãi dùng thử.',
    },
    {
      category: 'themes',
      icon: Palette,
      label: 'Tối Sang Trọng (Luxury Dark)',
      prompt: 'Đổi bảng màu website sang phong cách Dark Mode sang trọng: nền Slate 950, màu chủ đạo Vàng Ánh Kim Amber (#f59e0b) và font Playfair Display.',
    },
    {
      category: 'themes',
      icon: Palette,
      label: 'Cyberpunk Tím Neon',
      prompt: 'Đổi theme sang tông Cyberpunk hiện đại: nền đen sâu, màu tím neon (#a855f7) và xanh cyan (#06b6d4), font Syne.',
    },
    {
      category: 'themes',
      icon: Palette,
      label: 'Tối Giản Nhật Bản (Zen Minimalist)',
      prompt: 'Đổi theme website sang phong cách Tối giản Nhật Bản: nền kem sáng (#faf8f5), chữ xám đậm (#1c1917), màu nhấn Matcha (#15803d) và font Outfit.',
    },
    {
      category: 'copy',
      icon: FileText,
      label: 'Tối Ưu Tiêu Đề Hero',
      prompt: 'Viết lại tiêu đề chính và đoạn mô tả ở phần đầu trang cho cuốn hút, tập trung vào lợi ích vượt trội và tăng chuyển đổi.',
    },
    {
      category: 'copy',
      icon: Wand2,
      label: 'Viết Lại Toàn Bộ Nội Dung',
      prompt: 'Rà soát và viết lại toàn bộ nội dung text trên trang web theo phong cách chuyên nghiệp, thuyết phục và súc tích.',
    },
    {
      category: 'audit',
      icon: ShieldCheck,
      label: 'Khám & Tối Ưu UX/UI',
      prompt: 'Hãy phân tích bố cục trang hiện tại và gợi ý 3 cải tiến UX/UI quan trọng nhất để tăng độ thẩm mỹ và tỷ lệ tương tác.',
    },
  ];

  const filteredPrompts =
    activeCategory === 'all'
      ? QUICK_PROMPTS
      : QUICK_PROMPTS.filter((p) => p.category === activeCategory);

  return (
    <aside className="w-80 sm:w-88 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden shrink-0 shadow-2xl z-20 transition-all">
      {/* Top Dual Tabs Switcher */}
      <div className="h-11 px-2 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
            <span>Trợ Lý AI</span>
            <span className="px-1 py-0.2 bg-white/20 text-[9px] font-bold rounded-full">Pro</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'inspector'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thuộc Tính</span>
            {hasSelection && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {activeTab === 'ai' && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-md transition"
              title="Xóa lịch sử chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs p-1.5 hover:bg-slate-800 rounded-md transition"
            title="Đóng bảng bên phải"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ================= TAB 1: AI DESIGN CO-PILOT ================= */}
      {activeTab === 'ai' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Target Context Bar */}
          <div className="px-3 py-1.5 bg-indigo-950/40 border-b border-indigo-900/30 flex items-center justify-between text-[11px] text-indigo-300 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <MousePointer className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="text-slate-400">Phạm vi:</span>
              {currentElement ? (
                <span className="font-semibold text-indigo-200 truncate bg-indigo-900/50 px-1.5 py-0.5 rounded border border-indigo-700/40">
                  Phần tử {currentElement.type} ({currentSection?.name})
                </span>
              ) : currentSection ? (
                <span className="font-semibold text-indigo-200 truncate bg-indigo-900/50 px-1.5 py-0.5 rounded border border-indigo-700/40">
                  Khối {currentSection.name}
                </span>
              ) : (
                <span className="text-slate-300 font-medium">Toàn bộ Website ({project.sections.length} khối)</span>
              )}
            </div>

            {hasSelection && (
              <button
                onClick={onClose}
                className="text-[10px] text-indigo-400 hover:text-white underline ml-2 shrink-0"
              >
                Về toàn trang
              </button>
            )}
          </div>

          {/* Quick Category Filter Pills */}
          <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'sections', label: 'Thêm Khối' },
              { id: 'themes', label: 'Đổi Màu' },
              { id: 'copy', label: 'Nội Dung' },
              { id: 'audit', label: 'Khám UI/UX' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition ${
                  activeCategory === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs select-text">
            {/* Quick Suggestion Prompt Pills */}
            {messages.length <= 2 && (
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gợi ý thao tác thiết kế nhanh:</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {filteredPrompts.slice(0, 4).map((p, idx) => {
                    const IconComponent = p.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(p.prompt)}
                        className="w-full text-left px-2.5 py-1.5 bg-slate-900/90 hover:bg-indigo-950/60 hover:border-indigo-500/50 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <IconComponent className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate font-medium text-[11px]">{p.label}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-slate-800/95 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>WebStudio AI Co-Pilot</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-[12px]">{msg.text}</p>

                    {/* Action Card Preview if AI generated changes */}
                    {msg.actionType && msg.actionType !== 'NONE' && msg.actionPayload && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 rounded text-[9px] font-bold uppercase tracking-wider">
                              {msg.actionType === 'ADD_SECTION' && 'Khối Mới'}
                              {msg.actionType === 'UPDATE_THEME' && 'Đổi Theme'}
                              {msg.actionType === 'UPDATE_ELEMENT' && 'Sửa Phần Tử'}
                              {msg.actionType === 'REPLACE_ALL_SECTIONS' && 'Thay Toàn Trang'}
                              {msg.actionType === 'REWRITE_CONTENT' && 'Tối Ưu Text'}
                              {msg.actionType === 'OPTIMIZE_DESIGN' && 'Tối Ưu UX'}
                            </span>
                            <span className="font-semibold text-white text-[11px] truncate">
                              {msg.actionSummary || 'Thay đổi thiết kế'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleApplyAction(msg.id, msg.actionType!, msg.actionPayload)}
                            disabled={msg.applied}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition shrink-0 ${
                              msg.applied
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 cursor-default'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-sm hover:scale-102 active:scale-98'
                            }`}
                          >
                            {msg.applied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Đã Áp Dụng</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3 h-3" />
                                <span>Áp Dụng Ngay</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Suggested Action Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex flex-wrap gap-1">
                        {msg.suggestedActions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="text-[10px] px-2 py-1 bg-slate-900/60 hover:bg-indigo-900/60 hover:text-indigo-200 text-slate-300 rounded border border-slate-700/70 transition flex items-center gap-1"
                          >
                            <span>{sug}</span>
                            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                </div>
                <div className="bg-slate-800/90 text-slate-300 border border-slate-700/60 rounded-2xl rounded-tl-xs px-3.5 py-2 flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>AI đang phân tích và thiết kế theo yêu cầu...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/90 shrink-0 space-y-2">
            {/* Quick Helper for active element */}
            {currentElement && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[10px] text-indigo-400 font-medium shrink-0">Sửa nhanh:</span>
                <button
                  onClick={() =>
                    handleSendMessage(
                      `Viết lại nội dung phần tử "${currentElement.content || currentElement.type}" cho hấp dẫn hơn`
                    )
                  }
                  className="text-[10px] px-1.5 py-0.5 bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 rounded border border-indigo-800/50 whitespace-nowrap"
                >
                  ✍️ Viết lại chữ
                </button>
                <button
                  onClick={() => handleSendMessage(`Đổi màu sắc phần tử này sang gradient nổi bật`)}
                  className="text-[10px] px-1.5 py-0.5 bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 rounded border border-indigo-800/50 whitespace-nowrap"
                >
                  🎨 Đổi gradient
                </button>
                <button
                  onClick={() => handleSendMessage(`Tăng cỡ chữ và độ đậm của phần tử này`)}
                  className="text-[10px] px-1.5 py-0.5 bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 rounded border border-indigo-800/50 whitespace-nowrap"
                >
                  🔤 Phóng to chữ
                </button>
              </div>
            )}

            <div className="relative flex items-center">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  currentElement
                    ? `Yêu cầu AI sửa phần tử "${currentElement.type}" hoặc trang web...`
                    : 'Nhập yêu cầu thiết kế (vd: "Thêm section bảng giá", "Đổi theme sang tím neon")...'
                }
                rows={2}
                className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 pr-10 text-xs text-white placeholder-slate-500 resize-none outline-none transition"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition shadow-sm"
                title="Gửi yêu cầu (Enter)"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Nhấn <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-400">Enter</kbd> gửi</span>
              <span>Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: INSPECTOR & STYLES ================= */}
      {activeTab === 'inspector' && (
        <div className="flex flex-col flex-1 overflow-hidden select-none">
          {!hasSelection ? (
            <div className="flex-1 p-6 text-center flex flex-col items-center justify-center text-slate-500 text-xs">
              <Sliders className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
              <p className="font-semibold text-slate-300">Chưa chọn phần tử nào</p>
              <p className="text-[11px] mt-1 text-slate-500 max-w-[200px]">
                Nhấp vào bất kỳ khối hoặc phần tử nào trên canvas để chỉnh sửa thuộc tính.
              </p>
              <button
                onClick={() => setActiveTab('ai')}
                className="mt-4 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trò chuyện với Trợ Lý AI</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Header Title & AI Shortcut */}
              <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block font-medium">Đang chỉnh sửa:</span>
                  <span className="font-bold text-white text-xs truncate block">
                    {isEditingElement ? `Phần tử: ${currentElement?.type}` : `Khối: ${currentSection?.name}`}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="px-2 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white rounded border border-indigo-700/50 text-[10px] font-semibold flex items-center gap-1 transition"
                  title="Nhờ AI hỗ trợ chỉnh sửa phần tử này"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Hỏi AI</span>
                </button>
              </div>

              {/* If Editing Section */}
              {!isEditingElement && currentSection && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                      Tên Khối (Section Name):
                    </label>
                    <input
                      type="text"
                      value={currentSection.name}
                      onChange={(e) => {
                        setProject((prev) => ({
                          ...prev,
                          sections: prev.sections.map((s) =>
                            s.id === currentSection.id ? { ...s, name: e.target.value } : s
                          ),
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                      Màu Nền Khối:
                    </label>
                    <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                      <input
                        type="color"
                        value={targetStyles.backgroundColor || '#0f172a'}
                        onChange={(e) => updateSectionStyles({ backgroundColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={targetStyles.backgroundColor || '#0f172a'}
                        onChange={(e) => updateSectionStyles({ backgroundColor: e.target.value })}
                        className="flex-1 bg-transparent text-slate-200 font-mono text-xs focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  {/* Padding Controls */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                      <span>Khoảng cách trên (Padding Top):</span>
                      <span className="font-mono text-indigo-400">{targetStyles.paddingTop ?? 60}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="160"
                      step="4"
                      value={targetStyles.paddingTop ?? 60}
                      onChange={(e) => updateSectionStyles({ paddingTop: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />

                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold pt-2">
                      <span>Khoảng cách dưới (Padding Bottom):</span>
                      <span className="font-mono text-indigo-400">{targetStyles.paddingBottom ?? 60}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="160"
                      step="4"
                      value={targetStyles.paddingBottom ?? 60}
                      onChange={(e) => updateSectionStyles({ paddingBottom: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* If Editing Element */}
              {isEditingElement && currentElement && (
                <div className="space-y-4">
                  {/* Tag / Size Selection for Headings */}
                  {currentElement.type === 'heading' && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                        Thẻ Tiêu Đề (HTML Tag):
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['h1', 'h2', 'h3', 'h4'] as const).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => updateElementProps({ tag })}
                            className={`py-1 rounded font-bold uppercase transition ${
                              currentElement.tag === tag
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Font Size Preset */}
                  {['heading', 'paragraph', 'button'].includes(currentElement.type) && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                        Cỡ Chữ (Font Size):
                      </label>
                      <select
                        value={targetStyles.fontSize || 'base'}
                        onChange={(e) => updateElementStyles({ fontSize: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="xs">Cực Nhỏ (Extra Small - 12px)</option>
                        <option value="sm">Nhỏ (Small - 14px)</option>
                        <option value="base">Chuẩn (Base - 16px)</option>
                        <option value="lg">Lớn (Large - 18px)</option>
                        <option value="xl">Rất Lớn (XL - 20px)</option>
                        <option value="2xl">Tiêu Đề Phụ (2XL - 24px)</option>
                        <option value="3xl">Tiêu Đề (3XL - 30px)</option>
                        <option value="4xl">Tiêu Đề Lớn (4XL - 36px)</option>
                        <option value="5xl">Hero Display (5XL - 48px)</option>
                      </select>
                    </div>
                  )}

                  {/* Text Alignment */}
                  {['heading', 'paragraph', 'badge', 'button'].includes(currentElement.type) && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                        Căn Lề (Alignment):
                      </label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button
                          onClick={() => updateElementStyles({ textAlign: 'left' })}
                          className={`py-1 flex items-center justify-center rounded transition ${
                            targetStyles.textAlign === 'left' || !targetStyles.textAlign
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Căn trái"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateElementStyles({ textAlign: 'center' })}
                          className={`py-1 flex items-center justify-center rounded transition ${
                            targetStyles.textAlign === 'center'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Căn giữa"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateElementStyles({ textAlign: 'right' })}
                          className={`py-1 flex items-center justify-center rounded transition ${
                            targetStyles.textAlign === 'right'
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Căn phải"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Text Color */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                      Màu Chữ (Text Color):
                    </label>
                    <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                      <input
                        type="color"
                        value={targetStyles.textColor || '#ffffff'}
                        onChange={(e) => updateElementStyles({ textColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={targetStyles.textColor || '#ffffff'}
                        onChange={(e) => updateElementStyles({ textColor: e.target.value })}
                        className="flex-1 bg-transparent text-slate-200 font-mono text-xs focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  {/* Button / Badge Background Color */}
                  {['button', 'badge'].includes(currentElement.type) && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                        Màu Nền Nút / Huy Hiệu:
                      </label>
                      <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                        <input
                          type="color"
                          value={targetStyles.backgroundColor || '#6366f1'}
                          onChange={(e) => updateElementStyles({ backgroundColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={targetStyles.backgroundColor || '#6366f1'}
                          onChange={(e) => updateElementStyles({ backgroundColor: e.target.value })}
                          className="flex-1 bg-transparent text-slate-200 font-mono text-xs focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  )}

                  {/* Button Link Target */}
                  {currentElement.type === 'button' && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        <span>Đường Dẫn Liên Kết (URL):</span>
                      </label>
                      <input
                        type="text"
                        value={currentElement.href || '#'}
                        onChange={(e) => updateElementProps({ href: e.target.value })}
                        placeholder="https:// hoặc #section-id"
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {/* Image URL & Action */}
                  {currentElement.type === 'image' && (
                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-400 block font-semibold">
                        Đường Dẫn Hình Ảnh (Image URL):
                      </label>
                      <input
                        type="text"
                        value={currentElement.src || ''}
                        onChange={(e) => updateElementProps({ src: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                      {onOpenImagePickerForSelected && (
                        <button
                          onClick={onOpenImagePickerForSelected}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition"
                        >
                          Chọn Ảnh Từ Thư Viện Unsplash
                        </button>
                      )}
                    </div>
                  )}

                  {/* Column Layout for Cards & Pricing */}
                  {['card', 'pricing-card', 'testimonial-card', 'stats-item'].includes(
                    currentElement.type
                  ) && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-semibold">
                        Số Cột Hiển Thị (Columns):
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {[1, 2, 3, 4].map((cols) => (
                          <button
                            key={cols}
                            onClick={() => updateElementStyles({ columns: cols })}
                            className={`py-1 rounded font-bold transition ${
                              (targetStyles.columns || 3) === cols
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {cols} Cột
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Margin Bottom Spacing */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                      <span>Khoảng Cách Dưới (Margin Bottom):</span>
                      <span className="font-mono text-indigo-400">
                        {targetStyles.marginBottom ?? 16}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="4"
                      value={targetStyles.marginBottom ?? 16}
                      onChange={(e) => updateElementStyles({ marginBottom: Number(e.target.value) })}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

