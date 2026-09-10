import React, { useState, useMemo } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Sparkles,
  Palette,
  Code2,
  Eye,
  Download,
  Trash2,
  Check,
  FolderOpen,
  Layers,
  Save,
  Github,
  Search,
  Zap,
} from 'lucide-react';
import { DeviceMode, WebsiteProject } from '../types';
import { auditProjectSEO } from '../services/seoService';

interface TopNavbarProps {
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenFileModal: () => void;
  onOpenTemplates: () => void;
  onOpenVersions: () => void;
  onOpenSEO: () => void;
  onOpenTheme: () => void;
  onOpenExport: () => void;
  onOpenPreview: () => void;
  onOpenGitHub: () => void;
  onClearCanvas: () => void;
  isSaved: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  project,
  setProject,
  deviceMode,
  setDeviceMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenFileModal,
  onOpenTemplates,
  onOpenVersions,
  onOpenSEO,
  onOpenTheme,
  onOpenExport,
  onOpenPreview,
  onOpenGitHub,
  onClearCanvas,
  isSaved,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);

  const seoReport = useMemo(() => auditProjectSEO(project), [project]);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      setProject((prev) => ({ ...prev, name: titleInput.trim() }));
    } else {
      setTitleInput(project.name);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row md:h-14 items-stretch md:items-center justify-between select-none z-30 relative shrink-0">
      {/* Top Main Bar: Brand, Project Name, Viewport Switcher & Primary Action */}
      <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-2 border-b md:border-b-0 border-slate-800/80 w-full md:w-auto">
        {/* Brand & Project Name */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden xs:inline">
              Web<span className="text-indigo-400">Studio</span>
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-0.5 hidden sm:block" />

          {/* Project Name editable */}
          <div className="relative group flex items-center max-w-[130px] xs:max-w-[170px] sm:max-w-xs">
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleInput(project.name);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="px-2 py-0.5 text-xs sm:text-sm font-medium bg-slate-800 border border-indigo-500 rounded text-white focus:outline-none w-full"
              />
            ) : (
              <button
                onClick={() => {
                  setTitleInput(project.name);
                  setIsEditingTitle(true);
                }}
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-1.5 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 truncate"
                title="Nhấp để đổi tên dự án"
              >
                <span className="truncate">{project.name}</span>
                <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition hidden sm:inline">✎</span>
              </button>
            )}

            {/* Save Status Pill */}
            <span
              className={`ml-1 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-1 font-medium transition shrink-0 ${
                isSaved
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-2.5 h-2.5" /> <span className="hidden xs:inline">Đã lưu</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> <span className="hidden xs:inline">Đang lưu...</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Viewport Switcher & Undo/Redo */}
        <div className="flex items-center gap-1">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg p-0.5">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1 sm:p-1.5 rounded text-slate-300 transition ${
                canUndo ? 'hover:bg-slate-700 hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1 sm:p-1.5 rounded text-slate-300 transition ${
                canRedo ? 'hover:bg-slate-700 hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'
              }`}
              title="Làm lại (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Viewport Modes */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg p-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1 sm:p-1.5 rounded text-xs flex items-center gap-1 transition ${
                deviceMode === 'desktop'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Máy tính (Desktop 100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Desktop</span>
            </button>

            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1 sm:p-1.5 rounded text-xs flex items-center gap-1 transition ${
                deviceMode === 'tablet'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Máy tính bảng (Tablet 768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Tablet</span>
            </button>

            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1 sm:p-1.5 rounded text-xs flex items-center gap-1 transition ${
                deviceMode === 'mobile'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Điện thoại (Mobile 375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Mobile</span>
            </button>
          </div>

          {/* Preview Button (Primary Mobile Action) */}
          <button
            onClick={onOpenPreview}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-md shadow-indigo-600/30 cursor-pointer shrink-0 ml-1"
            title="Xem Trước Giao Diện Màn Hình Đầy Đủ"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Xem Trước</span>
          </button>
        </div>
      </div>

      {/* Secondary Tools Bar (Horizontally Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 md:py-0 overflow-x-auto scrollbar-none bg-slate-900/90 md:bg-transparent border-t md:border-t-0 border-slate-800/60 shrink-0">
        {/* Mở & Thêm File Button */}
        <button
          onClick={onOpenFileModal}
          className="px-2 py-1 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800/80 hover:to-indigo-800/80 text-blue-200 hover:text-white border border-blue-500/40 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          title="Mở hoặc Thêm file HTML, JSON dự án"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Mở / Thêm File</span>
        </button>

        {/* Template Gallery Button */}
        <button
          onClick={onOpenTemplates}
          className="px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Kho Mẫu</span>
        </button>

        {/* SEO Google Optimization Suite Button */}
        <button
          onClick={onOpenSEO}
          className="px-2 py-1 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900/90 hover:to-teal-900/90 text-emerald-300 hover:text-emerald-200 border border-emerald-600/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm whitespace-nowrap shrink-0"
          title="Tối ưu SEO Google, Schema JSON-LD"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>SEO</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1 rounded-full border border-emerald-500/30">
            {seoReport.score}
          </span>
        </button>

        {/* Versions Button */}
        <button
          onClick={onOpenVersions}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 rounded-lg text-xs font-semibold flex items-center gap-1 transition whitespace-nowrap shrink-0"
          title="Lịch sử phiên bản"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Versions</span>
        </button>

        {/* GitHub Button */}
        <button
          onClick={onOpenGitHub}
          className="px-2 py-1 bg-gradient-to-r from-indigo-900/60 to-slate-800 hover:from-indigo-800/80 hover:to-slate-700 text-indigo-200 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm whitespace-nowrap shrink-0"
          title="Kết nối trực tiếp GitHub"
        >
          <Github className="w-3.5 h-3.5 text-indigo-400" />
          <span>GitHub</span>
        </button>

        {/* Theme Settings Button */}
        <button
          onClick={onOpenTheme}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition whitespace-nowrap shrink-0"
          title="Bảng màu & Font chữ"
        >
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          <span>Màu & Font</span>
        </button>

        {/* Code / Export Button */}
        <button
          onClick={onOpenExport}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition whitespace-nowrap shrink-0"
          title="Xuất mã nguồn HTML/Tailwind & JSON"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Xuất Mã</span>
        </button>
      </div>
    </header>
  );
};
