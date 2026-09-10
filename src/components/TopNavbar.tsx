import React, { useState } from 'react';
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
} from 'lucide-react';
import { DeviceMode, WebsiteProject } from '../types';

interface TopNavbarProps {
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenTemplates: () => void;
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
  onOpenTemplates,
  onOpenTheme,
  onOpenExport,
  onOpenPreview,
  onOpenGitHub,
  onClearCanvas,
  isSaved,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      setProject((prev) => ({ ...prev, name: titleInput.trim() }));
    } else {
      setTitleInput(project.name);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-30 relative shrink-0">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white hidden sm:inline">
            Web<span className="text-indigo-400">Studio</span>
          </span>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden md:block" />

        {/* Project Name editable */}
        <div className="relative group flex items-center">
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
              className="px-2 py-0.5 text-sm font-medium bg-slate-800 border border-indigo-500 rounded text-white focus:outline-none max-w-[180px] sm:max-w-xs"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(project.name);
                setIsEditingTitle(true);
              }}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1.5 max-w-[180px] sm:max-w-xs truncate"
              title="Nhấp để đổi tên dự án"
            >
              <span className="truncate">{project.name}</span>
              <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition">✎</span>
            </button>
          )}

          {/* Save Status Pill */}
          <span
            className={`ml-2 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium transition ${
              isSaved
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-2.5 h-2.5" /> Đã lưu
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Đang lưu...
              </>
            )}
          </span>
        </div>
      </div>

      {/* Middle: Device Viewport Switcher & Undo/Redo */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded text-slate-300 transition ${
              canUndo ? 'hover:bg-slate-700 hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded text-slate-300 transition ${
              canRedo ? 'hover:bg-slate-700 hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Làm lại (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Modes */}
        <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg p-0.5">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
              deviceMode === 'desktop'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Màn hình Máy tính (Desktop 100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
              deviceMode === 'tablet'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Máy tính bảng (Tablet 768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition ${
              deviceMode === 'mobile'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Điện thoại (Mobile 375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Template Gallery Button */}
        <button
          onClick={onOpenTemplates}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Kho Mẫu Giao Diện</span>
          <span className="lg:hidden">Mẫu</span>
        </button>

        {/* GitHub Direct Connection & File Picker Button */}
        <button
          onClick={onOpenGitHub}
          className="px-3 py-1.5 bg-gradient-to-r from-indigo-900/60 to-slate-800 hover:from-indigo-800/80 hover:to-slate-700 text-indigo-200 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          title="Kết nối trực tiếp GitHub để chọn file ảnh, mã HTML, JSON và đẩy dự án"
        >
          <Github className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">GitHub File</span>
        </button>

        {/* Theme Settings Button */}
        <button
          onClick={onOpenTheme}
          className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          title="Tùy chỉnh Bảng màu & Font chữ"
        >
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden xl:inline">Chủ Đề & Màu</span>
        </button>

        {/* Code / Export Button */}
        <button
          onClick={onOpenExport}
          className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          title="Xuất mã nguồn HTML/Tailwind & JSON"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Xuất Mã HTML</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={onOpenPreview}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Xem Trước</span>
        </button>
      </div>
    </header>
  );
};
