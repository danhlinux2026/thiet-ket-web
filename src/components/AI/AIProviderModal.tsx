import React, { useState } from 'react';
import {
  Sparkles,
  Settings2,
  Cpu,
  Server,
  Key,
  Globe,
  Sliders,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Zap,
  ShieldCheck,
  RotateCcw,
  X,
  Radio,
} from 'lucide-react';
import { AIProviderConfig, LLMProviderType } from '../../types';
import {
  PRESET_PROVIDERS,
  DEFAULT_PROVIDER_CONFIG,
  testLLMConnection,
  saveStoredProviderConfig,
} from '../../services/aiService';

interface AIProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIProviderConfig;
  onSaveConfig: (newConfig: AIProviderConfig) => void;
}

export const AIProviderModal: React.FC<AIProviderModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<AIProviderConfig>({ ...config });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
    sampleResponse?: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentPreset =
    PRESET_PROVIDERS.find((p) => p.provider === formData.provider) || PRESET_PROVIDERS[0];

  const handleSelectProvider = (providerType: LLMProviderType) => {
    const preset = PRESET_PROVIDERS.find((p) => p.provider === providerType) || PRESET_PROVIDERS[0];
    setFormData((prev) => ({
      ...prev,
      provider: providerType,
      name: preset.title,
      baseUrl: preset.defaultBaseUrl,
      model: preset.defaultModel,
      temperature: preset.defaultTemp,
      apiKey: prev.provider === providerType ? prev.apiKey : '',
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testLLMConnection(formData);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Lỗi kết nối',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveStoredProviderConfig(formData);
    onSaveConfig(formData);
    onClose();
  };

  const handleResetDefault = () => {
    setFormData({ ...DEFAULT_PROVIDER_CONFIG });
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Cấu Hình Mô Hình AI (Custom LLM)</span>
                <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700/60 rounded text-[10px] font-semibold uppercase">
                  Co-Pilot Pro
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Lựa chọn mô hình Gemini mặc định hoặc kết nối Custom LLM (DeepSeek, OpenRouter, Ollama, OpenAI...)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Provider Grid Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-2 uppercase tracking-wider">
              1. Chọn Nhà Cung Cấp / Nền Tảng AI (Provider):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_PROVIDERS.map((preset) => {
                const isSelected = formData.provider === preset.provider;
                return (
                  <button
                    key={preset.provider}
                    type="button"
                    onClick={() => handleSelectProvider(preset.provider)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-950/90 to-purple-950/80 border-indigo-500 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="font-bold text-white text-xs block group-hover:text-indigo-300 transition">
                        {preset.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold tracking-tight ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connection Parameters Form */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. Thông Số Kết Nối ({currentPreset.title})</span>
              </span>
              {currentPreset.apiKeyHelpUrl && (
                <a
                  href={currentPreset.apiKeyHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                >
                  <span>Lấy API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Base URL (for custom/openai/deepseek/openrouter/ollama) */}
            {formData.provider !== 'gemini' && (
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                  API Base URL Endpoint:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    placeholder="https://api.openai.com/v1 hoặc https://api.groq.com/openai/v1 hoặc http://localhost:11434/v1"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  {formData.baseUrl !== currentPreset.defaultBaseUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, baseUrl: currentPreset.defaultBaseUrl })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 hover:text-white underline cursor-pointer"
                    >
                      Mặc định
                    </button>
                  )}
                </div>
                
                {/* Localhost Warning / Cloud Info */}
                {(formData.baseUrl.includes('localhost') || formData.baseUrl.includes('127.0.0.1')) && (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-200 text-[11px] leading-relaxed">
                    <p className="font-semibold flex items-center gap-1.5 mb-1 text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Lưu ý khi kết nối Localhost trên máy tính cá nhân:
                    </p>
                    <p className="text-amber-200/90 text-[10px]">
                      WebStudio đang chạy trên máy chủ Cloud. Để ứng dụng kết nối được vào mô hình local (như Kiro, Ollama, LM Studio) trên máy của bạn:
                    </p>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10px] text-amber-200/80">
                      <li>Cách 1: Chạy lệnh <code>ngrok http 20128</code> (hoặc cổng local của bạn) rồi dán URL <code>https://...ngrok-free.app/v1</code> vào ô Base URL ở trên.</li>
                      <li>Cách 2: Hoặc dùng <strong className="text-amber-300">Groq Cloud API</strong> (miễn phí, siêu nhanh): Base URL <code>https://api.groq.com/openai/v1</code>, Model <code>llama-3.3-70b-versatile</code>.</li>
                    </ul>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 mt-1 block">
                  {formData.provider === 'ollama'
                    ? 'Nếu chạy Ollama trên máy: mở terminal chạy "ollama run qwen2.5-coder:7b" và giữ Ollama hoạt động.'
                    : 'Endpoint phải tuân thủ chuẩn OpenAI /v1/chat/completions.'}
                </span>
              </div>
            )}

            {/* API Key / Secret Token (Always visible for OpenAI, DeepSeek, OpenRouter, Custom, and Ollama) */}
            {formData.provider !== 'gemini' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>API Key / Secret Token:</span>
                    {(formData.provider === 'custom' || formData.provider === 'ollama') && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Tùy chọn nếu chạy local, bắt buộc nếu dùng Cloud API)
                      </span>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showApiKey ? 'Ẩn Key' : 'Hiện Key'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder={
                      formData.provider === 'deepseek'
                        ? 'sk-...'
                        : formData.provider === 'openrouter'
                        ? 'sk-or-v1-...'
                        : formData.provider === 'custom'
                        ? 'gsk_... (Groq) hoặc sk-... (vLLM/OpenAI) hoặc để trống nếu chạy local'
                        : formData.provider === 'ollama'
                        ? 'Để trống nếu không cấu hình mật khẩu/proxy'
                        : 'sk-...'
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  API Key được lưu an toàn trên trình duyệt của bạn (localStorage) và bảo mật tuyệt đối.
                </span>
              </div>
            )}

            {/* Gemini Custom Key Override (Optional) */}
            {formData.provider === 'gemini' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Gemini API Key Cá Nhân (Tùy chọn):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showApiKey ? 'Ẩn Key' : 'Hiện Key'}
                  </button>
                </div>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Để trống sẽ tự động dùng Gemini API Key hệ thống của WebStudio (Đã kích hoạt sẵn)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Mặc định hệ thống đã có sẵn Gemini AI. Bạn có thể nhập key riêng từ Google AI Studio nếu muốn dùng quota cá nhân.
                </span>
              </div>
            )}

            {/* Model Name & Presets */}
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                Tên Model (Model ID):
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Nhập tên model..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none mb-2"
              />

              {/* Recommended Model Pills */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-slate-400 font-medium mr-1">Gợi ý nhanh:</span>
                {currentPreset.recommendedModels.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, model: m.id })}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                      formData.model === m.id
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {m.id} <span className="opacity-70 text-[9px]">({m.tag})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-1">
                <span>Độ sáng tạo (Temperature):</span>
                <span className="font-mono text-indigo-400">{formData.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                <span>Chính xác & Logic (0.2)</span>
                <span>Cân bằng (0.7)</span>
                <span>Sáng tạo đột phá (1.0)</span>
              </div>
            </div>
          </div>

          {/* Test Connection Result Box */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 animate-in fade-in duration-150 ${
                testResult.success
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-700/60 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-[11px]">
                <div className="flex items-center justify-between font-bold">
                  <span>{testResult.success ? 'Kết nối thành công!' : 'Kết nối thất bại!'}</span>
                  {testResult.latencyMs !== undefined && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40">
                      {testResult.latencyMs}ms
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-slate-300">{testResult.message || testResult.error}</p>
                {testResult.sampleResponse && (
                  <div className="mt-1.5 p-1.5 rounded bg-black/30 text-[10px] font-mono text-slate-300 truncate">
                    Phản hồi mẫu: "{testResult.sampleResponse}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              {isTesting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefault}
              className="px-2.5 py-1.5 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 hover:bg-slate-800/60 rounded-lg transition"
              title="Đặt lại Google Gemini mặc định"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục mặc định</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-slate-800 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu & Áp Dụng Mô Hình</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
