import React from 'react';
import {
  Sparkles,
  LayoutGrid,
  PlusCircle,
  Layers,
  Palette,
  Settings,
  Github,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  SidebarTab,
  TemplateDefinition,
  CanvasSection,
  CanvasElement,
  WebsiteProject,
  WebsiteTheme,
} from '../../types';
import { TemplatesTab } from './TemplatesTab';
import { BlocksTab } from './BlocksTab';
import { ElementsTab } from './ElementsTab';
import { LayersTab } from './LayersTab';
import { ThemeTab } from './ThemeTab';
import { SettingsTab } from './SettingsTab';
import { GitHubTab } from './GitHubTab';

interface SidebarContainerProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  project: WebsiteProject;
  setProject: React.Dispatch<React.SetStateAction<WebsiteProject>>;
  onApplyTemplate: (template: TemplateDefinition, mode: 'replace' | 'append') => void;
  onPreviewTemplate: (template: TemplateDefinition) => void;
  onOpenTemplatesModal?: () => void;
  onOpenSEOModal?: () => void;
  onAddSection: (section: CanvasSection) => void;
  onAddElement: (element: CanvasElement) => void;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onToggleHideSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onUpdateTheme: (theme: WebsiteTheme) => void;
  onOpenFullGitHubPicker: () => void;
  onQuickLoadRepo: (repoFullName: string) => void;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  project,
  setProject,
  onApplyTemplate,
  onPreviewTemplate,
  onOpenTemplatesModal,
  onOpenSEOModal,
  onAddSection,
  onAddElement,
  selectedSectionId,
  onSelectSection,
  onMoveSection,
  onToggleHideSection,
  onDuplicateSection,
  onDeleteSection,
  onUpdateTheme,
  onOpenFullGitHubPicker,
  onQuickLoadRepo,
}) => {
  const tabs = [
    { id: 'templates' as SidebarTab, label: 'Kho Mẫu', icon: Sparkles, badge: 'Hot' },
    { id: 'blocks' as SidebarTab, label: 'Khối Sẵn', icon: LayoutGrid },
    { id: 'elements' as SidebarTab, label: 'Phần Tử', icon: PlusCircle },
    { id: 'github' as SidebarTab, label: 'GitHub', icon: Github, badge: 'New' },
    { id: 'layers' as SidebarTab, label: 'Cấu Trúc', icon: Layers, count: project.sections.length },
    { id: 'theme' as SidebarTab, label: 'Màu & Font', icon: Palette },
    { id: 'settings' as SidebarTab, label: 'Cài Đặt', icon: Settings },
  ];

  return (
    <div className="flex h-full select-none z-20 shrink-0">
      {/* Icon Navigation Rail */}
      <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 justify-between shrink-0">
        <div className="flex flex-col items-center gap-1.5 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && isOpen;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (activeTab === tab.id && isOpen) {
                    setIsOpen(false);
                  } else {
                    setActiveTab(tab.id);
                    setIsOpen(true);
                  }
                }}
                className={`w-12 py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition relative group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={tab.label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-medium leading-tight text-center truncate w-full px-1">
                  {tab.label}
                </span>

                {/* Optional Badge */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[8px] px-1 rounded-full shadow-sm">
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && tab.count > 0 && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 bg-slate-700 text-slate-300 font-bold text-[8px] px-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={isOpen ? 'Thu gọn bảng' : 'Mở rộng bảng'}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Sidebar Drawer */}
      {isOpen && (
        <aside className="w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden shrink-0 shadow-xl">
          {/* Header Title */}
          <div className="h-11 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              {tabs.find((t) => t.id === activeTab)?.label}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs p-1 hover:bg-slate-800 rounded transition"
            >
              ✕
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'templates' && (
              <TemplatesTab
                onApplyTemplate={onApplyTemplate}
                onPreviewTemplate={onPreviewTemplate}
                project={project}
                onOpenTemplatesModal={onOpenTemplatesModal}
              />
            )}
            {activeTab === 'blocks' && <BlocksTab onAddSection={onAddSection} />}
            {activeTab === 'elements' && <ElementsTab onAddElement={onAddElement} />}
            {activeTab === 'github' && (
              <GitHubTab
                onOpenFullGitHubPicker={onOpenFullGitHubPicker}
                onQuickLoadRepo={onQuickLoadRepo}
              />
            )}
            {activeTab === 'layers' && (
              <LayersTab
                sections={project.sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={onSelectSection}
                onMoveSection={onMoveSection}
                onToggleHideSection={onToggleHideSection}
                onDuplicateSection={onDuplicateSection}
                onDeleteSection={onDeleteSection}
              />
            )}
            {activeTab === 'theme' && (
              <ThemeTab currentTheme={project.theme} onUpdateTheme={onUpdateTheme} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                project={project}
                setProject={setProject}
                onOpenSEOModal={onOpenSEOModal}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
