import React, { useState, useEffect } from 'react';
import {
  Github,
  Folder,
  FileCode,
  FileText,
  Image as ImageIcon,
  FileJson,
  File,
  ChevronRight,
  ArrowLeft,
  Search,
  Check,
  Download,
  UploadCloud,
  Key,
  ExternalLink,
  RefreshCw,
  GitBranch,
  Sparkles,
  Layers,
  Code2,
  Copy,
  AlertCircle,
  FolderOpen,
  Eye,
  Plus,
} from 'lucide-react';
import {
  fetchRepoContents,
  fetchRepoBranches,
  fetchFileContentByPath,
  fetchUserRepositories,
  verifyGitHubUser,
  getSavedGitHubToken,
  saveGitHubToken,
  getSavedLastRepo,
  saveLastRepo,
  commitFileToGitHub,
  POPULAR_GITHUB_REPOSITORIES,
  GitHubRepoItem,
  GitHubRepoInfo,
  GitHubBranch,
  GitHubUser,
} from '../../services/githubService';
import { CanvasElement, CanvasSection, WebsiteProject } from '../../types';
import { parseHtmlToWebStudioSections } from '../../utils/htmlImporter';

interface GitHubPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  selectedElementId: string | null;
  onSelectImage?: (imageUrl: string) => void;
  onInsertElement?: (element: CanvasElement) => void;
  onInsertSection?: (section: CanvasSection) => void;
}

type FileFilterType = 'all' | 'images' | 'html' | 'json' | 'markdown';
type ActiveTab = 'browse' | 'my-repos' | 'push';

