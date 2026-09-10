import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Search,
  Upload,
  Link,
  X,
  Check,
  Sparkles,
  Github,
} from 'lucide-react';
import { STOCK_IMAGES } from '../../data/stockImages';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, alt?: string) => void;
  currentUrl?: string;
  onOpenGitHubPicker?: () => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentUrl,
  onOpenGitHubPicker,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tất cả ảnh' },
    { id: 'tech', label: 'Công nghệ & AI' },
    { id: 'fashion', label: 'Thời trang & Shop' },
    { id: 'food', label: 'Nhà hàng & F&B' },
    { id: 'business', label: 'Doanh nghiệp' },
    { id: 'portfolio', label: 'Chân dung & Cá nhân' },
    { id: 'education', label: 'Khóa học' },
  ];

  const filteredImages = STOCK_IMAGES.filter((img) => {
    const matchesCat = selectedCategory === 'all' || img.category === selectedCategory;
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.alt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSelectImage(dataUrl, file.name);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      onSelectImage(customUrl.trim(), 'Hình ảnh tùy chỉnh');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Thư Viện Ảnh Tuyển Chọn</h3>
              <p className="text-[11px] text-slate-400">
                Chọn ảnh độ phân giải cao, tải lên hoặc chọn trực tiếp từ kho GitHub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom URL, Local Upload & GitHub Selector */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Custom URL */}
          <div className="flex items-center gap-1.5 md:col-span-1">
            <div className="relative flex-1">
              <Link className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Dán link ảnh (https://...)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomUrl()}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleApplyCustomUrl}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0"
            >
              Áp dụng
            </button>
          </div>

          {/* GitHub Selector */}
          <div className="flex items-center">
            <button
              onClick={() => {
                onClose();
                if (onOpenGitHubPicker) onOpenGitHubPicker();
              }}
              className="w-full py-1.5 px-3 bg-gradient-to-r from-slate-800 to-indigo-950/60 hover:from-slate-700 hover:to-indigo-900/60 text-slate-200 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Github className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chọn Ảnh Từ GitHub</span>
            </button>
          </div>

          {/* Local Upload */}
          <div className="flex items-center justify-end">
            <label className="w-full md:w-auto px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tải Ảnh Từ Máy Tính</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm ảnh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredImages.map((img) => {
            const isSelected = currentUrl === img.url;
            return (
              <div
                key={img.id}
                onClick={() => {
                  onSelectImage(img.url, img.alt);
                  onClose();
                }}
                className={`group relative rounded-xl overflow-hidden border cursor-pointer aspect-video bg-slate-800 transition ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500'
                    : 'border-slate-800 hover:border-indigo-500/80 hover:shadow-lg'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-white truncate">{img.title}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
