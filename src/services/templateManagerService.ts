import { TemplateDefinition, TemplateCategory, WebsiteProject } from '../types';
import { TEMPLATES_CATALOG } from '../data/templates';

const CUSTOM_TEMPLATES_STORAGE_KEY = 'webstudio_custom_templates_v1';

export function getStoredCustomTemplates(): TemplateDefinition[] {
  try {
    const saved = localStorage.getItem(CUSTOM_TEMPLATES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load custom templates from localStorage', err);
  }
  return [];
}

export function saveStoredCustomTemplates(templates: TemplateDefinition[]): void {
  try {
    localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save custom templates to localStorage', err);
  }
}

export function getAllTemplates(): TemplateDefinition[] {
  const custom = getStoredCustomTemplates();
  return [...custom, ...TEMPLATES_CATALOG];
}

export function createTemplateFromProject(
  project: WebsiteProject,
  params: {
    name: string;
    description: string;
    category: TemplateCategory;
    categoryName: string;
    thumbnail?: string;
    tags?: string[];
  }
): TemplateDefinition {
  const defaultThumbnail =
    params.thumbnail ||
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop';

  const newTemplate: TemplateDefinition = {
    id: `custom-tpl-${Date.now()}`,
    name: params.name.trim() || project.name,
    description: params.description.trim() || project.description || 'Mẫu trang tùy chỉnh do người dùng tạo.',
    category: params.category,
    categoryName: params.categoryName,
    thumbnail: defaultThumbnail,
    tags: params.tags && params.tags.length > 0 ? params.tags : ['Tùy Chỉnh', 'Mẫu Riêng'],
    theme: { ...project.theme },
    sections: JSON.parse(JSON.stringify(project.sections)),
    isCustom: true,
    createdAt: Date.now(),
  };

  const existing = getStoredCustomTemplates();
  const updated = [newTemplate, ...existing];
  saveStoredCustomTemplates(updated);

  return newTemplate;
}

export function deleteCustomTemplate(templateId: string): boolean {
  const existing = getStoredCustomTemplates();
  const filtered = existing.filter((t) => t.id !== templateId);
  if (filtered.length !== existing.length) {
    saveStoredCustomTemplates(filtered);
    return true;
  }
  return false;
}

export function exportTemplateAsJSON(template: TemplateDefinition): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `template-${template.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importTemplateFromJSON(jsonString: string): TemplateDefinition | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.name || !parsed.sections || !parsed.theme) {
      throw new Error('Dữ liệu JSON mẫu không đúng định dạng');
    }
    const imported: TemplateDefinition = {
      ...parsed,
      id: `custom-tpl-${Date.now()}`,
      isCustom: true,
      createdAt: Date.now(),
    };
    const existing = getStoredCustomTemplates();
    saveStoredCustomTemplates([imported, ...existing]);
    return imported;
  } catch (e) {
    console.error('Lỗi khi nhập mẫu JSON:', e);
    return null;
  }
}
