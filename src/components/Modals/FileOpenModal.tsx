import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCode,
  FileJson,
  FileText,
  Image as ImageIcon,
  PlusCircle,
  Sparkles,
  Check,
  AlertCircle,
  ArrowRight,
  Copy,
  Layers,
  Code,
  FolderOpen,
  Eye,
  Trash2,
  RefreshCw,
  Plus,
  Palette,
} from 'lucide-react';
import { CanvasElement, CanvasSection, WebsiteProject } from '../../types';
import { parseHtmlToWebStudioSections } from '../../utils/htmlImporter';

interface FileOpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  onOpenTemplatesModal?: () => void;
  initialTab?: 'html' | 'json' | 'css' | 'media' | 'new';
  initialContent?: { type: 'html' | 'json' | 'css' | 'image'; name: string; content: string };
  initialFileContent?: { type: 'html' | 'json' | 'css' | 'image'; name: string; content: string };
}

export const FileOpenModal: React.FC<FileOpenModalProps> = ({
  isOpen,
  onClose,
  project,
  setProject,
  onOpenTemplatesModal,
  initialTab = 'html',
  initialContent,
  initialFileContent,
}) => {
  const activeInitialContent = initialContent || initialFileContent;
  const [activeTab, setActiveTab] = useState<'html' | 'json' | 'css' | 'media' | 'new'>(initialTab);

  // HTML Tab States
  const [htmlInput, setHtmlInput] = useState(activeInitialContent?.type === 'html' ? activeInitialContent.content : '');
  const [htmlFileName, setHtmlFileName] = useState(activeInitialContent?.type === 'html' ? activeInitialContent.name : '');
  const [htmlImportMode, setHtmlImportMode] = useState<'replace' | 'append'>('replace');
  const [extractCssOption, setExtractCssOption] = useState(true);
  const [preserveMetaOption, setPreserveMetaOption] = useState(true);
  const [htmlPreviewMode, setHtmlPreviewMode] = useState<'stats' | 'code'>('stats');

  // JSON Tab States
  const [jsonInput, setJsonInput] = useState(activeInitialContent?.type === 'json' ? activeInitialContent.content : '');
  const [jsonFileName, setJsonFileName] = useState(activeInitialContent?.type === 'json' ? activeInitialContent.name : '');
  const [jsonValidationResult, setJsonValidationResult] = useState<{ valid: boolean; message: string; data?: WebsiteProject } | null>(null);

  // CSS Tab States
  const [cssInput, setCssInput] = useState(activeInitialContent?.type === 'css' ? activeInitialContent.content : '');
  const [cssFileName, setCssFileName] = useState(activeInitialContent?.type === 'css' ? activeInitialContent.name : '');
  const [cssImportMode, setCssImportMode] = useState<'append' | 'replace'>('append');

  // Media Tab States
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; name: string; url: string; size: string }>>(() => {
    try {
      const saved = localStorage.getItem('webstudio_local_media');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drag over states
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop updates
  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (activeInitialContent) {
      if (activeInitialContent.type === 'html') {
        setHtmlInput(activeInitialContent.content);
        setHtmlFileName(activeInitialContent.name);
        setActiveTab('html');
      } else if (activeInitialContent.type === 'json') {
        setJsonInput(activeInitialContent.content);
        setJsonFileName(activeInitialContent.name);
        setActiveTab('json');
      } else if (activeInitialContent.type === 'css') {
        setCssInput(activeInitialContent.content);
        setCssFileName(activeInitialContent.name);
        setActiveTab('css');
      }
    }
  }, [initialTab, activeInitialContent, isOpen]);

  if (!isOpen) return null;

  // Real-time HTML parsing stats
  let parsedHtmlStats = null;
  if (htmlInput.trim()) {
    try {
      const parsed = parseHtmlToWebStudioSections(htmlInput, project.theme);
      let totalElements = 0;
      let totalImages = 0;
      let totalHeadings = 0;
      let totalButtons = 0;

      parsed.sections.forEach((s) => {
        totalElements += s.elements.length;
        s.elements.forEach((el) => {
          if (el.type === 'heading') totalHeadings++;
          if (el.type === 'image') totalImages++;
          if (el.type === 'button') totalButtons++;
        });
      });

      parsedHtmlStats = {
        title: parsed.title || '(Chưa có tiêu đề)',
        metaDesc: parsed.metaDescription || '(Chưa có mô tả)',
        sectionsCount: parsed.sections.length,
        elementsCount: totalElements,
        headingsCount: totalHeadings,
        imagesCount: totalImages,
        buttonsCount: totalButtons,
        hasCss: Boolean(parsed.extractedCss && parsed.extractedCss.trim().length > 0),
        cssLength: parsed.extractedCss ? parsed.extractedCss.length : 0,
        parsedData: parsed,
      };
    } catch (e) {
      // ignore parsing preview error
    }
  }

  // Handle Local File Upload for HTML, JSON, CSS
  const handleFileUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    if (ext === 'html' || ext === 'htm' || ext === 'txt') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setHtmlInput(text);
        setHtmlFileName(file.name);
        setActiveTab('html');
        setStatusMessage({ type: 'success', text: `Đã nạp file HTML "${file.name}" thành công!` });
      };
      reader.readAsText(file);
    } else if (ext === 'json') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setJsonInput(text);
        setJsonFileName(file.name);
        setActiveTab('json');
        try {
          const parsed = JSON.parse(text);
          if (parsed && Array.isArray(parsed.sections) && parsed.theme) {
            setJsonValidationResult({ valid: true, message: 'Dự án hợp lệ, sẵn sàng nạp!', data: parsed });
            setStatusMessage({ type: 'success', text: `File dự án "${file.name}" hợp lệ!` });
          } else {
            setJsonValidationResult({ valid: false, message: 'File JSON không đúng cấu trúc WebStudio dự án' });
          }
        } catch {
          setJsonValidationResult({ valid: false, message: 'Mã JSON bị lỗi cú pháp' });
        }
      };
      reader.readAsText(file);
    } else if (ext === 'css') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCssInput(text);
        setCssFileName(file.name);
        setActiveTab('css');
        setStatusMessage({ type: 'success', text: `Đã nạp file CSS "${file.name}" thành công!` });
      };
      reader.readAsText(file);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext || '')) {
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newImg = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          url: dataUrl,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        };
        const updated = [newImg, ...uploadedImages];
        setUploadedImages(updated);
        try {
          localStorage.setItem('webstudio_local_media', JSON.stringify(updated.slice(0, 15)));
        } catch {}
        setActiveTab('media');
        setStatusMessage({ type: 'success', text: `Đã thêm ảnh "${file.name}" vào thư viện!` });
      };
      reader.readAsDataURL(file);
    } else {
      setStatusMessage({ type: 'error', text: `Định dạng .${ext} chưa được hỗ trợ. Hãy chọn file .html, .json, .css hoặc ảnh!` });
    }
  };

  // Drag and Drop files onto modal
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Execute Import HTML
  const executeImportHtml = () => {
    if (!htmlInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng chọn file hoặc dán mã HTML trước khi nhập!' });
      return;
    }

    try {
      const parsed = parseHtmlToWebStudioSections(htmlInput, project.theme);
      if (parsed.sections.length === 0) {
        setStatusMessage({ type: 'error', text: 'Không trích xuất được khối nội dung nào từ HTML này.' });
        return;
      }

      setProject((prev) => {
        const nextSections = htmlImportMode === 'replace' ? parsed.sections : [...prev.sections, ...parsed.sections];
        return {
          ...prev,
          name: preserveMetaOption && parsed.title ? parsed.title : prev.name,
          sections: nextSections,
          settings: {
            ...prev.settings,
            title: preserveMetaOption && parsed.title ? parsed.title : prev.settings.title,
            metaDescription: preserveMetaOption && parsed.metaDescription ? parsed.metaDescription : prev.settings.metaDescription,
            businessPhone: parsed.businessPhone || prev.settings.businessPhone,
            businessName: parsed.businessName || prev.settings.businessName,
            bodyClasses: parsed.bodyClasses || prev.settings.bodyClasses,
            externalStylesheets: [
              ...(prev.settings.externalStylesheets || []),
              ...(parsed.externalStylesheets || []).filter(
                (s) => !(prev.settings.externalStylesheets || []).includes(s)
              ),
            ],
            externalScripts: [
              ...(prev.settings.externalScripts || []),
              ...(parsed.externalScripts || []).filter(
                (s) => !(prev.settings.externalScripts || []).includes(s)
              ),
            ],
            customCss:
              extractCssOption && parsed.extractedCss
                ? `${prev.settings.customCss || ''}\n/* CSS Trích Xuất Từ ${htmlFileName || 'File HTML'} */\n${parsed.extractedCss}`
                : prev.settings.customCss,
          },
        };
      });

      onClose();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Lỗi khi xử lý HTML: ${err?.message || 'Không xác định'}` });
    }
  };

  // Execute Open JSON Project
  const executeOpenJson = () => {
    try {
      const data = jsonValidationResult?.data || JSON.parse(jsonInput);
      if (!data || !Array.isArray(data.sections)) {
        setStatusMessage({ type: 'error', text: 'Cấu trúc file JSON không hợp lệ!' });
        return;
      }
      setProject(data);
      onClose();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Lỗi khi mở file JSON: ${err?.message || 'Cú pháp không hợp lệ'}` });
    }
  };

  // Execute Apply CSS
  const executeApplyCss = () => {
    if (!cssInput.trim()) return;
    setProject((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        customCss:
          cssImportMode === 'replace'
            ? cssInput
            : `${prev.settings.customCss || ''}\n/* CSS từ ${cssFileName || 'File nạp ngoài'} */\n${cssInput}`,
      },
    }));
    onClose();
  };

  // Insert an Image directly as a new section on Canvas
  const handleInsertImageToCanvas = (imgUrl: string, imgName: string) => {
    const newSection: CanvasSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `Khối Ảnh: ${imgName.slice(0, 20)}`,
      category: 'gallery',
      layout: 'container',
      styles: {
        paddingTop: 48,
        paddingBottom: 48,
        backgroundColor: '#0f172a',
      },
      elements: [
        {
          id: `el-${Date.now()}-1`,
          type: 'image',
          src: imgUrl,
          alt: imgName,
          styles: {
            borderRadius: '1rem',
            marginBottom: 0,
            textAlign: 'center',
          },
        },
      ],
    };

    setProject((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setStatusMessage({ type: 'success', text: `Đã chèn ảnh "${imgName}" vào website!` });
  };

  // Create New Blank / Fresh Page
  const handleCreateNewPage = (type: 'blank' | 'hero-simple') => {
    if (type === 'blank') {
      setProject({
        id: `proj-${Date.now()}`,
        name: 'Trang Web Mới',
        sections: [
          {
            id: `sec-${Date.now()}`,
            name: 'Khối Tiêu Đề Đầu Trang',
            category: 'hero',
            styles: {
              paddingTop: 80,
              paddingBottom: 80,
              backgroundColor: '#090d16',
            },
            elements: [
              {
                id: `el-${Date.now()}-1`,
                type: 'heading',
                tag: 'h1',
                content: 'Tiêu Đề Trang Mới Của Bạn',
                styles: {
                  fontSize: '5xl',
                  fontWeight: 'extrabold',
                  textAlign: 'center',
                  textColor: '#ffffff',
                  marginBottom: 16,
                },
              },
              {
                id: `el-${Date.now()}-2`,
                type: 'paragraph',
                content: 'Bắt đầu thêm nội dung, kéo thả khối sẵn hoặc chọn các phần tử từ thanh công cụ bên trái.',
                styles: {
                  fontSize: 'lg',
                  textAlign: 'center',
                  textColor: '#94a3b8',
                  marginBottom: 24,
                },
              },
              {
                id: `el-${Date.now()}-3`,
                type: 'button',
                content: 'Khám Phá Ngay',
                href: '#',
                styles: {
                  backgroundColor: '#6366f1',
                  textColor: '#ffffff',
                  borderRadius: '0.75rem',
                  textAlign: 'center',
                },
              },
            ],
          },
        ],
        theme: {
          primaryColor: '#6366f1',
          secondaryColor: '#ec4899',
          fontFamily: 'Plus Jakarta Sans',
          headingFont: 'Outfit',
          mode: 'dark',
        },
        settings: {
          title: 'Trang Web Mới',
          metaDescription: 'Website được tạo nhanh với WebStudio',
          favicon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
        },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`bg-slate-900 border ${
          isDragOver ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-slate-800'
        } rounded-2xl w-full max-w-4xl h-[90vh] max-h-[820px] flex flex-col shadow-2xl overflow-hidden transition-all duration-200`}
      >
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".html,.htm,.json,.css,.txt"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        <input
          type="file"
          ref={mediaInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              Array.from(e.target.files).forEach((f: File) => handleFileUpload(f));
            }
          }}
        />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Mở & Thêm Tệp Vào Website
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Thủ Công
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Nạp file HTML, JSON dự án, mã CSS tùy chỉnh, hoặc thêm ảnh trực tiếp từ máy tính
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Toast */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 flex items-center justify-between text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-b border-emerald-800/50 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/80 border-b border-rose-800/50 text-rose-300'
                : 'bg-indigo-950/80 border-b border-indigo-800/50 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-900/60 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'html'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Mở File HTML / Web</span>
            {htmlInput.trim() && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileJson className="w-4 h-4 text-cyan-400" />
            <span>Mở Dự Án (.json)</span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'css'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-pink-400" />
            <span>Thêm File CSS (.css)</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Thêm Ảnh từ Máy ({uploadedImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'new'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span>Tạo Trang Mới / Trắng</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ===================== TAB 1: HTML IMPORT ===================== */}
          {activeTab === 'html' && (
            <div className="space-y-5">
              {/* Drag & Drop Quick Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 text-slate-400 flex items-center justify-center mb-3 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {htmlFileName ? `Đã chọn: ${htmlFileName}` : 'Nhấp để chọn file HTML từ máy tính hoặc Kéo thả vào đây'}
                </h4>
                <p className="text-xs text-slate-400">
                  Hỗ trợ các định dạng file: <code className="text-indigo-300 font-semibold">.html</code>, <code className="text-indigo-300 font-semibold">.htm</code>, <code className="text-indigo-300 font-semibold">.txt</code>
                </p>
              </div>

              {/* Or Paste Code Manually */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span>Hoặc dán trực tiếp mã HTML vào ô dưới đây:</span>
                  </label>
                  {htmlInput && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setHtmlInput('');
                          setHtmlFileName('');
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Xóa ô
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder={`<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <title>Trang Của Tôi</title>\n</head>\n<body>\n  <h1>Chào Mừng Bạn</h1>\n  <p>Đây là nội dung trang web...</p>\n</body>\n</html>`}
                  className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>

              {/* Parsing Real-time Summary Card */}
              {parsedHtmlStats && (
                <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Phân tích nội dung trích xuất được:
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {parsedHtmlStats.sectionsCount} Khối Sections • {parsedHtmlStats.elementsCount} Phần tử
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Tiêu đề (H1-H4)</span>
                      <span className="font-bold text-white text-sm">{parsedHtmlStats.headingsCount} thẻ</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Hình ảnh (img)</span>
                      <span className="font-bold text-white text-sm">{parsedHtmlStats.imagesCount} ảnh</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Nút bấm (Button/Link)</span>
                      <span className="font-bold text-white text-sm">{parsedHtmlStats.buttonsCount} nút</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Mã CSS nhúng</span>
                      <span className="font-bold text-white text-sm">
                        {parsedHtmlStats.hasCss ? `${(parsedHtmlStats.cssLength / 1024).toFixed(1)} KB` : 'Không có'}
                      </span>
                    </div>
                  </div>

                  {parsedHtmlStats.title && parsedHtmlStats.title !== '(Chưa có tiêu đề)' && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-500">Tiêu đề trang:</span>{' '}
                      <span className="font-semibold text-white">{parsedHtmlStats.title}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Import Configuration Options */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-slate-300">Tùy chọn nạp HTML:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                    <input
                      type="radio"
                      name="htmlImportMode"
                      checked={htmlImportMode === 'replace'}
                      onChange={() => setHtmlImportMode('replace')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Thay thế toàn bộ website hiện tại</span>
                      <span className="text-[11px] text-slate-400">Xóa các khối hiện có và nạp website mới từ file HTML này</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                    <input
                      type="radio"
                      name="htmlImportMode"
                      checked={htmlImportMode === 'append'}
                      onChange={() => setHtmlImportMode('append')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Nối thêm thành các Khối mới (Append)</span>
                      <span className="text-[11px] text-slate-400">Giữ nguyên các khối hiện có, thêm nội dung HTML này vào cuối trang</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={extractCssOption}
                      onChange={(e) => setExtractCssOption(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Tự động trích xuất các thẻ &lt;style&gt; sang Custom CSS</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={preserveMetaOption}
                      onChange={(e) => setPreserveMetaOption(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Cập nhật Tiêu đề trang (&lt;title&gt;) và Meta Description</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: JSON PROJECT IMPORT ===================== */}
          {activeTab === 'json' && (
            <div className="space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-cyan-600/20 group-hover:text-cyan-400 text-slate-400 flex items-center justify-center mb-3 transition">
                  <FileJson className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {jsonFileName ? `Đã chọn: ${jsonFileName}` : 'Chọn file dự án WebStudio (.json) để khôi phục'}
                </h4>
                <p className="text-xs text-slate-400">
                  Mở lại toàn bộ khối giao diện, màu sắc, font chữ và cài đặt đã lưu trước đó
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2">
                  <FileJson className="w-4 h-4 text-cyan-400" />
                  <span>Hoặc dán nội dung mã JSON dự án:</span>
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    try {
                      const parsed = JSON.parse(e.target.value);
                      if (parsed && Array.isArray(parsed.sections)) {
                        setJsonValidationResult({ valid: true, message: 'Dự án hợp lệ, sẵn sàng nạp!', data: parsed });
                      } else {
                        setJsonValidationResult({ valid: false, message: 'JSON không đúng cấu trúc WebStudio' });
                      }
                    } catch {
                      setJsonValidationResult({ valid: false, message: 'Mã JSON lỗi cú pháp' });
                    }
                  }}
                  placeholder={`{\n  "id": "proj-123",\n  "name": "Dự Án Web",\n  "sections": [...],\n  "theme": {...}\n}`}
                  className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
                />
              </div>

              {jsonValidationResult && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 ${
                    jsonValidationResult.valid
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {jsonValidationResult.valid ? (
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div className="text-xs">
                    <span className="font-bold block">{jsonValidationResult.message}</span>
                    {jsonValidationResult.data && (
                      <span className="text-[11px] text-slate-400">
                        Tên: {jsonValidationResult.data.name} • {jsonValidationResult.data.sections.length} khối Sections • Chủ đề: {jsonValidationResult.data.theme.primaryColor}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 3: CSS STYLESHEET IMPORT ===================== */}
          {activeTab === 'css' && (
            <div className="space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-pink-600/20 group-hover:text-pink-400 text-slate-400 flex items-center justify-center mb-3 transition">
                  <Palette className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {cssFileName ? `Đã chọn: ${cssFileName}` : 'Chọn file CSS (.css) từ máy tính để nạp style'}
                </h4>
                <p className="text-xs text-slate-400">
                  Thêm các đoạn mã CSS tùy biến, animation, hoặc stylesheet của bên thứ 3
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-pink-400" />
                  <span>Hoặc dán trực tiếp mã CSS:</span>
                </label>
                <textarea
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  placeholder={`/* Custom CSS */\n.custom-hero {\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n}\n\n.btn-glow {\n  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);\n}`}
                  className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="radio"
                    name="cssMode"
                    checked={cssImportMode === 'append'}
                    onChange={() => setCssImportMode('append')}
                    className="text-pink-600"
                  />
                  <span>Nối thêm vào Custom CSS hiện tại</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="radio"
                    name="cssMode"
                    checked={cssImportMode === 'replace'}
                    onChange={() => setCssImportMode('replace')}
                    className="text-pink-600"
                  />
                  <span>Ghi đè hoàn toàn Custom CSS</span>
                </label>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: MEDIA UPLOAD & LIBRARY ===================== */}
          {activeTab === 'media' && (
            <div className="space-y-5">
              <div
                onClick={() => mediaInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-emerald-600/20 group-hover:text-emerald-400 text-slate-400 flex items-center justify-center mb-3 transition">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Nhấp để tải ảnh từ máy tính hoặc Kéo thả ảnh vào đây
                </h4>
                <p className="text-xs text-slate-400">
                  Hỗ trợ định dạng: <code className="text-emerald-300 font-semibold">.png, .jpg, .jpeg, .webp, .svg, .gif</code> (Có thể chọn nhiều ảnh cùng lúc)
                </p>
              </div>

              {/* Local Media Gallery Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Kho Ảnh Đã Tải Lên Trên Máy ({uploadedImages.length} ảnh)</span>
                  </h4>
                  {uploadedImages.length > 0 && (
                    <button
                      onClick={() => {
                        setUploadedImages([]);
                        localStorage.removeItem('webstudio_local_media');
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa tất cả
                    </button>
                  )}
                </div>

                {uploadedImages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-500">Chưa có ảnh nào được tải lên. Hãy chọn ảnh từ máy tính của bạn!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedImages.map((img) => (
                      <div
                        key={img.id}
                        className="group bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl overflow-hidden flex flex-col transition"
                      >
                        <div className="h-28 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-white block truncate" title={img.name}>
                              {img.name}
                            </span>
                            <span className="text-[10px] text-slate-500">{img.size}</span>
                          </div>
                          <button
                            onClick={() => handleInsertImageToCanvas(img.url, img.name)}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Chèn Vào Trang
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 5: NEW PAGE CREATOR ===================== */}
          {activeTab === 'new' && (
            <div className="space-y-5">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Khởi Tạo Dự Án Mới</h3>
                    <p className="text-xs text-slate-400">Chọn cách bạn muốn bắt đầu thiết kế trang web</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => handleCreateNewPage('blank')}
                    className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">Trang Trắng Tinh (Blank Canvas)</h4>
                      <p className="text-[11px] text-slate-400">
                        Bắt đầu từ một khung trống với 1 khối tiêu đề chuẩn, tự do thêm các phần tử theo ý muốn.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition">
                      <span>Tạo Trang Trắng</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      onClose();
                      onOpenTemplatesModal?.();
                    }}
                    className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">Chọn Từ Kho Mẫu Đẹp (Templates)</h4>
                      <p className="text-[11px] text-slate-400">
                        Sử dụng hơn 15+ mẫu giao diện chuyên nghiệp cho SaaS, Bán hàng, Nhà hàng, Portfolio...
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition">
                      <span>Mở Kho Giao Diện</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
          >
            Đóng
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'html' && (
              <button
                onClick={executeImportHtml}
                disabled={!htmlInput.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                  htmlInput.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Nạp Mã HTML Này Vào Website</span>
              </button>
            )}

            {activeTab === 'json' && (
              <button
                onClick={executeOpenJson}
                disabled={!jsonInput.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                  jsonInput.trim()
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span>Mở Dự Án WebStudio</span>
              </button>
            )}

            {activeTab === 'css' && (
              <button
                onClick={executeApplyCss}
                disabled={!cssInput.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                  cssInput.trim()
                    ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Áp Dụng Mã CSS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
