const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';

async function requestJson(path, revalidate = 60) {
  try {
    const response = await fetch(`${API_BASE_URL}/api${path}`, {
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    const responseText = await response.text();
    if (!responseText.trim()) return null;
    try {
      return JSON.parse(responseText);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

async function requestJsonArray(path, revalidate) {
  const data = await requestJson(path, revalidate);
  return Array.isArray(data) ? data : [];
}

export const serverPosts = {
  async getAll() {
    return requestJsonArray('/posts', 1800);
  },
  async getOne(id) {
    const post = await requestJson(`/posts/${id}`, 1800);
    return post || null;
  },
  async getByAuthor(authorId, page = 1, limit = 6) {
    return requestJson(`/posts/author/${encodeURIComponent(authorId)}?page=${page}&limit=${limit}`, 1800);
  },
};

export const serverJobs = {
  async getActive() {
    return requestJsonArray('/jobs');
  },
};

export const serverTeamMembers = {
  async getAll() {
    return requestJsonArray('/team-members');
  },
};

export const serverWorkLife = {
  async getAll() {
    return requestJsonArray('/worklife');
  },
};

export const serverResources = {
  async getAll() {
    return requestJsonArray('/resources');
  },
};
