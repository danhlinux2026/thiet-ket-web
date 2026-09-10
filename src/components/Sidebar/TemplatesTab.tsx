import React, { useState } from 'react';
import { Sparkles, Check, ExternalLink, Search, Tag, ArrowRight } from 'lucide-react';
import { TemplateCategory, TemplateDefinition, WebsiteProject } from '../../types';
import { TEMPLATES_CATALOG } from '../../data/templates';

interface TemplatesTabProps {
  onApplyTemplate: (template: TemplateDefinition, mode: 'replace' | 'append') => void;
  onPreviewTemplate: (template: TemplateDefinition) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onApplyTemplate, onPreviewTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Array<{ id: TemplateCategory; label: string }> = [
    { id: 'all', label: 'Tất cả' },
    { id: 'saas', label: 'SaaS & AI' },
    { id: 'ecommerce', label: 'Thời trang & Shop' },
    { id: 'portfolio', label: 'Portfolio' },
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search & Header */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm mẫu giao diện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition font-medium ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group rounded-xl border border-slate-800 bg-slate-800/40 hover:border-indigo-500/60 transition overflow-hidden shadow-sm"
          >
            {/* Thumbnail */}
            <div className="relative h-32 w-full overflow-hidden bg-slate-900">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950/90 text-indigo-300 border border-indigo-700/40">
                {template.categoryName}
              </span>
            </div>

            {/* Content */}
            <div className="p-3">
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition mb-1">
                {template.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {template.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onApplyTemplate(template, 'replace')}
                  className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Áp Dụng Mẫu</span>
                </button>

                <button
                  onClick={() => onApplyTemplate(template, 'append')}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium transition"
                  title="Chèn thêm các khối của mẫu vào trang hiện tại"
                >
                  + Chèn thêm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
