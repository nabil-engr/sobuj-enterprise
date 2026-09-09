const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

// Production is served by the ASP.NET application, so API calls stay on the same domain.
export const apiBaseUrl = isLocal ? 'http://localhost:5000/api' : '/api';
