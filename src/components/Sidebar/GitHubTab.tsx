import React, { useState } from 'react';
import {
  Github,
  Search,
  ExternalLink,
  Sparkles,
  FolderOpen,
  ArrowRight,
  UploadCloud,
  FileCode,
  Image as ImageIcon,
  Check,
  Plus,
} from 'lucide-react';
import { POPULAR_GITHUB_REPOSITORIES } from '../../services/githubService';

interface GitHubTabProps {
  onOpenFullGitHubPicker: () => void;
  onQuickLoadRepo: (repoFullName: string) => void;
}

export const GitHubTab: React.FC<GitHubTabProps> = ({
  onOpenFullGitHubPicker,
  onQuickLoadRepo,
}) => {
  const [quickRepoInput, setQuickRepoInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRepoInput.trim()) {
      onQuickLoadRepo(quickRepoInput.trim());
      onOpenFullGitHubPicker();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
      {/* Intro Card */}
      <div className="p-3.5 bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Github className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs">Tích Hợp GitHub Trực Tiếp</h4>
            <span className="text-[10px] text-indigo-300">Duyệt & chọn file từ kho lưu trữ</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Kết nối tới bất kỳ repository công khai hoặc riêng tư trên GitHub để chọn ảnh, nhập mã HTML, JSON và đẩy dự án.
        </p>

        <button
          onClick={onOpenFullGitHubPicker}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-600/30"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Mở Trình Duyệt File GitHub</span>
        </button>
      </div>

      {/* Quick Load Repo Form */}
      <form onSubmit={handleQuickSubmit} className="space-y-2">
        <label className="block text-slate-300 font-semibold text-[11px]">
          Nhập Tên Repo GitHub:
        </label>
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="owner/repo (VD: facebook/react)"
            value={quickRepoInput}
            onChange={(e) => setQuickRepoInput(e.target.value)}
            className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Popular Presets */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Repo Gợi Ý
          </span>
        </div>

        <div className="space-y-2">
          {POPULAR_GITHUB_REPOSITORIES.map((preset) => (
            <div
              key={`${preset.owner}/${preset.repo}`}
              onClick={() => {
                onQuickLoadRepo(`${preset.owner}/${preset.repo}`);
                onOpenFullGitHubPicker();
              }}
              className="p-2.5 bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white group-hover:text-indigo-400 text-xs truncate">
                  {preset.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {preset.category}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate mb-1">
                {preset.owner}/{preset.repo}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
