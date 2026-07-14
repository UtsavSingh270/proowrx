const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';

async function requestJson(path) {
  try {
    const response = await fetch(`${API_BASE_URL}/api${path}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

async function requestJsonArray(path) {
  const data = await requestJson(path);
  return Array.isArray(data) ? data : [];
}

export const serverPosts = {
  async getAll() {
    return requestJsonArray('/posts');
  },
  async getOne(id) {
    const post = await requestJson(`/posts/${id}`);
    return post || null;
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
