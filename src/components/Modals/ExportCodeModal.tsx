import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Upload,
  FileText,
  X,
  Sparkles,
  Github,
} from 'lucide-react';
import { WebsiteProject } from '../../types';
import { generateStandaloneHtml } from '../../utils/exportHtml';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  onOpenGitHub?: () => void;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({
  isOpen,
  onClose,
  project,
  setProject,
  onOpenGitHub,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'json'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlCode = generateStandaloneHtml(project);
  const jsonCode = JSON.stringify(project, null, 2);

  const currentCode = activeTab === 'html' ? htmlCode : jsonCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/\s+/g, '-') || 'website'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonCode], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/\s+/g, '-') || 'project'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.sections && imported.theme) {
          setProject(imported);
          alert('Đã nhập dữ liệu dự án thành công!');
          onClose();
        } else {
          alert('Tệp JSON không đúng định dạng dự án WebStudio.');
        }
      } catch (err) {
        alert('Lỗi đọc tệp JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Xuất Mã Nguồn Website
              </h2>
              <p className="text-xs text-slate-400">
                Tải về tệp HTML standalone hoàn chỉnh hoặc sao lưu dữ liệu dự án.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Tabs */}
        <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>HTML5 + Tailwind CSS (Sẵn sàng chạy)</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Dữ Liệu Dự Án (JSON Project)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
            </button>

            {onOpenGitHub && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGitHub();
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-950 to-slate-800 hover:from-indigo-900 hover:to-slate-700 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-indigo-500/40 shadow-sm"
                title="Đẩy mã trực tiếp lên kho GitHub"
              >
                <Github className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đẩy Lên GitHub</span>
              </button>
            )}

            {activeTab === 'html' ? (
              <button
                onClick={handleDownloadHtml}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-cyan-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Tệp index.html</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Tệp JSON</span>
                </button>

                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nhập JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 p-4 bg-slate-950 overflow-hidden flex flex-col">
          <textarea
            readOnly
            value={currentCode}
            className="w-full h-full p-4 font-mono text-xs bg-slate-900/90 text-indigo-300 border border-slate-800 rounded-xl resize-none focus:outline-none focus:border-indigo-500/50 leading-relaxed overflow-y-auto"
          />
        </div>
      </div>
    </div>
  );
};
