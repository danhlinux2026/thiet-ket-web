import React, { useState } from 'react';
import { Sparkles, X, Check, Search, Tag, ArrowRight, Layout } from 'lucide-react';
import { TemplateCategory, TemplateDefinition } from '../../types';
import { TEMPLATES_CATALOG } from '../../data/templates';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TemplateDefinition, mode: 'replace' | 'append') => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(
    TEMPLATES_CATALOG[0]
  );

  if (!isOpen) return null;

  const categories: Array<{ id: TemplateCategory; label: string }> = [
    { id: 'all', label: 'Tất cả mẫu' },
    { id: 'saas', label: 'SaaS & Công nghệ' },
    { id: 'ecommerce', label: 'Thời trang & Shop' },
    { id: 'portfolio', label: 'Portfolio Cá nhân' },
    { id: 'restaurant', label: 'Nhà hàng & F&B' },
    { id: 'education', label: 'Khóa học & Giáo dục' },
  ];

  const filteredTemplates = TEMPLATES_CATALOG.filter((tpl) => {
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Kho Giao Diện Mẫu Phong Phú</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {TEMPLATES_CATALOG.length} Mẫu Tuyển Chọn
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chọn mẫu giao diện chuyên nghiệp chuẩn SEO và tải về chỉ với 1 cú nhấp chuột.
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

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mẫu giao diện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Body Grid with Preview */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Templates Grid List */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-r border-slate-800">
            {filteredTemplates.map((template) => {
              const isSelected = previewTemplate?.id === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => setPreviewTemplate(template)}
                  className={`group rounded-xl border transition-all overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500 shadow-xl'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-indigo-300 border border-indigo-700/40">
                      {template.categoryName}
                    </span>
                    <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-slate-300">
                      {template.sections.length} Khối
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white mb-1 group-hover:text-indigo-400 transition">
                      {template.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {template.description}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyTemplate(template, 'replace');
                          onClose();
                        }}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Sử Dụng Mẫu</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detail Preview Panel */}
          {previewTemplate && (
            <div className="hidden md:flex md:col-span-5 flex-col h-full overflow-hidden bg-slate-950/50 p-6 justify-between">
              <div className="space-y-4 overflow-y-auto">
                <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl max-h-56">
                  <img
                    src={previewTemplate.thumbnail}
                    alt={previewTemplate.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    {previewTemplate.categoryName}
                  </span>
                  <h3 className="text-base font-extrabold text-white mb-2">
                    {previewTemplate.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {previewTemplate.description}
                  </p>
                </div>

                {/* Section Breakdown */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">
                    Các khối nội dung trong mẫu ({previewTemplate.sections.length} khối):
                  </h4>
                  <div className="space-y-1.5">
                    {previewTemplate.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800"
                      >
                        <span className="w-5 h-5 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold">{sec.name}</span>
                        <span className="text-[10px] text-slate-500 ml-auto uppercase">
                          {sec.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Apply Button */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    onApplyTemplate(previewTemplate, 'replace');
                    onClose();
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Áp Dụng Toàn Bộ Trang (Thay Thế)</span>
                </button>

                <button
                  onClick={() => {
                    onApplyTemplate(previewTemplate, 'append');
                    onClose();
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition"
                >
                  + Chèn Các Khối Này Vào Cuối Trang Hiện Tại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
