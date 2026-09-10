import React, { useMemo } from 'react';
import { Settings, Globe, FileCode, Check, Search, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { WebsiteProject, SEOSettings } from '../../types';
import { auditProjectSEO, autoOptimizeProjectSEO } from '../../services/seoService';

interface SettingsTabProps {
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  onOpenSEOModal?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  project,
  setProject,
  onOpenSEOModal,
}) => {
  const { settings } = project;
  const auditReport = useMemo(() => auditProjectSEO(project), [project]);

  const updateSetting = <K extends keyof SEOSettings>(key: K, value: SEOSettings[K]) => {
    setProject((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
      lastModified: Date.now(),
    }));
  };

  const handleQuickOptimize = () => {
    const optimized = autoOptimizeProjectSEO(project);
    setProject(optimized);
  };

  const titleLen = (settings.title || project.name || '').length;
  const descLen = (settings.metaDescription || project.description || '').length;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 space-y-4">
      {/* SEO Banner & Score Card */}
      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Search className="w-3.5 h-3.5" />
            <span>TỐI ƯU GOOGLE & SEO</span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/50 text-emerald-300">
            {auditReport.score}/100 ({auditReport.grade})
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          {auditReport.passedCount} tiêu chuẩn đạt chuẩn Google.
        </p>

        <div className="flex items-center gap-2 pt-1">
          {onOpenSEOModal && (
            <button
              onClick={onOpenSEOModal}
              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mở Bộ Tối Ưu SEO</span>
            </button>
          )}

          <button
            onClick={handleQuickOptimize}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition"
            title="Tự động tối ưu tiêu đề, mô tả và gắn thẻ alt hình ảnh"
          >
            <Zap className="w-3 h-3 text-amber-400 inline mr-1" />
            <span>Tối ưu AI</span>
          </button>
        </div>
      </div>

      {/* Basic Settings */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>THẺ TIÊU ĐỀ & MÔ TẢ</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-400 font-medium">
                Tiêu Đề Trang (Meta Title):
              </label>
              <span
                className={`text-[10px] font-mono ${
                  titleLen >= 40 && titleLen <= 65 ? 'text-emerald-400 font-bold' : 'text-slate-500'
                }`}
              >
                {titleLen}/65
              </span>
            </div>
            <input
              type="text"
              value={settings.title || project.name}
              onChange={(e) => updateSetting('title', e.target.value)}
              placeholder="VD: NexusAI - Nền tảng AI Thông minh"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-slate-400 font-medium">
                Mô Tả Trang (Meta Description):
              </label>
              <span
                className={`text-[10px] font-mono ${
                  descLen >= 120 && descLen <= 165 ? 'text-emerald-400 font-bold' : 'text-slate-500'
                }`}
              >
                {descLen}/160
              </span>
            </div>
            <textarea
              rows={3}
              value={settings.metaDescription || project.description}
              onChange={(e) => updateSetting('metaDescription', e.target.value)}
              placeholder="Mô tả tóm tắt nội dung trang web khi hiển thị trên Google & mạng xã hội..."
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Từ Khóa Mục Tiêu (Keywords):
            </label>
            <input
              type="text"
              value={settings.keywords || ''}
              onChange={(e) => updateSetting('keywords', e.target.value)}
              placeholder="VD: thiet ke web, webstudio, tao landing page"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              URL Chính Thức (Canonical URL):
            </label>
            <input
              type="url"
              value={settings.canonicalUrl || ''}
              onChange={(e) => updateSetting('canonicalUrl', e.target.value)}
              placeholder="https://mywebsite.com"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>TÙY BIẾN CSS RIÊNG (CUSTOM CSS)</span>
        </div>

        <textarea
          rows={5}
          value={settings.customCss || ''}
          onChange={(e) => updateSetting('customCss', e.target.value)}
          placeholder="/* Nhập mã CSS tùy chỉnh của bạn vào đây */&#10;.my-custom-class {&#10;  border-radius: 9999px;&#10;}"
          className="w-full px-2.5 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-indigo-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};
