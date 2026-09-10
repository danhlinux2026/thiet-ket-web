export interface GitHubRepoItem {
  name: string;
  path: string;
  sha: string;
  size?: number;
  url: string;
  html_url?: string;
  git_url?: string;
  download_url?: string | null;
  type: 'file' | 'dir' | 'blob' | 'tree';
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  public_repos: number;
}

export interface GitHubRepoInfo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  default_branch: string;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

const GITHUB_TOKEN_KEY = 'webstudio_github_token_v1';
const GITHUB_LAST_REPO_KEY = 'webstudio_github_last_repo_v1';

export const getSavedGitHubToken = (): string => {
  return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
};

export const saveGitHubToken = (token: string): void => {
  if (token) {
    localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
  } else {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
  }
};

export const getSavedLastRepo = (): string => {
  return localStorage.getItem(GITHUB_LAST_REPO_KEY) || 'tailwindtoolbox/Landing-Page';
};

export const saveLastRepo = (repo: string): void => {
  localStorage.setItem(GITHUB_LAST_REPO_KEY, repo.trim());
};

const getHeaders = (token?: string) => {
  const t = token || getSavedGitHubToken();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (t) {
    headers.Authorization = `Bearer ${t}`;
  }
  return headers;
};

// Verify token and get user profile
export const verifyGitHubUser = async (token: string): Promise<GitHubUser> => {
  const res = await fetch('https://api.github.com/user', {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Xác thực GitHub thất bại (${res.status}): ${res.statusText}`);
  }
  return res.json();
};

// Get repositories of authenticated user
export const fetchUserRepositories = async (token?: string): Promise<GitHubRepoInfo[]> => {
  const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Không thể lấy danh sách kho lưu trữ (${res.status})`);
  }
  return res.json();
};

// Search public repositories
export const searchGitHubRepos = async (query: string, token?: string): Promise<GitHubRepoInfo[]> => {
  const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=10`, {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Tìm kiếm repository thất bại (${res.status})`);
  }
  const data = await res.json();
  return data.items || [];
};

// Get repo details
export const fetchRepoDetails = async (owner: string, repo: string, token?: string): Promise<GitHubRepoInfo> => {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Không thể tìm thấy repository ${owner}/${repo} (${res.status})`);
  }
  return res.json();
};

// Get repo branches
export const fetchRepoBranches = async (owner: string, repo: string, token?: string): Promise<GitHubBranch[]> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=50`, {
      headers: getHeaders(token),
    });
    if (!res.ok) return [{ name: 'main', commit: { sha: '', url: '' } }, { name: 'master', commit: { sha: '', url: '' } }];
    return res.json();
  } catch {
    return [{ name: 'main', commit: { sha: '', url: '' } }];
  }
};

// Fetch contents of a folder or root in a repo
export const fetchRepoContents = async (
  owner: string,
  repo: string,
  path: string = '',
  branch?: string,
  token?: string
): Promise<GitHubRepoItem[]> => {
  const cleanPath = path.replace(/^\/+/, '');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}${branch ? `?ref=${encodeURIComponent(branch)}` : ''}`;
  
  const res = await fetch(url, {
    headers: getHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`Lỗi duyệt thư mục ${cleanPath || 'root'} (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data.sort((a, b) => {
      // Sort directories first, then files alphabetically
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    });
  } else if (data && typeof data === 'object') {
    return [data];
  }
  return [];
};

// Fetch raw file text content
export const fetchRawFileContent = async (downloadUrl: string): Promise<string> => {
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error(`Không thể tải nội dung file (${res.status})`);
  }
  return res.text();
};

// Fetch file from repo path directly
export const fetchFileContentByPath = async (
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main',
  token?: string
): Promise<{ content: string; encoding: string; size: number }> => {
  const cleanPath = path.replace(/^\/+/, '');
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${encodeURIComponent(branch)}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Không thể tải file ${cleanPath}`);
  }
  const data = await res.json();
  let decoded = '';
  if (data.encoding === 'base64' && data.content) {
    // Decode UTF-8 base64
    try {
      decoded = decodeURIComponent(
        atob(data.content.replace(/\s/g, ''))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      decoded = atob(data.content.replace(/\s/g, ''));
    }
  } else {
    decoded = data.content || '';
  }
  return {
    content: decoded,
    encoding: data.encoding,
    size: data.size,
  };
};

// Commit & push file to repo
export const commitFileToGitHub = async ({
  owner,
  repo,
  path,
  content,
  message,
  branch = 'main',
  token,
}: {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
  token?: string;
}): Promise<{ commitSha: string; fileUrl: string }> => {
  const cleanPath = path.replace(/^\/+/, '');
  const authHeader = getHeaders(token);
  if (!authHeader.Authorization) {
    throw new Error('Bạn cần nhập GitHub Personal Access Token (có quyền repo) để đẩy mã lên GitHub.');
  }

  // Check if file exists to get current sha
  let existingSha: string | undefined = undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${encodeURIComponent(branch)}`,
      { headers: authHeader }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      existingSha = data.sha;
    }
  } catch {
    // File doesn't exist, fine
  }

  // Encode UTF-8 content to base64
  const base64Content = btoa(
    encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );

  const body: any = {
    message: message || `Update ${cleanPath} via WebStudio`,
    content: base64Content,
    branch: branch,
  };
  if (existingSha) {
    body.sha = existingSha;
  }

  const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const errorData = await putRes.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi ghi file lên GitHub (${putRes.status})`);
  }

  const result = await putRes.json();
  return {
    commitSha: result.commit?.sha || '',
    fileUrl: result.content?.html_url || `https://github.com/${owner}/${repo}/blob/${branch}/${cleanPath}`,
  };
};

// Popular preset repositories to quickly explore
export const POPULAR_GITHUB_REPOSITORIES = [
  {
    owner: 'tailwindtoolbox',
    repo: 'Landing-Page',
    name: 'Landing Page Mẫu Tailwind CSS',
    description: 'Trang đích hiện đại dựng bằng Tailwind CSS, hình ảnh và icon chuẩn.',
    category: 'Templates',
  },
  {
    owner: 'lucide-icons',
    repo: 'lucide',
    name: 'Thư Viện Biểu Tượng Lucide Icons',
    description: 'Kho icon vector SVG phong phú chất lượng cao.',
    category: 'Icons',
  },
  {
    owner: 'BlackrockDigital',
    repo: 'startbootstrap-creative',
    name: 'Creative Portfolio & Landing Template',
    description: 'Mẫu giao diện portfolio sáng tạo với hình ảnh mẫu đẹp mắt.',
    category: 'Portfolio',
  },
  {
    owner: 'mdo',
    repo: 'html5-boilerplate',
    name: 'HTML5 Boilerplate & Asset Structure',
    description: 'Cấu trúc web chuẩn HTML5, CSS và thư mục assets.',
    category: 'Starter',
  },
];
