import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Globe,
  Share2,
  FileCode2,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Smartphone,
  Monitor,
  Eye,
  Settings2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { WebsiteProject, SEOSettings } from '../../types';
import {
  auditProjectSEO,
  autoOptimizeProjectSEO,
  generateSchemaJsonLd,
  generateSitemapXml,
  generateRobotsTxt,
  SEOAuditReport,
} from '../../services/seoService';

interface SEOOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
}

type SEOTab = 'preview' | 'audit' | 'meta' | 'schema' | 'sitemap';

export const SEOOptimizerModal: React.FC<SEOOptimizerModalProps> = ({
  isOpen,
  onClose,
  project,
  setProject,
}) => {
  const [activeTab, setActiveTab] = useState<SEOTab>('preview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [justOptimized, setJustOptimized] = useState(false);

  const auditReport: SEOAuditReport = useMemo(() => auditProjectSEO(project), [project]);
  const sitemapXml = useMemo(() => generateSitemapXml(project), [project]);
  const robotsTxt = useMemo(() => generateRobotsTxt(project), [project]);
  const schemaJson = useMemo(() => generateSchemaJsonLd(project), [project]);

  if (!isOpen) return null;

  const settings: SEOSettings = project.settings || {
    title: project.name,
    metaDescription: project.description,
  };

  const updateSetting = <K extends keyof SEOSettings>(key: K, value: SEOSettings[K]) => {
    setProject((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
      lastModified: Date.now(),
    }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAutoOptimize = () => {
    const optimized = autoOptimizeProjectSEO(project);
    setProject(optimized);
    setJustOptimized(true);
    setTimeout(() => setJustOptimized(false), 3000);
  };

  const titleLength = (settings.title || project.name || '').length;
  const descLength = (settings.metaDescription || project.description || '').length;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  const siteDisplayUrl = settings.canonicalUrl || 'https://mywebsite.com';
  const cleanDomain = siteDisplayUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Search className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Tối Ưu SEO & Tìm Kiếm Google
                </h2>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(
                    auditReport.score
                  )}`}
                >
                  SEO Score: {auditReport.score}/100 ({auditReport.grade})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tối ưu thẻ meta, dữ liệu có cấu trúc Schema.org, Sitemap và xem trước hiển thị trên Google.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoOptimize}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-emerald-600/30"
              title="Tự động điền thẻ tiêu đề, mô tả chuẩn SEO và gắn thẻ alt cho toàn bộ hình ảnh"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{justOptimized ? '✓ Đã Tối Ưu!' : 'Tối Ưu SEO Tự Động'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Mô Phỏng Google & Mạng Xã Hội</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Kiểm Tra & Đánh Giá SEO ({auditReport.passedCount}/{auditReport.items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'meta'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Thẻ Meta & Từ Khóa</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Schema.org (JSON-LD)</span>
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'sitemap'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Sitemap.xml & Robots.txt</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40 space-y-6">
          {/* TAB 1: PREVIEW (Google SERP & Social Sharing) */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Google SERP Simulator */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Mô Phỏng Kết Quả Tìm Kiếm Google (SERP Preview)
                    </h3>
                  </div>

                  <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-lg p-0.5">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                        previewDevice === 'desktop'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Máy tính</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                        previewDevice === 'mobile'
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Điện thoại</span>
                    </button>
                  </div>
                </div>

                {/* Google Snippet Card */}
                <div
                  className={`p-4 rounded-xl bg-white text-slate-900 shadow-sm border border-slate-200 ${
                    previewDevice === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
                  }`}
                >
                  {/* Google Breadcrumb / Domain */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 overflow-hidden">
                      {settings.faviconUrl ? (
                        <img src={settings.faviconUrl} alt="Favicon" className="w-4 h-4" />
                      ) : (
                        cleanDomain[0]?.toUpperCase() || 'W'
                      )}
                    </div>
                    <div className="leading-tight overflow-hidden">
                      <div className="text-xs text-slate-800 font-medium truncate">
                        {settings.businessName || settings.title || project.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <span>{siteDisplayUrl}</span>
                        <span>›</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug mb-1 truncate">
                    {settings.title || project.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {settings.metaDescription || project.description || 'Chưa có mô tả trang...'}
                  </p>

                  {/* Rich Snippet Preview */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <span>★ 4.9</span>
                      <span className="text-slate-400 font-normal">(128 đánh giá)</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-medium">Có sẵn trực tuyến</span>
                    <span className="text-slate-300">•</span>
                    <span>Bảo hành uy tín</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>
                    Tiêu đề: <b className={titleLength > 65 ? 'text-amber-400' : 'text-emerald-400'}>{titleLength}/65</b> ký tự
                  </span>
                  <span>
                    Mô tả: <b className={descLength > 165 ? 'text-amber-400' : 'text-emerald-400'}>{descLength}/160</b> ký tự
                  </span>
                </div>
              </div>

              {/* Social Media Share Preview (Facebook / Zalo / Twitter) */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Xem Trước Khi Chia Sẻ Lên Facebook, Zalo, LinkedIn
                  </h3>
                </div>

                <div className="max-w-lg mx-auto rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl">
                  {/* Thumbnail Image */}
                  <div className="relative h-48 sm:h-56 bg-slate-950 overflow-hidden">
                    <img
                      src={
                        settings.ogImage ||
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200'
                      }
                      alt="Open Graph Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200';
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 bg-slate-800/90 border-t border-slate-700/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      {cleanDomain}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {settings.title || project.name}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {settings.metaDescription || project.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT CHECKLIST */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              {/* Score Summary Banner */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${getScoreColor(
                      auditReport.score
                    )}`}
                  >
                    <span className="text-2xl">{auditReport.score}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold">/ 100</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Đánh Giá Toàn Diện: Điểm {auditReport.score} ({auditReport.grade})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {auditReport.passedCount} tiêu chuẩn đạt, {auditReport.warningCount} cần lưu ý, {auditReport.errorCount} lỗi cần xử lý.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAutoOptimize}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-600/30 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Khắc phục tự động tất cả</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {auditReport.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.status === 'pass' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {item.status === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        {item.status === 'error' && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-200">{item.title}</span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'pass'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : item.status === 'warning'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {item.status === 'pass' ? 'ĐẠT' : item.status === 'warning' ? 'LƯU Ý' : 'CẦN SỬA'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 pl-6 leading-relaxed">{item.message}</p>
                    <p className="text-[11px] text-slate-400 pl-6 italic">
                      💡 <b>Lời khuyên:</b> {item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: META TAGS & KEYWORDS */}
          {activeTab === 'meta' && (
            <div className="space-y-5">
              {/* Title & Description */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Tiêu Đề & Đoạn Mô Tả Tìm Kiếm (SERP Snippet)</span>
                </h3>

                {/* Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Thẻ Tiêu Đề (Meta Title):
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        titleLength >= 40 && titleLength <= 65
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {titleLength}/65 ký tự (khuyên dùng: 40-65)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={settings.title || project.name}
                    onChange={(e) => updateSetting('title', e.target.value)}
                    placeholder="VD: WebStudio - Nền Tảng Thiết Kế Website Trực Quan Số 1"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Thẻ Mô Tả (Meta Description):
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        descLength >= 120 && descLength <= 165
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {descLength}/160 ký tự (khuyên dùng: 120-160)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={settings.metaDescription || project.description}
                    onChange={(e) => updateSetting('metaDescription', e.target.value)}
                    placeholder="Nhập đoạn tóm tắt hấp dẫn kèm lời kêu gọi hành động để người dùng bấm vào trang của bạn trên Google..."
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Từ Khóa Mục Tiêu (Keywords / Tags):
                  </label>
                  <input
                    type="text"
                    value={settings.keywords || ''}
                    onChange={(e) => updateSetting('keywords', e.target.value)}
                    placeholder="VD: thiet ke web, lam landing page dep, mau website saas, webstudio"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Các từ khóa cách nhau bằng dấu phẩy (,).
                  </p>
                </div>
              </div>

              {/* URLs & Social Images */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span>URL Gốc (Canonical) & Ảnh Chia Sẻ (Open Graph)</span>
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      URL Chính Thức (Canonical URL):
                    </label>
                    <input
                      type="url"
                      value={settings.canonicalUrl || ''}
                      onChange={(e) => updateSetting('canonicalUrl', e.target.value)}
                      placeholder="https://mywebsite.com"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Ảnh Chia Sẻ Mạng Xã Hội (og:image):
                    </label>
                    <input
                      type="url"
                      value={settings.ogImage || ''}
                      onChange={(e) => updateSetting('ogImage', e.target.value)}
                      placeholder="https://example.com/banner-1200x630.jpg"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Mã Xác Thực Google Search Console:
                    </label>
                    <input
                      type="text"
                      value={settings.googleSiteVerification || ''}
                      onChange={(e) => updateSetting('googleSiteVerification', e.target.value)}
                      placeholder="VD: AbCdEfGhIjKlMnOpQrStUvWxYz..."
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Tài Khoản Twitter / X (@handle):
                    </label>
                    <input
                      type="text"
                      value={settings.twitterHandle || ''}
                      onChange={(e) => updateSetting('twitterHandle', e.target.value)}
                      placeholder="@your_brand"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Robots Settings */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.robotsIndex !== false}
                      onChange={(e) => updateSetting('robotsIndex', e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-0"
                    />
                    <span>Cho phép Google lập chỉ mục (Index)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.robotsFollow !== false}
                      onChange={(e) => updateSetting('robotsFollow', e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-0"
                    />
                    <span>Cho phép Google đi theo các liên kết (Follow)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCHEMA.ORG JSON-LD */}
          {activeTab === 'schema' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    <span>Cấu Hình Dữ Liệu Có Cấu Trúc (Google Rich Results)</span>
                  </h3>

                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition"
                  >
                    <span>Kiểm tra Google Rich Results</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Schema Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Loại Schema Mục Tiêu:
                    </label>
                    <select
                      value={settings.schemaType || 'WebSite'}
                      onChange={(e) =>
                        updateSetting('schemaType', e.target.value as SEOSettings['schemaType'])
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="WebSite">Trang Web Tiêu Chuẩn (WebSite)</option>
                      <option value="Organization">Tổ Chức / Công Ty (Organization)</option>
                      <option value="LocalBusiness">Doanh Nghiệp Địa Phương (LocalBusiness)</option>
                      <option value="Product">Sản Phẩm & Bảng Giá (Product)</option>
                      <option value="FAQPage">Câu Hỏi Thường Gặp (FAQPage)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Tên Doanh Nghiệp / Thương Hiệu:
                    </label>
                    <input
                      type="text"
                      value={settings.businessName || ''}
                      onChange={(e) => updateSetting('businessName', e.target.value)}
                      placeholder="VD: Công Ty Cổ Phần WebStudio"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Số Điện Thoại Hotline:
                    </label>
                    <input
                      type="text"
                      value={settings.businessPhone || ''}
                      onChange={(e) => updateSetting('businessPhone', e.target.value)}
                      placeholder="+84 901 234 567"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Địa Chỉ Trụ Sở:
                    </label>
                    <input
                      type="text"
                      value={settings.businessAddress || ''}
                      onChange={(e) => updateSetting('businessAddress', e.target.value)}
                      placeholder="Tòa nhà Landmark, TP. Hồ Chí Minh"
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Code Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-slate-400">
                      Mã JSON-LD được tạo tự động để nhúng vào &lt;head&gt;:
                    </span>
                    <button
                      onClick={() => handleCopy(schemaJson, 'schema')}
                      className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded flex items-center gap-1 transition"
                    >
                      {copiedKey === 'schema' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-64 leading-relaxed">
                    {schemaJson}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SITEMAP.XML & ROBOTS.TXT */}
          {activeTab === 'sitemap' && (
            <div className="space-y-6">
              {/* Google Search Console Step-by-Step Guide */}
              <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Hướng Dẫn Đưa Website Lên Google Trong 24 Giờ
                  </h3>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                        1
                      </span>
                      <span>Xuất mã & Đưa lên Hosting</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Tải file HTML hoàn chỉnh và đặt kèm <code>sitemap.xml</code> và <code>robots.txt</code> vào thư mục gốc của trang web.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                        2
                      </span>
                      <span>Xác minh Search Console</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Truy cập Google Search Console, nhập tên miền và điền mã xác thực vào mục Thẻ Meta ở trên.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                        3
                      </span>
                      <span>Gửi Sitemap cho Google</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Nhập đường dẫn <code>sitemap.xml</code> vào mục Sitemaps trong Search Console để kích hoạt bọ quét index.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sitemap.xml */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Sitemap.xml</h4>
                    <p className="text-[11px] text-slate-400">
                      Sơ đồ trang web chuẩn XML để gửi trực tiếp cho Googlebot.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(sitemapXml, 'sitemap')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                    >
                      {copiedKey === 'sitemap' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleDownloadFile(sitemapXml, 'sitemap.xml', 'application/xml')
                      }
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải sitemap.xml</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-48 leading-relaxed">
                  {sitemapXml}
                </pre>
              </div>

              {/* Robots.txt */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Robots.txt</h4>
                    <p className="text-[11px] text-slate-400">
                      Tệp hướng dẫn các bot tìm kiếm cách quét dữ liệu trang web.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(robotsTxt, 'robots')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                    >
                      {copiedKey === 'robots' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadFile(robotsTxt, 'robots.txt', 'text/plain')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải robots.txt</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto max-h-36 leading-relaxed">
                  {robotsTxt}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
