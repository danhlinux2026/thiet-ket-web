import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Check,
  Search,
  Tag,
  ArrowRight,
  Layout,
  Plus,
  Trash2,
  Download,
  Upload,
  BookmarkPlus,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { TemplateCategory, TemplateDefinition, WebsiteProject } from '../../types';
import { TEMPLATES_CATALOG } from '../../data/templates';
import {
  getStoredCustomTemplates,
  createTemplateFromProject,
  deleteCustomTemplate,
  exportTemplateAsJSON,
  importTemplateFromJSON,
} from '../../services/templateManagerService';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TemplateDefinition, mode: 'replace' | 'append') => void;
  currentProject?: WebsiteProject;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTemplates, setCustomTemplates] = useState<TemplateDefinition[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  // Create Template Modal Form state
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateCat, setNewTemplateCat] = useState<TemplateCategory>('saas');
  const [newTemplateThumbnail, setNewTemplateThumbnail] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom templates on open
  useEffect(() => {
    if (isOpen) {
      const custom = getStoredCustomTemplates();
      setCustomTemplates(custom);
      if (custom.length > 0 && !previewTemplate) {
        setPreviewTemplate(custom[0]);
      } else if (!previewTemplate) {
        setPreviewTemplate(TEMPLATES_CATALOG[0]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories: Array<{ id: string; label: string; count?: number }> = [
    { id: 'all', label: 'Tất cả mẫu' },
    { id: 'my-templates', label: `Mẫu của tôi (${customTemplates.length})` },
    { id: 'saas', label: 'SaaS & Công nghệ' },
    { id: 'ecommerce', label: 'Thời trang & Shop' },
    { id: 'portfolio', label: 'Portfolio Cá nhân' },
    { id: 'restaurant', label: 'Nhà hàng & F&B' },
    { id: 'education', label: 'Khóa học & Giáo dục' },
  ];

  const allTemplates = [...customTemplates, ...TEMPLATES_CATALOG];

  const filteredTemplates = allTemplates.filter((tpl) => {
    let matchesCat = true;
    if (selectedCategory === 'my-templates') {
      matchesCat = !!tpl.isCustom;
    } else if (selectedCategory !== 'all') {
      matchesCat = tpl.category === selectedCategory;
    }

    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    if (currentProject) {
      setNewTemplateName(currentProject.name || 'Mẫu giao diện tùy chỉnh');
      setNewTemplateDesc(currentProject.description || 'Giao diện được tạo từ dự án hiện tại.');
    }
    setNewTemplateThumbnail(
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
    );
    setIsCreatingTemplate(true);
  };

  const handleSaveNewTemplate = () => {
    if (!currentProject) return;
    const catNameMap: Record<TemplateCategory, string> = {
      all: 'Tất cả',
      saas: 'SaaS & Công Nghệ',
      ecommerce: 'Thương Mại & Thời Trang',
      portfolio: 'Portfolio & Cá Nhân',
      restaurant: 'Nhà Hàng & F&B',
      education: 'Giáo Dục & Khóa Học',
      agency: 'Agency & Doanh Nghiệp',
      realestate: 'Bất Động Sản',
    };

    const created = createTemplateFromProject(currentProject, {
      name: newTemplateName.trim() || 'Mẫu Mới',
      description: newTemplateDesc.trim() || 'Mô tả mẫu',
      category: newTemplateCat,
      categoryName: catNameMap[newTemplateCat] || 'Tùy Chỉnh',
      thumbnail: newTemplateThumbnail.trim(),
      tags: ['Tùy Chỉnh', catNameMap[newTemplateCat]],
    });

    const updated = getStoredCustomTemplates();
    setCustomTemplates(updated);
    setPreviewTemplate(created);
    setIsCreatingTemplate(false);
    setSelectedCategory('my-templates');
  };

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomTemplate(id);
    const updated = getStoredCustomTemplates();
    setCustomTemplates(updated);
    if (previewTemplate?.id === id) {
      setPreviewTemplate(updated[0] || TEMPLATES_CATALOG[0]);
    }
    setDeleteConfirmId(null);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importTemplateFromJSON(content);
      if (imported) {
        const updated = getStoredCustomTemplates();
        setCustomTemplates(updated);
        setPreviewTemplate(imported);
        setSelectedCategory('my-templates');
      } else {
        alert('Tệp JSON không hợp lệ hoặc sai định dạng mẫu webstudio.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>Quản Lý Mẫu Giao Diện Web</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {allTemplates.length} Mẫu
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Thêm, xóa, tùy biến và áp dụng các mẫu giao diện chuyên nghiệp chuẩn SEO.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Create Template from Current Project Button */}
            {currentProject && (
              <button
                onClick={handleOpenCreate}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Lưu Trang Thành Mẫu</span>
                <span className="sm:hidden">+ Mẫu</span>
              </button>
            )}

            {/* Import JSON Template */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition"
              title="Nhập mẫu từ tệp JSON"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Nhập JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Template Modal Overlay */}
        {isCreatingTemplate && (
          <div className="p-4 bg-indigo-950/60 border-b border-indigo-700/60 flex flex-col gap-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-indigo-400" />
                Lưu toàn bộ trang hiện tại thành mẫu giao diện mới:
              </span>
              <button
                onClick={() => setIsCreatingTemplate(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Hủy
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Tên Mẫu:</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Ví dụ: Trang Landing Page Doanh Nghiệp"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">Danh mục:</label>
                <select
                  value={newTemplateCat}
                  onChange={(e) => setNewTemplateCat(e.target.value as TemplateCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="saas">SaaS & Công Nghệ</option>
                  <option value="ecommerce">Thời Trang & Shop</option>
                  <option value="portfolio">Portfolio Cá Nhân</option>
                  <option value="restaurant">Nhà Hàng & F&B</option>
                  <option value="education">Khóa Học & Giáo Dục</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1 font-medium">URL Ảnh Thumbnail:</label>
                <input
                  type="text"
                  value={newTemplateThumbnail}
                  onChange={(e) => setNewTemplateThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 block mb-1 font-medium">Mô tả tóm tắt:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="Mô tả các khối và tính năng nổi bật trong mẫu này..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleSaveNewTemplate}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md transition shrink-0"
                >
                  ✓ Lưu Mẫu Này
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 shrink-0">
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
              placeholder="Tìm kiếm mẫu web..."
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
            {filteredTemplates.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 space-y-3">
                <Layout className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs">
                  {selectedCategory === 'my-templates'
                    ? 'Bạn chưa lưu mẫu tùy chỉnh nào. Nhấn "Lưu Trang Thành Mẫu" ở trên để tạo mẫu đầu tiên!'
                    : 'Không tìm thấy mẫu phù hợp với từ khóa.'}
                </p>
                {selectedCategory === 'my-templates' && currentProject && (
                  <button
                    onClick={handleOpenCreate}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                  >
                    + Lưu Trang Hiện Tại Thành Mẫu
                  </button>
                )}
              </div>
            ) : (
              filteredTemplates.map((template) => {
                const isSelected = previewTemplate?.id === template.id;
                const isCustom = !!template.isCustom;

                return (
                  <div
                    key={template.id}
                    onClick={() => setPreviewTemplate(template)}
                    className={`group rounded-xl border transition-all overflow-hidden cursor-pointer flex flex-col justify-between relative ${
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
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-indigo-300 border border-indigo-700/40">
                        {template.categoryName}
                      </span>

                      {/* Custom Badge */}
                      {isCustom && (
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 shadow-xs">
                          Mẫu Tự Tạo
                        </span>
                      )}

                      <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-slate-300">
                        {template.sections.length} Khối
                      </span>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-bold text-white mb-1 group-hover:text-indigo-400 transition flex items-center justify-between">
                        <span className="truncate">{template.name}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {template.description}
                      </p>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
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

                        {/* Export JSON button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportTemplateAsJSON(template);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[11px] transition"
                          title="Tải tệp JSON của mẫu này"
                        >
                          <Download className="w-3 h-3" />
                        </button>

                        {/* Delete Custom Template button */}
                        {isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Bạn có chắc muốn xóa mẫu "${template.name}"?`)) {
                                handleDeleteTemplate(template.id, e);
                              }
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded text-[11px] transition"
                            title="Xóa mẫu tự tạo này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Detail Preview Panel */}
          {previewTemplate && (
            <div className="hidden md:flex md:col-span-5 flex-col h-full overflow-hidden bg-slate-950/50 p-6 justify-between">
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl max-h-52 relative">
                  <img
                    src={previewTemplate.thumbnail}
                    alt={previewTemplate.name}
                    className="w-full h-full object-cover"
                  />
                  {previewTemplate.isCustom && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
                      Mẫu Tự Tạo
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      {previewTemplate.categoryName}
                    </span>
                    {previewTemplate.isCustom && (
                      <button
                        onClick={(e) => {
                          if (confirm(`Xác nhận xóa mẫu "${previewTemplate.name}"?`)) {
                            handleDeleteTemplate(previewTemplate.id, e);
                          }
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa Mẫu</span>
                      </button>
                    )}
                  </div>
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
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {previewTemplate.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800"
                      >
                        <span className="w-5 h-5 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold truncate">{sec.name}</span>
                        <span className="text-[10px] text-slate-500 ml-auto uppercase shrink-0">
                          {sec.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Apply Button */}
              <div className="pt-4 border-t border-slate-800 space-y-2 shrink-0">
                <button
                  onClick={() => {
                    onApplyTemplate(previewTemplate, 'replace');
                    onClose();
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Áp Dụng Toàn Bộ Trang (Thay Thế)</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onApplyTemplate(previewTemplate, 'append');
                      onClose();
                    }}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition"
                  >
                    + Chèn Vào Cuối Trang
                  </button>

                  <button
                    onClick={() => exportTemplateAsJSON(previewTemplate)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition flex items-center gap-1"
                    title="Xuất JSON mẫu"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
