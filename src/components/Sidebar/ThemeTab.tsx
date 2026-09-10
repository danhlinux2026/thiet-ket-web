import React from 'react';
import { Palette, Type, Square, Sparkles, Check } from 'lucide-react';
import { WebsiteTheme } from '../../types';
import { THEME_PRESETS } from '../../data/themes';

interface ThemeTabProps {
  currentTheme: WebsiteTheme;
  onUpdateTheme: (theme: WebsiteTheme) => void;
}

export const ThemeTab: React.FC<ThemeTabProps> = ({ currentTheme, onUpdateTheme }) => {
  const fontFamilies = [
    { name: 'Outfit', category: 'Hiện đại, Công nghệ (Heading)' },
    { name: 'Plus Jakarta Sans', category: 'Sạch sẽ, Tinh tế (SaaS)' },
    { name: 'Playfair Display', category: 'Sang trọng, Cổ điển (Editorial)' },
    { name: 'Inter', category: 'Chuẩn công nghệ, Dễ đọc' },
  ];

  const radiusOptions = [
    { label: 'Vuông vức (0px)', value: '0rem' },
    { label: 'Góc nhẹ (4px)', value: '0.25rem' },
    { label: 'Vừa vặn (8px)', value: '0.5rem' },
    { label: 'Tròn hiện đại (12px)', value: '0.75rem' },
    { label: 'Bo tròn lớn (20px)', value: '1.25rem' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 space-y-4">
      {/* Preset Themes */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>BỘ MÀU CHỦ ĐỀ SẴN CÓ</span>
        </div>

        <div className="space-y-2">
          {THEME_PRESETS.map((preset) => {
            const isActive = currentTheme.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onUpdateTheme({ ...preset })}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-sm'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{preset.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {preset.fontHeading} + {preset.fontBody}
                  </div>
                </div>

                {/* Color preview dots */}
                <div className="flex items-center gap-1">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                    style={{ backgroundColor: preset.primaryColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                    style={{ backgroundColor: preset.backgroundColor }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography Customization */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-400" />
          <span>FONT CHỮ TIÊU ĐỀ & NỘI DUNG</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Font Tiêu đề (Headings):</label>
            <select
              value={currentTheme.fontHeading}
              onChange={(e) => onUpdateTheme({ ...currentTheme, fontHeading: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              {fontFamilies.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name} - {f.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Font Đoạn văn (Body text):</label>
            <select
              value={currentTheme.fontBody}
              onChange={(e) => onUpdateTheme({ ...currentTheme, fontBody: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              {fontFamilies.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name} - {f.category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Primary & Accent Color Pickers */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-2">TÙY CHỈNH MÀU SẮC</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Màu Chủ Đạo (Primary)</label>
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <input
                type="color"
                value={currentTheme.primaryColor}
                onChange={(e) => onUpdateTheme({ ...currentTheme, primaryColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-[11px] font-mono text-slate-300 uppercase">
                {currentTheme.primaryColor}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Màu Điểm Nhấn (Accent)</label>
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <input
                type="color"
                value={currentTheme.accentColor}
                onChange={(e) => onUpdateTheme({ ...currentTheme, accentColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-[11px] font-mono text-slate-300 uppercase">
                {currentTheme.accentColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Border Radius Style */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Square className="w-3.5 h-3.5 text-indigo-400" />
          <span>BO GÓC NÚT & THẺ (BORDER RADIUS)</span>
        </div>

        <div className="space-y-1">
          {radiusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdateTheme({ ...currentTheme, radius: opt.value })}
              className={`w-full py-1.5 px-2 text-xs rounded-lg text-left transition flex items-center justify-between ${
                currentTheme.radius === opt.value
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{opt.label}</span>
              {currentTheme.radius === opt.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
