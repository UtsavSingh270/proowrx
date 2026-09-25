import { apiClient, clearAuthToken, setAuthToken } from '../lib/apiClient';

function getToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('proowrx_jwt');
}

function getDeviceId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('proowrx_device_id');
  if (!id) {
    id = `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('proowrx_device_id', id);
  }
  return id;
}

export const auth = {
  async login(username, password) {
    const { token, user } = await apiClient.post('/auth/login', { username, password });
    if (token) setAuthToken(token);
    return user;
  },
  async verify() {
    try {
      return await apiClient.get('/auth/verify');
    } catch {
      return null;
    }
  },
  logout() {
    clearAuthToken();
  },
  isLoggedIn() {
    return !!getToken();
  },
  getAdmins() {
    return apiClient.get('/auth/admins');
  },
  createAdmin(data) {
    return apiClient.post('/auth/admins', data);
  },
  updateAdmin(id, data) {
    return apiClient.put(`/auth/admins/${id}`, data);
  },
  removeAdmin(id) {
    return apiClient.delete(`/auth/admins/${id}`);
  },
};

export const posts = {
  getAll() {
    return apiClient.get('/posts');
  },
  getOne(id) {
    return apiClient.get(`/posts/${id}`);
  },
  getOneFull(id) {
    return apiClient.get(`/posts/${id}?view=1`);
  },
  getByAuthor(authorId, page = 1, limit = 6) {
    return apiClient.get(`/posts/author/${authorId}?page=${page}&limit=${limit}`);
  },
  toggleLike(id) {
    return apiClient.post(`/posts/${id}/like`, { deviceId: getDeviceId() });
  },
  getComments(id) {
    return apiClient.get(`/posts/${id}/comments`);
  },
  addComment(id, data) {
    return apiClient.post(`/posts/${id}/comments`, data);
  },
};

export const adminPosts = {
  getAll() {
    return apiClient.get('/posts/admin/all');
  },
  getOne(id) {
    return apiClient.get(`/posts/admin/${id}`);
  },
  getAuthors() {
    return apiClient.get('/posts/admin/authors');
  },
  createAuthor(data) {
    return apiClient.post('/posts/admin/authors', data);
  },
  updateAuthor(id, data) {
    return apiClient.put(`/posts/admin/authors/${id}`, data);
  },
  removeAuthor(id) {
    return apiClient.delete(`/posts/admin/authors/${id}`);
  },
  create(data) {
    return apiClient.post('/posts', data);
  },
  update(id, data) {
    return apiClient.put(`/posts/${id}`, data);
  },
  setStatus(id, s) {
    return apiClient.patch(`/posts/${id}/status`, { status: s });
  },
  setFeatured(id, featured) {
    return apiClient.patch(`/posts/${id}/featured`, { featured });
  },
  remove(id) {
    return apiClient.delete(`/posts/${id}`);
  },
};

export const teamMembers = {
  getAll() {
    return apiClient.get('/team-members');
  },
  getAdminAll() {
    return apiClient.get('/team-members/admin/all');
  },
  create(data) {
    return apiClient.post('/team-members', data);
  },
  update(id, data) {
    return apiClient.put(`/team-members/${id}`, data);
  },
  remove(id) {
    return apiClient.delete(`/team-members/${id}`);
  },
};

export const resources = {
  getAll() {
    return apiClient.get('/resources');
  },
  requestDownload(data) { return apiClient.post('/resources/request-download', data); },
  downloadUrl(path) {
    return path.startsWith('/api') ? path : `/api${path}`;
  },
  getAdminAll() {
    return apiClient.get('/resources/admin/all');
  },
  create(data) {
    return apiClient.post('/resources', data);
  },
  update(id, data) {
    return apiClient.put(`/resources/${id}`, data);
  },
  remove(id) {
    return apiClient.delete(`/resources/${id}`);
  },
};

export const upload = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
      'x-device-id': getDeviceId(),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    };

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseText = await response.text();
    let responseData = {};
    if (responseText.trim()) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error('The upload service returned an invalid response.');
      }
    }

    if (!response.ok) {
      throw new Error(responseData.error || response.statusText);
    }

    return responseData;
  },
  async uploadFile(file) {
    return this.uploadImage(file);
  },
  deleteImage(filename) {
    return apiClient.delete(`/upload/${filename}`);
  },
};

export const worklife = {
  getAll() {
    return apiClient.get('/worklife');
  },
  getAdminAll() {
    return apiClient.get('/worklife/admin/all');
  },
  create(data) {
    return apiClient.post('/worklife', data);
  },
  update(id, data) {
    return apiClient.put(`/worklife/${id}`, data);
  },
  remove(id) {
    return apiClient.delete(`/worklife/${id}`);
  },
};

export const auditLogs = {
  getAll(filters = {}, limit = 100, skip = 0) {
    const params = new URLSearchParams({ ...filters, limit, skip });
    return apiClient.get(`/audit-logs?${params.toString()}`);
  },
  getStats() {
    return apiClient.get('/audit-logs/stats');
  },
};

export const jobs = {
  getActive() {
    return apiClient.get('/jobs');
  },
};

export const adminJobs = {
  getAll() {
    return apiClient.get('/jobs/admin/all');
  },
  create(data) {
    return apiClient.post('/jobs', data);
  },
  update(id, data) {
    return apiClient.put(`/jobs/${id}`, data);
  },
  setStatus(id, s) {
    return apiClient.patch(`/jobs/${id}/status`, { status: s });
  },
  remove(id) {
    return apiClient.delete(`/jobs/${id}`);
  },
};

export const contact = {
  submit(data) {
    return apiClient.post('/contact', { ...data, sourcePage: typeof window !== 'undefined' ? window.location.pathname : '', sourceTitle: typeof document !== 'undefined' ? document.title : '' });
  },
  getAll() {
    return apiClient.get('/contact');
  },
  markRead(id) {
    return apiClient.patch(`/contact/${id}/read`, {});
  },
  remove(id) {
    return apiClient.delete(`/contact/${id}`);
  },
};

export const newsletter = {
  subscribe(email) {
    return apiClient.post('/newsletter', { email, source: 'website_footer' });
  },
  getAll() {
    return apiClient.get('/newsletter');
  },
  remove(id) {
    return apiClient.delete(`/newsletter/${id}`);
  },
};

export const meetings = {
  getBooked(person, date) {
    return apiClient.get(`/meetings/booked?person=${encodeURIComponent(person)}&date=${date}`);
  },
  book(data) {
    return apiClient.post('/meetings', data);
  },
  getAll() {
    return apiClient.get('/meetings');
  },
  setStatus(id, status) {
    return apiClient.patch(`/meetings/${id}/status`, { status });
  },
  remove(id) {
    return apiClient.delete(`/meetings/${id}`);
  },
};

export const analytics = {
  getSummary(filters = {}) { return apiClient.get(`/analytics/summary?${new URLSearchParams(filters)}`); },
  getPages() { return apiClient.get('/analytics/pages'); },
  getExcludedIps() {
    return apiClient.get('/analytics/excluded-ips');
  },
  addExcludedIp(data) {
    return apiClient.post('/analytics/excluded-ips', data);
  },
  removeExcludedIp(id) {
    return apiClient.delete(`/analytics/excluded-ips/${id}`);
  },
};

export async function checkBackend() {
  try {
    const response = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
}
