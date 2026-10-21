import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Helper untuk asset URL (declared globally via window)
declare global {
    interface Window {
        asset: (path: string) => string;
    }
}

window.asset = (path: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${path.replace(/^\//, '')}`;
};

