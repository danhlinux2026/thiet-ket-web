import { AppVersion, WebsiteProject } from '../types';

const VERSIONS_STORAGE_KEY = 'webstudio_app_versions_v1';
const CURRENT_VERSION_ID_KEY = 'webstudio_current_version_id';

export function getStoredVersions(): AppVersion[] {
  try {
    const saved = localStorage.getItem(VERSIONS_STORAGE_KEY);
    if (saved) {
      const parsed: AppVersion[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load versions from localStorage', err);
  }
  return [];
}

export function saveStoredVersions(versions: AppVersion[]): void {
  try {
    // Keep max 50 versions to avoid localStorage quota issues
    const trimmed = versions.slice(0, 50);
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save versions to localStorage', err);
  }
}

export function getCurrentVersionId(): string | null {
  try {
    return localStorage.getItem(CURRENT_VERSION_ID_KEY);
  } catch (e) {
    return null;
  }
}

export function setCurrentVersionId(id: string): void {
  try {
    localStorage.setItem(CURRENT_VERSION_ID_KEY, id);
  } catch (e) {
    // ignore
  }
}

export function createVersionSnapshot(
  project: WebsiteProject,
  nameOrPrompt: string,
  options?: {
    prompt?: string;
    isAutoSave?: boolean;
    tags?: string[];
  }
): AppVersion {
  const newVersion: AppVersion = {
    id: `ver-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: nameOrPrompt.trim() || 'Lưu phiên bản',
    prompt: options?.prompt || nameOrPrompt,
    timestamp: Date.now(),
    projectSnapshot: JSON.parse(JSON.stringify(project)),
    isAutoSave: options?.isAutoSave || false,
    tags: options?.tags || [],
  };

  const existing = getStoredVersions();
  const updated = [newVersion, ...existing];
  saveStoredVersions(updated);
  setCurrentVersionId(newVersion.id);

  return newVersion;
}

export function deleteVersion(versionId: string): boolean {
  const existing = getStoredVersions();
  const filtered = existing.filter((v) => v.id !== versionId);
  if (filtered.length !== existing.length) {
    saveStoredVersions(filtered);
    return true;
  }
  return false;
}

export function clearAllVersions(): void {
  localStorage.removeItem(VERSIONS_STORAGE_KEY);
  localStorage.removeItem(CURRENT_VERSION_ID_KEY);
}

// Format timestamp to Google AI Studio style: "Sep 10, 8:04 PM"
export function formatVersionDate(timestamp: number): string {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${month} ${day}, ${hours}:${minutesStr} ${ampm}`;
}
