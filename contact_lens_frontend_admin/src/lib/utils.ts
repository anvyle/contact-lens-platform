import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
    ];
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
  };
  if (!dateString) {
    return null;
  }
  return new Date(dateString).toLocaleString(undefined, options);

}
