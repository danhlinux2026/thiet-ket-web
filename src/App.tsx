import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  DeviceMode,
  SidebarTab,
  WebsiteProject,
  WebsiteTheme,
  TemplateDefinition,
  CanvasSection,
  CanvasElement,
  AppVersion,
} from './types';
import { TEMPLATES_CATALOG } from './data/templates';
import { THEME_PRESETS } from './data/themes';
import { TopNavbar } from './components/TopNavbar';
import { SidebarContainer } from './components/Sidebar/SidebarContainer';
import { CanvasArea } from './components/Canvas/CanvasArea';
import { InspectorPanel } from './components/Inspector/InspectorPanel';
import { TemplateLibraryModal } from './components/Modals/TemplateLibraryModal';
import { ExportCodeModal } from './components/Modals/ExportCodeModal';
import { PreviewModal } from './components/Modals/PreviewModal';
import { ImagePickerModal } from './components/Modals/ImagePickerModal';
import { IconPickerModal } from './components/Modals/IconPickerModal';
import { GitHubPickerModal } from './components/Modals/GitHubPickerModal';
import { SEOOptimizerModal } from './components/Modals/SEOOptimizerModal';
import { FileOpenModal } from './components/Modals/FileOpenModal';
import { AppVersionsDrawer } from './components/Versions/AppVersionsDrawer';
import { createVersionSnapshot } from './services/versionService';

const STORAGE_KEY = 'webstudio_project_autosave_v1';

