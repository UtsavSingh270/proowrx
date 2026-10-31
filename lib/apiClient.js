const API_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Browser requests stay on the current origin. This keeps local development
  // and production deployments aligned with the site's same-origin API routes.
  if (typeof window !== 'undefined') return normalizedPath;
  return `${API_URL}${normalizedPath}`;
}

let authToken = null;

export function setAuthToken(token) {
  authToken = token;

  if (typeof window !== "undefined") {
    sessionStorage.setItem("proowrx_jwt", token);
  }
}

export function clearAuthToken() {
  authToken = null;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("proowrx_jwt");
  }
}

function getToken() {
  if (authToken) return authToken;

  if (typeof window !== "undefined") {
    return sessionStorage.getItem("proowrx_jwt");
  }

  return null;
}

async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(apiUrl(`/api${path}`), {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || response.statusText);
  }

  return data;
}

export const apiClient = {
  get(path) {
    return request(path);
  },

  post(path, body) {
    return request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put(path, body) {
    return request(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch(path, body) {
    return request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(path) {
    return request(path, {
      method: "DELETE",
    });
  },
};
