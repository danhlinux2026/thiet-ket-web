import React, { useState, useMemo } from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { DeviceMode, WebsiteProject } from '../../types';
import { generateStandaloneHtml } from '../../utils/exportHtml';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WebsiteProject;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, project }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const previewHtml = useMemo(() => {
    return generateStandaloneHtml(project);
  }, [project, refreshKey]);

  if (!isOpen) return null;

  const handleOpenInNewTab = () => {
    try {
      const blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        alert('Vui lòng mở quyền cho phép pop-up trên trình duyệt để mở trang trong tab mới.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chế Độ Xem Trước Trực Quan</span>
          </span>
          <span className="text-xs text-slate-400 hidden md:inline truncate max-w-xs">
            | {project.name || 'Website của bạn'}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition ${
              deviceMode === 'desktop'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition ${
              deviceMode === 'tablet'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition ${
              deviceMode === 'mobile'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition border border-slate-700"
            title="Tải lại bản xem trước"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            title="Mở toàn màn hình trong tab mới"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mở Tab Mới</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <X className="w-4 h-4" />
            <span>Đóng</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto bg-slate-950 flex justify-center items-center p-0 md:p-4">
        {deviceMode === 'desktop' ? (
          <div className="w-full h-full bg-white shadow-2xl overflow-hidden flex flex-col">
            <iframe
              key={`preview-desktop-${refreshKey}`}
              title="Desktop Preview"
              srcDoc={previewHtml}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : deviceMode === 'tablet' ? (
          <div className="w-[768px] h-[92vh] max-h-[1024px] bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col my-auto transition-all">
            {/* Mock Tablet Top Bar */}
            <div className="h-4 bg-slate-800 flex items-center justify-center shrink-0">
              <div className="w-12 h-1 bg-slate-600 rounded-full" />
            </div>
            <iframe
              key={`preview-tablet-${refreshKey}`}
              title="Tablet Preview"
              srcDoc={previewHtml}
              className="w-full flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <div className="w-[375px] h-[88vh] max-h-[812px] bg-white rounded-[36px] shadow-2xl overflow-hidden border-[10px] border-slate-800 flex flex-col my-auto transition-all">
            {/* Mock Mobile Notch */}
            <div className="h-6 bg-slate-800 flex items-center justify-center shrink-0">
              <div className="w-20 h-3 bg-slate-950 rounded-b-xl" />
            </div>
            <iframe
              key={`preview-mobile-${refreshKey}`}
              title="Mobile Preview"
              srcDoc={previewHtml}
              className="w-full flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
            {/* Home Indicator */}
            <div className="h-4 bg-white flex items-center justify-center shrink-0">
              <div className="w-24 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