export default function App() {
  // Initial project state
  const initialProject: WebsiteProject = {
    id: 'proj-1',
    name: 'NexusAI - Nền Tảng AI Thông Minh',
    description: 'Trang giới thiệu sản phẩm công nghệ AI hiện đại với bảng giá và biểu mẫu đăng ký.',
    theme: TEMPLATES_CATALOG[0].theme,
    sections: TEMPLATES_CATALOG[0].sections,
    settings: {
      title: 'NexusAI - Tự Động Hóa Với Trí Tuệ Nhân Tạo',
      metaDescription: 'Khám phá nền tảng AI đột phá giúp tăng 10x năng suất làm việc cho doanh nghiệp.',
      customCss: '',
    },
    lastModified: Date.now(),
  };

  const [project, setProject] = useState<WebsiteProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sections && parsed.theme) return parsed;
      }
    } catch (e) {
      console.warn('Could not load saved project from localStorage', e);
    }
    return initialProject;
  });

  // Undo / Redo History Stack
  const [history, setHistory] = useState<WebsiteProject[]>([initialProject]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  // UI States
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('templates');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  // Modals
  const [isFileOpenModalOpen, setIsFileOpenModalOpen] = useState(false);
  const [fileOpenInitialTab, setFileOpenInitialTab] = useState<'html' | 'json' | 'css' | 'media' | 'new'>('html');
  const [fileOpenInitialContent, setFileOpenInitialContent] = useState<{ type: 'html' | 'json' | 'css' | 'image'; name: string; content: string } | undefined>(undefined);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isVersionsDrawerOpen, setIsVersionsDrawerOpen] = useState(false);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isImagePickerModalOpen, setIsImagePickerModalOpen] = useState(false);
  const [isIconPickerModalOpen, setIsIconPickerModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [activeElementForPicker, setActiveElementForPicker] = useState<string | null>(null);

  // Auto-save to LocalStorage
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
        setIsSaved(true);
      } catch (err) {
        console.error('Failed to save project to localStorage', err);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [project]);

  // History tracking on changes
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      if (JSON.stringify(updated[updated.length - 1]) !== JSON.stringify(project)) {
        return [...updated, project];
      }
      return prev;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [project]);

  // Undo & Redo Handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevProject = history[historyIndex - 1];
      setProject(prevProject);
      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextProject = history[historyIndex + 1];
      setProject(nextProject);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [history, historyIndex]);

  // Handle external file dropped onto canvas or window
  const handleFileDropped = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    if (ext === 'html' || ext === 'htm' || ext === 'txt') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileOpenInitialTab('html');
        setFileOpenInitialContent({ type: 'html', name: file.name, content: text });
        setIsFileOpenModalOpen(true);
      };
      reader.readAsText(file);
    } else if (ext === 'json') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileOpenInitialTab('json');
        setFileOpenInitialContent({ type: 'json', name: file.name, content: text });
        setIsFileOpenModalOpen(true);
      };
      reader.readAsText(file);
    } else if (ext === 'css') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileOpenInitialTab('css');
        setFileOpenInitialContent({ type: 'css', name: file.name, content: text });
        setIsFileOpenModalOpen(true);
      };
      reader.readAsText(file);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext || '')) {
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFileOpenInitialTab('media');
        setFileOpenInitialContent({ type: 'image', name: file.name, content: dataUrl });
        setIsFileOpenModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setIsFileOpenModalOpen(true);
    }
  }, []);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+O, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setFileOpenInitialTab('html');
        setFileOpenInitialContent(undefined);
        setIsFileOpenModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Apply Template Action
  const handleApplyTemplate = (template: TemplateDefinition, mode: 'replace' | 'append') => {
    // Save version snapshot before applying template so user can rollback anytime
    createVersionSnapshot(project, `Trước khi áp dụng mẫu: ${template.name}`, {
      tags: ['Mẫu'],
    });

    if (mode === 'replace') {
      const clonedSections = template.sections.map((sec) => ({
        ...sec,
        id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        elements: sec.elements.map((el) => ({
          ...el,
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          items: el.items?.map((it) => ({
            ...it,
            id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          })),
        })),
      }));

      setProject({
        ...project,
        name: template.name,
        description: template.description,
        theme: { ...template.theme },
        sections: clonedSections,
        settings: {
          ...project.settings,
          title: template.name,
          metaDescription: template.description,
          ...(template.settings || {}),
        },
        lastModified: Date.now(),
      });
      setSelectedSectionId(null);
      setSelectedElementId(null);
    } else {
      // Append sections
      const newSections = template.sections.map((sec) => ({
        ...sec,
        id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        elements: sec.elements.map((el) => ({
          ...el,
          id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          items: el.items?.map((it) => ({
            ...it,
            id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          })),
        })),
      }));

      setProject((prev) => ({
        ...prev,
        sections: [...prev.sections, ...newSections],
      }));
    }
  };

  // Restore Version Action
  const handleRestoreVersion = (version: AppVersion) => {
    if (version.projectSnapshot) {
      setProject({
        ...version.projectSnapshot,
        lastModified: Date.now(),
      });
      setSelectedSectionId(null);
      setSelectedElementId(null);
    }
  };

  // Add Section from catalog
  const handleAddSection = (section: CanvasSection) => {
    setProject((prev) => ({
      ...prev,
      sections: [...prev.sections, section],
    }));
    setSelectedSectionId(section.id);
  };

  // Add Element from catalog to current selected section (or last section)
  const handleAddElement = (element: CanvasElement) => {
    if (project.sections.length === 0) {
      // Create a default container section first
      const newSection: CanvasSection = {
        id: `sec-${Date.now()}`,
        name: 'Khối Nội Dung Mới',
        category: 'features',
        layout: 'container',
        styles: { backgroundColor: project.theme.backgroundColor, paddingTop: 60, paddingBottom: 60 },
        elements: [element],
      };
      setProject((prev) => ({
        ...prev,
        sections: [newSection],
      }));
      setSelectedSectionId(newSection.id);
      setSelectedElementId(element.id);
      return;
    }

    const targetSecId = selectedSectionId || project.sections[project.sections.length - 1].id;
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === targetSecId ? { ...sec, elements: [...sec.elements, element] } : sec
      ),
    }));
    setSelectedSectionId(targetSecId);
    setSelectedElementId(element.id);
  };

  // Layers Actions
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.sections.length) return;
    const newSections = [...project.sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIdx, 0, moved);
    setProject((prev) => ({ ...prev, sections: newSections }));
  };

  const handleToggleHideSection = (id: string) => {
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === id ? { ...sec, hidden: !sec.hidden } : sec
      ),
    }));
  };

  const handleDuplicateSection = (id: string) => {
    const origIndex = project.sections.findIndex((s) => s.id === id);
    if (origIndex === -1) return;
    const orig = project.sections[origIndex];
    const duplicated: CanvasSection = {
      ...orig,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${orig.name} (Bản sao)`,
      elements: orig.elements.map((el) => ({
        ...el,
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        items: el.items?.map((it) => ({
          ...it,
          id: `it-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        })),
      })),
    };
    const newSections = [...project.sections];
    newSections.splice(origIndex + 1, 0, duplicated);
    setProject((prev) => ({ ...prev, sections: newSections }));
  };

  const handleDeleteSection = (id: string) => {
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
      setSelectedElementId(null);
    }
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ nội dung trên trang này?')) {
      setProject((prev) => ({
        ...prev,
        sections: [],
      }));
      setSelectedSectionId(null);
      setSelectedElementId(null);
    }
  };

  // Image & Icon Picker Triggers
  const handleOpenImagePickerForElement = (elId: string) => {
    setActiveElementForPicker(elId);
    setIsImagePickerModalOpen(true);
  };

  const handleSelectImageForActiveElement = (url: string, alt?: string) => {
    if (!activeElementForPicker) return;
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => ({
        ...sec,
        elements: sec.elements.map((el) =>
          el.id === activeElementForPicker
            ? { ...el, src: url, alt: alt || el.alt }
            : el
        ),
      })),
    }));
  };

  const handleOpenIconPickerForElement = (elId: string) => {
    setActiveElementForPicker(elId);
    setIsIconPickerModalOpen(true);
  };

  const handleSelectIconForActiveElement = (iconName: string) => {
    if (!activeElementForPicker) return;
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => ({
        ...sec,
        elements: sec.elements.map((el) =>
          el.id === activeElementForPicker ? { ...el, iconName } : el
        ),
      })),
    }));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Navigation Bar */}
      <TopNavbar
        project={project}
        setProject={setProject}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenFileModal={() => {
          setFileOpenInitialTab('html');
          setFileOpenInitialContent(undefined);
          setIsFileOpenModalOpen(true);
        }}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenVersions={() => setIsVersionsDrawerOpen(true)}
        onOpenSEO={() => setIsSEOModalOpen(true)}
        onOpenTheme={() => {
          setActiveSidebarTab('theme');
          setIsSidebarOpen(true);
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenPreview={() => setIsPreviewModalOpen(true)}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
        onClearCanvas={handleClearCanvas}
        isSaved={isSaved}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Templates, Blocks, Elements, Layers, Themes, Settings) */}
        <SidebarContainer
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          project={project}
          setProject={setProject}
          onApplyTemplate={handleApplyTemplate}
          onPreviewTemplate={(tpl) => handleApplyTemplate(tpl, 'replace')}
          onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
          onOpenSEOModal={() => setIsSEOModalOpen(true)}
          onAddSection={handleAddSection}
          onAddElement={handleAddElement}
          selectedSectionId={selectedSectionId}
          onSelectSection={(id) => {
            setSelectedSectionId(id);
            setSelectedElementId(null);
          }}
          onMoveSection={handleMoveSection}
          onToggleHideSection={handleToggleHideSection}
          onDuplicateSection={handleDuplicateSection}
          onDeleteSection={handleDeleteSection}
          onUpdateTheme={(newTheme) => setProject((prev) => ({ ...prev, theme: newTheme }))}
          onOpenFullGitHubPicker={() => setIsGitHubModalOpen(true)}
          onQuickLoadRepo={(repo) => {
            setIsGitHubModalOpen(true);
          }}
        />

        {/* Center Live Canvas Area */}
        <CanvasArea
          project={project}
          setProject={setProject}
          deviceMode={deviceMode}
          selectedSectionId={selectedSectionId}
          selectedElementId={selectedElementId}
          onSelectSection={setSelectedSectionId}
          onSelectElement={setSelectedElementId}
          onOpenTemplates={() => setIsTemplatesModalOpen(true)}
          onOpenBlocks={() => {
            setActiveSidebarTab('blocks');
            setIsSidebarOpen(true);
          }}
          onOpenFileModal={() => {
            setFileOpenInitialTab('html');
            setFileOpenInitialContent(undefined);
            setIsFileOpenModalOpen(true);
          }}
          onFileDropped={handleFileDropped}
          onOpenImagePickerForElement={handleOpenImagePickerForElement}
          onOpenIconPickerForElement={handleOpenIconPickerForElement}
        />

        {/* Right Inspector & Style Panel */}
        <InspectorPanel
          project={project}
          setProject={setProject}
          selectedSectionId={selectedSectionId}
          selectedElementId={selectedElementId}
          onClose={() => {
            setSelectedSectionId(null);
            setSelectedElementId(null);
          }}
          onOpenImagePickerForSelected={
            selectedElementId
              ? () => handleOpenImagePickerForElement(selectedElementId)
              : undefined
          }
        />
      </div>

      {/* Mobile Bottom Quick Navigation Bar (Visible on Mobile/Tablet < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-1.5 flex items-center justify-around text-slate-400 select-none shadow-2xl">
        <button
          onClick={() => {
            setActiveSidebarTab('templates');
            setIsSidebarOpen(!isSidebarOpen);
          }}
          className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            isSidebarOpen ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 mb-0.5"></span>
          <span>Kho Mẫu</span>
        </button>

        <button
          onClick={() => {
            setActiveSidebarTab('blocks');
            setIsSidebarOpen(true);
          }}
          className="flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-medium hover:text-slate-200 transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-400 mb-0.5"></span>
          <span>Khối Sẵn</span>
        </button>

        <button
          onClick={() => {
            setIsSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-bold text-indigo-400 transition cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mb-0.5"></span>
          <span>Xem Canvas</span>
        </button>

        <button
          onClick={() => setIsPreviewModalOpen(true)}
          className="flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-medium text-amber-400 hover:text-amber-300 transition cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 mb-0.5"></span>
          <span>Xem Trực Tiếp</span>
        </button>
      </div>

      {/* Modals */}
      {/* Manual File Open / Import Modal */}
      <FileOpenModal
        isOpen={isFileOpenModalOpen}
        onClose={() => {
          setIsFileOpenModalOpen(false);
          setFileOpenInitialContent(undefined);
        }}
        project={project}
        setProject={setProject}
        initialTab={fileOpenInitialTab}
        initialContent={fileOpenInitialContent}
      />

      <TemplateLibraryModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onApplyTemplate={handleApplyTemplate}
        currentProject={project}
      />

      {/* Google AI Studio Style Version Management Drawer */}
      <AppVersionsDrawer
        isOpen={isVersionsDrawerOpen}
        onClose={() => setIsVersionsDrawerOpen(false)}
        currentProject={project}
        onRestoreVersion={handleRestoreVersion}
      />

      {/* SEO & Google Search Suite Modal */}
      <SEOOptimizerModal
        isOpen={isSEOModalOpen}
        onClose={() => setIsSEOModalOpen(false)}
        project={project}
        setProject={setProject}
      />

      <ExportCodeModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        setProject={setProject}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        project={project}
      />

      <ImagePickerModal
        isOpen={isImagePickerModalOpen}
        onClose={() => {
          setIsImagePickerModalOpen(false);
          setActiveElementForPicker(null);
        }}
        onSelectImage={handleSelectImageForActiveElement}
        onOpenGitHubPicker={() => setIsGitHubModalOpen(true)}
      />

      <IconPickerModal
        isOpen={isIconPickerModalOpen}
        onClose={() => {
          setIsIconPickerModalOpen(false);
          setActiveElementForPicker(null);
        }}
        onSelectIcon={handleSelectIconForActiveElement}
      />

      <GitHubPickerModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        project={project}
        setProject={setProject}
        selectedElementId={selectedElementId}
        onSelectImage={(url) => {
          if (selectedElementId) {
            handleSelectImageForActiveElement(url);
          } else {
            handleAddElement({
              id: `el-${Date.now()}`,
              type: 'image',
              src: url,
              alt: 'GitHub Asset',
              styles: { borderRadius: '1rem', marginBottom: 20 },
            });
          }
        }}
        onInsertElement={handleAddElement}
        onInsertSection={handleAddSection}
      />
    </div>
  );
}
