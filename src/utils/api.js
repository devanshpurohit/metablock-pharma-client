import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
});

export const resolveImageUrl = (path) => {
  if (!path) return "/assets/pic.png";
  let cleanPath = path;
  if (path.includes('/uploads/http') || path.includes('uploads/http')) {
    cleanPath = path.replace(/^\/?uploads\//, '');
  }
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://") || cleanPath.startsWith("data:")) {
    return cleanPath;
  }
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api')
    .replace("/api", "");
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${baseUrl}${normalizedPath}`;
};

export default api;