export const GitHubPickerModal: React.FC<GitHubPickerModalProps> = ({
  isOpen,
  onClose,
  project,
  setProject,
  selectedElementId,
  onSelectImage,
  onInsertElement,
  onInsertSection,
}) => {
  // Navigation & Repo state
  const [repoInput, setRepoInput] = useState<string>(getSavedLastRepo());
  const [currentOwner, setCurrentOwner] = useState<string>('tailwindtoolbox');
  const [currentRepo, setCurrentRepo] = useState<string>('Landing-Page');
  const [currentBranch, setCurrentBranch] = useState<string>('master');
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [items, setItems] = useState<GitHubRepoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & Search
  const [fileFilter, setFileFilter] = useState<FileFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('browse');

  // Selected file & preview
  const [selectedFile, setSelectedFile] = useState<GitHubRepoItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Authentication state
  const [tokenInput, setTokenInput] = useState<string>(getSavedGitHubToken());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [userRepos, setUserRepos] = useState<GitHubRepoInfo[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  // Push to GitHub state
  const [pushFileName, setPushFileName] = useState<string>('index.html');
  const [pushFormat, setPushFormat] = useState<'html' | 'json'>('html');
  const [pushCommitMessage, setPushCommitMessage] = useState<string>(`Cập nhật website ${project.name} từ WebStudio`);
  const [pushSuccessUrl, setPushSuccessUrl] = useState<string | null>(null);
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushError, setPushError] = useState<string | null>(null);

  // Initialize and check token
  useEffect(() => {
    const savedToken = getSavedGitHubToken();
    if (savedToken) {
      loadUserProfile(savedToken);
    }
  }, []);

  // Parse repo string (owner/repo)
  const parseRepoString = (str: string) => {
    let clean = str.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
    const parts = clean.split('/');
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  };

  // Load Repo Directory
  const loadDirectory = async (owner: string, repo: string, path: string, branch: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedFile(null);
    setFileContent('');

    try {
      const contents = await fetchRepoContents(owner, repo, path, branch);
      setItems(contents);
      setCurrentOwner(owner);
      setCurrentRepo(repo);
      setCurrentPath(path);
      saveLastRepo(`${owner}/${repo}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải thư mục từ GitHub');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Branches
  const loadBranches = async (owner: string, repo: string) => {
    try {
      const branchList = await fetchRepoBranches(owner, repo);
      setBranches(branchList);
      if (branchList.length > 0 && !branchList.some((b) => b.name === currentBranch)) {
        setCurrentBranch(branchList[0].name);
      }
    } catch {
      setBranches([{ name: 'main', commit: { sha: '', url: '' } }]);
    }
  };

  // Change active repository
  const handleLoadRepo = (ownerRepoStr?: string) => {
    const targetStr = ownerRepoStr || repoInput;
    const parsed = parseRepoString(targetStr);
    if (!parsed) {
      setErrorMessage('Vui lòng nhập định dạng: username/repository (ví dụ: facebook/react hoặc link GitHub)');
      return;
    }
    setRepoInput(`${parsed.owner}/${parsed.repo}`);
    loadBranches(parsed.owner, parsed.repo);
    loadDirectory(parsed.owner, parsed.repo, '', currentBranch);
  };

  // Load on modal open
  useEffect(() => {
    if (isOpen) {
      handleLoadRepo();
    }
  }, [isOpen]);

  // Load User Profile with Token
  const loadUserProfile = async (token: string) => {
    if (!token) {
      setGithubUser(null);
      setUserRepos([]);
      return;
    }
    setIsLoadingUser(true);
    try {
      const user = await verifyGitHubUser(token);
      setGithubUser(user);
      const repos = await fetchUserRepositories(token);
      setUserRepos(repos);
    } catch (err: any) {
      console.warn('GitHub auth error:', err);
      setGithubUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleSaveToken = async () => {
    saveGitHubToken(tokenInput);
    if (tokenInput.trim()) {
      await loadUserProfile(tokenInput.trim());
    } else {
      setGithubUser(null);
      setUserRepos([]);
    }
    setIsAuthModalOpen(false);
  };

  // Navigate folder
  const handleItemClick = async (item: GitHubRepoItem) => {
    if (item.type === 'dir' || item.type === 'tree') {
      loadDirectory(currentOwner, currentRepo, item.path, currentBranch);
    } else {
      setSelectedFile(item);
      loadSingleFileContent(item);
    }
  };

  // Load file content for preview
  const loadSingleFileContent = async (item: GitHubRepoItem) => {
    setIsLoadingContent(true);
    setFileContent('');
    try {
      const ext = item.name.split('.').pop()?.toLowerCase() || '';
      const isImage = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'ico'].includes(ext);

      if (isImage) {
        // Raw image URL is download_url or raw.githubusercontent.com
        const rawUrl =
          item.download_url ||
          `https://raw.githubusercontent.com/${currentOwner}/${currentRepo}/${currentBranch}/${item.path}`;
        setFileContent(rawUrl);
      } else {
        const data = await fetchFileContentByPath(currentOwner, currentRepo, item.path, currentBranch);
        setFileContent(data.content);
      }
    } catch (err: any) {
      setFileContent(`// Không thể tải nội dung file: ${err.message}`);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Breadcrumbs navigation
  const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      loadDirectory(currentOwner, currentRepo, '', currentBranch);
    } else {
      const newPath = pathParts.slice(0, index + 1).join('/');
      loadDirectory(currentOwner, currentRepo, newPath, currentBranch);
    }
  };

  // Filter Items
  const filteredItems = items.filter((item) => {
    // Search query filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (item.type === 'dir') return true;

    const ext = item.name.split('.').pop()?.toLowerCase() || '';
    if (fileFilter === 'images') {
      return ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'ico'].includes(ext);
    }
    if (fileFilter === 'html') {
      return ['html', 'htm', 'jsx', 'tsx'].includes(ext);
    }
    if (fileFilter === 'json') {
      return ['json', 'jsonld'].includes(ext);
    }
    if (fileFilter === 'markdown') {
      return ['md', 'markdown', 'txt'].includes(ext);
    }
    return true;
  });

  // Get raw file URL
  const getRawFileUrl = (item: GitHubRepoItem): string => {
    return (
      item.download_url ||
      `https://raw.githubusercontent.com/${currentOwner}/${currentRepo}/${currentBranch}/${item.path}`
    );
  };

  // Actions for files
  const handleUseAsImage = (imageUrl: string) => {
    if (onSelectImage) {
      onSelectImage(imageUrl);
    } else if (selectedElementId) {
      // Update selected element
      setProject((prev) => ({
        ...prev,
        sections: prev.sections.map((sec) => ({
          ...sec,
          elements: sec.elements.map((el) => {
            if (el.id === selectedElementId) {
              return { ...el, src: imageUrl };
            }
            return el;
          }),
        })),
      }));
    } else {
      // Insert new image element
      const newImgElement: CanvasElement = {
        id: `el-${Date.now()}`,
        type: 'image',
        src: imageUrl,
        alt: selectedFile?.name || 'GitHub Image',
        styles: {
          borderRadius: '1rem',
          boxShadow: 'lg',
          marginBottom: 20,
        },
      };
      if (onInsertElement) {
        onInsertElement(newImgElement);
      }
    }
    onClose();
  };

  const handleImportHtml = () => {
    if (!fileContent) return;
    try {
      const parsed = parseHtmlToWebStudioSections(fileContent, project.theme);
      if (parsed.sections.length > 0) {
        setProject((prev) => ({
          ...prev,
          name: parsed.title ? `[GitHub] ${parsed.title}` : prev.name,
          sections: [...parsed.sections],
          settings: {
            ...prev.settings,
            title: parsed.title || prev.settings.title,
            metaDescription: parsed.metaDescription || prev.settings.metaDescription,
          },
        }));
        onClose();
      }
    } catch (err: any) {
      alert(`Lỗi chuyển đổi mã HTML: ${err.message}`);
    }
  };

  const handleAppendHtmlSection = () => {
    if (!fileContent) return;
    try {
      const parsed = parseHtmlToWebStudioSections(fileContent, project.theme);
      if (parsed.sections.length > 0) {
        setProject((prev) => ({
          ...prev,
          sections: [...prev.sections, ...parsed.sections],
        }));
        onClose();
      }
    } catch (err: any) {
      alert(`Lỗi chèn khối HTML: ${err.message}`);
    }
  };

  const handleImportJson = () => {
    try {
      const data = JSON.parse(fileContent);
      if (data.sections && Array.isArray(data.sections)) {
        // It's a full WebStudio project
        setProject((prev) => ({
          ...prev,
          name: data.name || prev.name,
          theme: data.theme || prev.theme,
          sections: data.sections,
          settings: data.settings || prev.settings,
        }));
        onClose();
      } else {
        alert('File JSON này không chứa cấu trúc WebStudio sections. Hãy chọn file JSON dự án hợp lệ.');
      }
    } catch (err: any) {
      alert(`Lỗi cú pháp JSON: ${err.message}`);
    }
  };

  const handleInsertMarkdownText = () => {
    if (!fileContent) return;
    const newSection: CanvasSection = {
      id: `sec-${Date.now()}`,
      name: selectedFile?.name || 'Bài viết Markdown',
      category: 'features',
      layout: 'container',
      styles: {
        backgroundColor: project.theme.backgroundColor,
        paddingTop: 48,
        paddingBottom: 48,
      },
      elements: [
        {
          id: `el-${Date.now()}-h`,
          type: 'heading',
          tag: 'h2',
          content: selectedFile?.name.replace(/\.[^/.]+$/, '') || 'Tài liệu Markdown',
          styles: { fontSize: '3xl', fontWeight: 'bold', textColor: '#ffffff', marginBottom: 16 },
        },
        {
          id: `el-${Date.now()}-p`,
          type: 'paragraph',
          content: fileContent.slice(0, 1000),
          styles: { fontSize: 'base', textColor: '#94a3b8', marginBottom: 20 },
        },
      ],
    };
    if (onInsertSection) {
      onInsertSection(newSection);
    } else {
      setProject((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
      }));
    }
    onClose();
  };

  const handleApplyCustomCss = () => {
    if (!fileContent) return;
    setProject((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        customCss: (prev.settings.customCss || '') + '\n/* Imported from GitHub */\n' + fileContent,
      },
    }));
    alert('Đã thêm CSS từ GitHub vào Custom CSS của trang web!');
    onClose();
  };

  // Push current project to GitHub
  const handlePushToGitHub = async () => {
    const token = getSavedGitHubToken();
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsPushing(true);
    setPushError(null);
    setPushSuccessUrl(null);

    try {
      let contentToPush = '';
      if (pushFormat === 'json') {
        contentToPush = JSON.stringify(project, null, 2);
      } else {
        // Generate clean HTML
        contentToPush = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.settings.title || project.name}</title>
  <meta name="description" content="${project.settings.metaDescription || ''}">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${project.settings.customCss || ''}</style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased">
  <!-- Generated with WebStudio -->
  ${project.sections
    .map(
      (sec) => `
  <section class="py-16 px-4 max-w-7xl mx-auto">
    <div class="space-y-6">
      ${sec.elements
        .map((el) => {
          if (el.type === 'heading') return `<${el.tag || 'h2'} class="text-3xl font-bold">${el.content || ''}</${el.tag || 'h2'}>`;
          if (el.type === 'paragraph') return `<p class="text-slate-400 text-lg">${el.content || ''}</p>`;
          if (el.type === 'button') return `<a href="${el.href || '#'}" class="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">${el.content || 'Button'}</a>`;
          if (el.type === 'image') return `<img src="${el.src || ''}" alt="${el.alt || ''}" class="rounded-xl shadow-lg w-full max-w-2xl mx-auto" />`;
          return '';
        })
        .join('\n      ')}
    </div>
  </section>`
    )
    .join('\n')}
</body>
</html>`;
      }

      const res = await commitFileToGitHub({
        owner: currentOwner,
        repo: currentRepo,
        path: pushFileName,
        content: contentToPush,
        message: pushCommitMessage,
        branch: currentBranch,
        token: token,
      });

      setPushSuccessUrl(res.fileUrl);
      // Reload directory to show new file
      loadDirectory(currentOwner, currentRepo, currentPath, currentBranch);
    } catch (err: any) {
      setPushError(err.message || 'Lỗi không thể đẩy mã lên GitHub.');
    } finally {
      setIsPushing(false);
    }
  };

  if (!isOpen) return null;

  const getFileIcon = (fileName: string, isDir: boolean) => {
    if (isDir) return <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'ico'].includes(ext)) {
      return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
    if (['html', 'htm'].includes(ext)) {
      return <FileCode className="w-4 h-4 text-orange-400" />;
    }
    if (['json'].includes(ext)) {
      return <FileJson className="w-4 h-4 text-yellow-400" />;
    }
    if (['md', 'txt'].includes(ext)) {
      return <FileText className="w-4 h-4 text-cyan-400" />;
    }
    if (['css', 'js', 'ts', 'tsx', 'jsx'].includes(ext)) {
      return <Code2 className="w-4 h-4 text-indigo-400" />;
    }
    return <File className="w-4 h-4 text-slate-400" />;
  };

  const isSelectedFileImage =
    selectedFile &&
    ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'ico'].includes(
      selectedFile.name.split('.').pop()?.toLowerCase() || ''
    );

  const isSelectedFileHtml =
    selectedFile && ['html', 'htm'].includes(selectedFile.name.split('.').pop()?.toLowerCase() || '');

  const isSelectedFileJson =
    selectedFile && ['json'].includes(selectedFile.name.split('.').pop()?.toLowerCase() || '');

  const isSelectedFileMarkdown =
    selectedFile && ['md', 'markdown', 'txt'].includes(selectedFile.name.split('.').pop()?.toLowerCase() || '');

  const isSelectedFileCss =
    selectedFile && ['css'].includes(selectedFile.name.split('.').pop()?.toLowerCase() || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[88vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-inner">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Kết Nối & Chọn Tệp Từ GitHub
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 font-medium">
                  Trực tiếp REST API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Duyệt kho lưu trữ, chọn ảnh, nhập giao diện HTML & cấu trúc dự án từ GitHub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auth / Account Status */}
            {githubUser ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg">
                <img src={githubUser.avatar_url} alt={githubUser.login} className="w-5 h-5 rounded-full" />
                <span className="text-xs font-medium text-slate-200">{githubUser.login}</span>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[11px] text-indigo-400 hover:underline ml-1"
                >
                  Quản lý
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                title="Đăng nhập bằng GitHub Token để truy cập kho riêng tư hoặc đẩy mã"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Nhập Token (PAT)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Top Control Bar: Repo Input & Presets */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          {/* Main Repo URL or Path Input */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3 text-slate-400 font-mono text-xs flex items-center gap-1 pointer-events-none">
                <Github className="w-3.5 h-3.5 text-slate-500" />
                github.com/
              </span>
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLoadRepo();
                }}
                placeholder="username/repository hoặc link GitHub"
                className="w-full pl-28 pr-20 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={() => handleLoadRepo()}
                disabled={isLoading}
                className="absolute right-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
              >
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Mở Repo'}
              </button>
            </div>

            {/* Branch Selector */}
            {branches.length > 0 && (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={currentBranch}
                  onChange={(e) => {
                    setCurrentBranch(e.target.value);
                    loadDirectory(currentOwner, currentRepo, currentPath, e.target.value);
                  }}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  {branches.map((b) => (
                    <option key={b.name} value={b.name} className="bg-slate-900 text-white">
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'browse' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Duyệt File
            </button>
            {githubUser && (
              <button
                onClick={() => setActiveTab('my-repos')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  activeTab === 'my-repos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kho Của Tôi ({userRepos.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab('push')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                activeTab === 'push' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Đẩy Lên Repo</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Ribbon */}
        {activeTab === 'browse' && (
          <div className="px-5 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Gợi ý mẫu:
            </span>
            {POPULAR_GITHUB_REPOSITORIES.map((preset) => (
              <button
                key={`${preset.owner}/${preset.repo}`}
                onClick={() => handleLoadRepo(`${preset.owner}/${preset.repo}`)}
                className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition flex items-center gap-1.5 ${
                  currentOwner === preset.owner && currentRepo === preset.repo
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-600 font-semibold'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({preset.category})</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* TAB 1: FILE BROWSER */}
          {activeTab === 'browse' && (
            <>
              {/* Left Column: File Explorer & Breadcrumb */}
              <div className="w-full md:w-1/2 border-r border-slate-800 flex flex-col bg-slate-900/40">
                {/* Search & Type Filters */}
                <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm file theo tên..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                    {(
                      [
                        { id: 'all', label: 'Tất cả' },
                        { id: 'images', label: 'Ảnh (.png, .svg...)' },
                        { id: 'html', label: 'Web (.html)' },
                        { id: 'json', label: 'Dữ liệu (.json)' },
                        { id: 'markdown', label: 'Tài liệu (.md)' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFileFilter(f.id)}
                        className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
                          fileFilter === f.id
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breadcrumb Path Navigation */}
                <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-1 text-xs text-slate-400 overflow-x-auto font-mono">
                  <button
                    onClick={() => handleBreadcrumbClick(-1)}
                    className="hover:text-indigo-400 hover:underline flex items-center gap-1 font-semibold text-slate-300"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    {currentRepo}
                  </button>
                  {pathParts.map((part, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                      <button
                        onClick={() => handleBreadcrumbClick(idx)}
                        className={`hover:text-indigo-400 hover:underline truncate max-w-[120px] ${
                          idx === pathParts.length - 1 ? 'text-indigo-300 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {part}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                  {errorMessage && (
                    <div className="p-4 m-2 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-1">Không thể tải kho lưu trữ</div>
                        <div>{errorMessage}</div>
                        <div className="mt-2 text-slate-400 text-[11px]">
                          Mẹo: Hãy kiểm tra lại tên repository (ví dụ: <code className="text-white">username/repo</code>) hoặc nhập Personal Access Token nếu đây là repository riêng tư.
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-xs gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                      <span>Đang duyệt cây thư mục từ GitHub...</span>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      Không tìm thấy tệp hoặc thư mục nào phù hợp.
                    </div>
                  ) : (
                    <>
                      {/* Back button if inside subfolder */}
                      {currentPath && (
                        <button
                          onClick={() => {
                            const parentPath = pathParts.slice(0, -1).join('/');
                            loadDirectory(currentOwner, currentRepo, parentPath, currentBranch);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/80 transition"
                        >
                          <ArrowLeft className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">.. (Thư mục trước)</span>
                        </button>
                      )}

                      {filteredItems.map((item) => {
                        const isDir = item.type === 'dir' || item.type === 'tree';
                        const isSelected = selectedFile?.path === item.path;

                        return (
                          <div
                            key={item.path}
                            onClick={() => handleItemClick(item)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition select-none ${
                              isSelected
                                ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                                : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {getFileIcon(item.name, isDir)}
                              <span className={`truncate font-mono ${isDir ? 'font-semibold text-slate-200' : 'text-slate-300'}`}>
                                {item.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0 ml-2">
                              {item.size ? (
                                <span>{(item.size / 1024).toFixed(1)} KB</span>
                              ) : isDir ? (
                                <span className="text-slate-500">Thư mục</span>
                              ) : null}
                              {isDir && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: File Preview & Action Dock */}
              <div className="hidden md:flex md:w-1/2 flex-col bg-slate-950/80">
                {selectedFile ? (
                  <div className="h-full flex flex-col">
                    {/* Selected File Header */}
                    <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {getFileIcon(selectedFile.name, false)}
                        <div className="min-w-0">
                          <div className="font-mono text-xs font-bold text-white truncate">
                            {selectedFile.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            {selectedFile.path}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Copy URL */}
                        <button
                          onClick={() => {
                            const url = getRawFileUrl(selectedFile);
                            navigator.clipboard.writeText(url);
                            setCopiedUrl(true);
                            setTimeout(() => setCopiedUrl(false), 2000);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
                          title="Sao chép liên kết tệp"
                        >
                          {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <a
                          href={selectedFile.html_url || `https://github.com/${currentOwner}/${currentRepo}/blob/${currentBranch}/${selectedFile.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
                          title="Xem trên GitHub"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col items-center justify-center">
                      {isLoadingContent ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                          <span>Đang tải nội dung tệp...</span>
                        </div>
                      ) : isSelectedFileImage ? (
                        <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                          <div className="max-h-72 max-w-full p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                            <img
                              src={fileContent || getRawFileUrl(selectedFile)}
                              alt={selectedFile.name}
                              className="max-h-64 object-contain rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="text-center text-xs text-slate-400">
                            Định dạng ảnh: <span className="font-mono text-slate-200">{selectedFile.name.split('.').pop()?.toUpperCase()}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full">
                          <pre className="w-full h-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                            {fileContent || '// Tệp trống hoặc không thể xem trước trực tiếp.'}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Matrix */}
                    <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-end gap-2">
                      {/* Image Action */}
                      {isSelectedFileImage && (
                        <>
                          <button
                            onClick={() => handleUseAsImage(fileContent || getRawFileUrl(selectedFile))}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
                          >
                            <Check className="w-4 h-4" />
                            <span>
                              {selectedElementId ? 'Cập Nhật Ảnh Phần Tử Đang Chọn' : 'Chọn Làm Ảnh Website'}
                            </span>
                          </button>
                        </>
                      )}

                      {/* HTML Actions */}
                      {isSelectedFileHtml && (
                        <>
                          <button
                            onClick={handleAppendHtmlSection}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <Plus className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Chèn Vào Cuối Trang</span>
                          </button>

                          <button
                            onClick={handleImportHtml}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
                          >
                            <Layers className="w-4 h-4" />
                            <span>Nhập Làm Toàn Bộ Trang Website</span>
                          </button>
                        </>
                      )}

                      {/* JSON Actions */}
                      {isSelectedFileJson && (
                        <button
                          onClick={handleImportJson}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-yellow-600/20"
                        >
                          <FileJson className="w-4 h-4" />
                          <span>Nhập Dự Án WebStudio (JSON)</span>
                        </button>
                      )}

                      {/* Markdown Actions */}
                      {isSelectedFileMarkdown && (
                        <button
                          onClick={handleInsertMarkdownText}
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-cyan-600/20"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Chèn Khối Văn Bản Vào Trang</span>
                        </button>
                      )}

                      {/* CSS Actions */}
                      {isSelectedFileCss && (
                        <button
                          onClick={handleApplyCustomCss}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Code2 className="w-4 h-4" />
                          <span>Áp Dụng Làm Custom CSS</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                      <FileCode className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-400 mb-1">
                        Chưa chọn tệp nào
                      </div>
                      <p className="max-w-xs text-slate-500">
                        Nhấp vào bất kỳ tệp ảnh, tệp mã HTML, JSON hoặc tài liệu Markdown bên trái để xem trước và thực hiện thao tác.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: MY REPOSITORIES */}
          {activeTab === 'my-repos' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Kho Lưu Trữ GitHub Của Bạn</h3>
                    <p className="text-xs text-slate-400">Chọn một repository để bắt đầu duyệt tệp hoặc lưu trang web.</p>
                  </div>
                  <button
                    onClick={() => loadUserProfile(getSavedGitHubToken())}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs flex items-center gap-1.5 px-3"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userRepos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => {
                        handleLoadRepo(repo.full_name);
                        setActiveTab('browse');
                      }}
                      className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-xl cursor-pointer transition hover:shadow-lg group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-semibold text-sm text-white group-hover:text-indigo-400 font-mono truncate">
                          {repo.name}
                        </div>
                        {repo.private ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/50">
                            Riêng tư (Private)
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Công khai
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {repo.description || 'Không có mô tả'}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Nhánh mặc định: {repo.default_branch}</span>
                        <span className="text-indigo-400 group-hover:underline">Duyệt tệp →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PUSH / EXPORT TO GITHUB */}
          {activeTab === 'push' && (
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex items-center justify-center">
              <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Đẩy Trang Web Lên Kho GitHub</h3>
                    <p className="text-xs text-slate-400">
                      Lưu và xuất bản trực tiếp mã nguồn trang web vào repository <span className="font-mono text-indigo-400">{currentOwner}/{currentRepo}</span>.
                    </p>
                  </div>
                </div>

                {pushSuccessUrl && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Đẩy file lên GitHub thành công!</span>
                    </div>
                    <a
                      href={pushSuccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-emerald-200 hover:text-white"
                    >
                      Mở trên GitHub
                    </a>
                  </div>
                )}

                {pushError && (
                  <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{pushError}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Tên file trên GitHub:</label>
                    <input
                      type="text"
                      value={pushFileName}
                      onChange={(e) => setPushFileName(e.target.value)}
                      placeholder="index.html hoặc website-project.json"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Định dạng xuất:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPushFormat('html');
                          if (pushFileName.endsWith('.json')) setPushFileName('index.html');
                        }}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                          pushFormat === 'html'
                            ? 'bg-indigo-950/80 border-indigo-600 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FileCode className="w-4 h-4 text-orange-400" />
                        <div>
                          <div>Mã HTML & Tailwind</div>
                          <div className="text-[10px] text-slate-500">Sẵn sàng chạy web</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPushFormat('json');
                          if (pushFileName.endsWith('.html')) setPushFileName('webstudio-project.json');
                        }}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                          pushFormat === 'json'
                            ? 'bg-indigo-950/80 border-indigo-600 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FileJson className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div>WebStudio Project</div>
                          <div className="text-[10px] text-slate-500">Dễ dàng chỉnh sửa lại</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Lời nhắn Commit (Commit Message):</label>
                    <input
                      type="text"
                      value={pushCommitMessage}
                      onChange={(e) => setPushCommitMessage(e.target.value)}
                      placeholder="Cập nhật website từ WebStudio"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePushToGitHub}
                    disabled={isPushing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
                  >
                    {isPushing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang ghi file lên GitHub...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Xác Nhận Đẩy Lên Nhánh {currentBranch}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GitHub Token / Authentication Modal Overlay */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Cấu Hình GitHub Token (PAT)</h3>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Nhập <strong>GitHub Personal Access Token (PAT)</strong> để tăng giới hạn API rate limit, duyệt kho lưu trữ riêng tư (Private repositories) và có thể commit lưu file trực tiếp lên GitHub.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Personal Access Token (classic hoặc fine-grained):
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Token được lưu cục bộ an toàn trong trình duyệt.</span>
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Tạo token mới <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setTokenInput('');
                  saveGitHubToken('');
                  setGithubUser(null);
                  setUserRepos([]);
                  setIsAuthModalOpen(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Xóa Token
              </button>
              <button
                onClick={handleSaveToken}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
              >
                Lưu Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
