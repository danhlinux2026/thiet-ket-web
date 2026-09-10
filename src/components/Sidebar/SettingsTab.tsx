import React from 'react';
import { Settings, Globe, FileCode, Check } from 'lucide-react';
import { WebsiteProject } from '../../types';

interface SettingsTabProps {
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ project, setProject }) => {
  const { settings } = project;

  const updateSetting = (key: keyof typeof settings, value: string) => {
    setProject((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 space-y-4">
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>CẤU HÌNH TRANG & SEO</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Tiêu Đề Trang (Page Title):
            </label>
            <input
              type="text"
              value={settings.title || project.name}
              onChange={(e) => updateSetting('title', e.target.value)}
              placeholder="VD: NexusAI - Nền tảng AI Thông minh"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Mô Tả Trang (Meta Description):
            </label>
            <textarea
              rows={3}
              value={settings.metaDescription || project.description}
              onChange={(e) => updateSetting('metaDescription', e.target.value)}
              placeholder="Mô tả tóm tắt nội dung trang web khi hiển thị trên Google & mạng xã hội..."
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>TÙY BIẾN CSS RIÊNG (CUSTOM CSS)</span>
        </div>

        <textarea
          rows={6}
          value={settings.customCss || ''}
          onChange={(e) => updateSetting('customCss', e.target.value)}
          placeholder="/* Nhập mã CSS tùy chỉnh của bạn vào đây */&#10;.my-custom-class {&#10;  border-radius: 9999px;&#10;}"
          className="w-full px-2.5 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-indigo-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};
