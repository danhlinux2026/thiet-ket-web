import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Check,
  Copy,
  Plus,
  Trash2,
  RotateCcw,
  History,
  Flag,
  Sparkles,
  Layers,
  Palette,
  ChevronRight,
  Clock,
  CheckCircle2,
  Share2,
  Globe,
  Github,
  MessageSquare,
  BookmarkPlus,
} from 'lucide-react';
import { AppVersion, WebsiteProject } from '../../types';
import {
  getStoredVersions,
  createVersionSnapshot,
  deleteVersion,
  formatVersionDate,
  getCurrentVersionId,
  setCurrentVersionId,
} from '../../services/versionService';

interface AppVersionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: WebsiteProject;
  onRestoreVersion: (version: AppVersion) => void;
  onOpenChat?: () => void;
  onOpenGitHub?: () => void;
  onOpenExport?: () => void;
}

export const AppVersionsDrawer: React.FC<AppVersionsDrawerProps> = ({
  isOpen,
  onClose,
  currentProject,
  onRestoreVersion,
  onOpenChat,
  onOpenGitHub,
  onOpenExport,
}) => {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load versions whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      let loaded = getStoredVersions();
      // If no version history exists yet, seed with initial version
      if (loaded.length === 0) {
        const initial = createVersionSnapshot(currentProject, 'Khởi tạo trang ban đầu', {
          isAutoSave: false,
          tags: ['Gốc'],
        });
        loaded = [initial];
      }
      setVersions(loaded);

      const activeId = getCurrentVersionId() || loaded[0]?.id;
      setCurrentId(activeId);
      setSelectedVersionId(activeId);
    }
  }, [isOpen, currentProject]);

  if (!isOpen) return null;

  const handleCreateSnapshot = () => {
    const title = newSnapshotName.trim() || `Bản lưu ${new Date().toLocaleTimeString('vi-VN')}`;
    const newVer = createVersionSnapshot(currentProject, title, {
      prompt: newSnapshotName.trim() || 'Lưu snapshot thủ công',
      tags: ['Thủ công'],
    });
    setVersions(getStoredVersions());
    setCurrentId(newVer.id);
    setSelectedVersionId(newVer.id);
    setNewSnapshotName('');
    setIsCreatingSnapshot(false);
  };

  const handleRestore = () => {
    if (!selectedVersionId) return;
    const target = versions.find((v) => v.id === selectedVersionId);
    if (!target) return;

    // Create a backup snapshot before restoring if target is not current
    if (target.id !== currentId) {
      createVersionSnapshot(currentProject, `Trước khi khôi phục về "${target.name}"`, {
        tags: ['Tự động'],
      });
    }

    setCurrentVersionId(target.id);
    setCurrentId(target.id);
    onRestoreVersion(target);
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteVersion(id);
    const updated = getStoredVersions();
    setVersions(updated);
    if (selectedVersionId === id) {
      setSelectedVersionId(updated[0]?.id || null);
    }
    setConfirmDeleteId(null);
  };

  const handleCopyPrompt = (version: AppVersion, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = version.prompt || version.name;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(version.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredVersions = versions.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      (v.prompt && v.prompt.toLowerCase().includes(q)) ||
      formatVersionDate(v.timestamp).toLowerCase().includes(q)
    );
  });

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const isCurrentSelected = selectedVersionId === currentId;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 select-none">
        {/* Top Navbar Pills (exact replica of Google AI Studio top pills) */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar bg-slate-950/60">
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenChat?.();
              }}
              className="px-2.5 py-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium text-[11px] flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenExport?.();
              }}
              className="px-2.5 py-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium text-[11px] flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span>Publish</span>
            </button>
            <button
              className="px-3 py-1 rounded-full bg-slate-800 text-white font-semibold text-[11px] border border-slate-700 shadow-xs flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Versions</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenGitHub?.();
              }}
              className="px-2.5 py-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium text-[11px] flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              <span>GitHub</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm ml-1"
            title="Đóng phiên bản"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Title */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>App versions</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {versions.length}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Lịch sử các phiên bản & checkpoint giao diện website
            </p>
          </div>

          <button
            onClick={() => setIsCreatingSnapshot(!isCreatingSnapshot)}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition"
            title="Lưu một mốc phiên bản mới"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Lưu Snapshot</span>
          </button>
        </div>

        {/* Snapshot Creation Form (if toggled) */}
        {isCreatingSnapshot && (
          <div className="mx-5 mb-3 p-3 bg-indigo-950/40 border border-indigo-700/60 rounded-xl space-y-2.5 animate-in fade-in duration-150">
            <span className="text-[11px] font-bold text-indigo-300 block">
              Tạo mốc phiên bản checkpoint mới:
            </span>
            <input
              type="text"
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              placeholder="Nhập tên hoặc ghi chú phiên bản (vd: Trước khi đổi màu...)"
              className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSnapshot();
                if (e.key === 'Escape') setIsCreatingSnapshot(false);
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingSnapshot(false)}
                className="px-2.5 py-1 text-slate-400 hover:text-white text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateSnapshot}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
              >
                Xác Nhận Lưu
              </button>
            </div>
          </div>
        )}

        {/* Search Input (matching Google AI Studio search bar) */}
        <div className="px-5 mb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your prompt / version"
              className="w-full pl-9 pr-8 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto px-5 space-y-2 text-xs">
          {filteredVersions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">Không tìm thấy phiên bản phù hợp</p>
            </div>
          ) : (
            filteredVersions.map((version) => {
              const isSelected = selectedVersionId === version.id;
              const isCurrent = version.id === currentId;

              return (
                <div
                  key={version.id}
                  onClick={() => setSelectedVersionId(version.id)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer relative flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 ring-1 ring-indigo-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  {/* Radio Indicator (matching Google AI Studio radio circle) */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-600 text-white'
                          : 'border-slate-600 group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Version Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-white text-xs truncate max-w-[200px]" title={version.name}>
                        {version.name}
                      </span>

                      {/* Green Current Pill Badge */}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{formatVersionDate(version.timestamp)}</span>
                      <span className="text-slate-600">•</span>
                      <span>{version.projectSnapshot?.sections?.length || 0} sections</span>
                    </div>

                    {/* Preview summary snippet if selected */}
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center gap-2">
                        <span className="text-indigo-400 font-medium">Theme: {version.projectSnapshot?.theme?.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions: Copy & Delete */}
                  <div className="absolute right-2.5 top-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleCopyPrompt(version, e)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition"
                      title="Sao chép Prompt / Tên phiên bản"
                    >
                      {copiedId === version.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Delete version (only if not current and more than 1 version exists) */}
                    {!isCurrent && versions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(version.id, e)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition"
                        title="Xóa phiên bản này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Restore Version Button (exact replica of Google AI Studio restore footer) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
          <button
            onClick={handleRestore}
            disabled={!selectedVersion || isCurrentSelected}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
              isCurrentSelected
                ? 'bg-slate-800/80 text-slate-400 cursor-not-allowed border border-slate-700/60'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer active:scale-98'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>{isCurrentSelected ? 'Phiên bản hiện tại (Đang mở)' : 'Restore version'}</span>
          </button>

          {!isCurrentSelected && selectedVersion && (
            <p className="text-[10px] text-center text-slate-400">
              Nhấn để khôi phục toàn bộ giao diện, nội dung và chủ đề về mốc{' '}
              <strong className="text-indigo-300">"{selectedVersion.name}"</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
