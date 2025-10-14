import axios from 'axios';

class Request {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_URL_BACKEND || '',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to include auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this._getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    get(path, parameters = {}, customHeaders = {}) {
        return this.axiosInstance.get(path, {
            params: parameters,
            headers: customHeaders,
        }).then(response => response.data);
    }

    post(path, data = null, customHeaders = {}) {
        return this.axiosInstance.post(path, data, {
            headers: customHeaders,
        }).then(response => response.data);
    }

    put(path, data = null, customHeaders = {}) {
        return this.axiosInstance.put(path, data, {
            headers: customHeaders,
        }).then(response => response.data);
    }

    delete(path, data = null, customHeaders = {}) {
        return this.axiosInstance.delete(path, {
            data: data,
            headers: customHeaders,
        }).then(response => response.data);
    }

    _getAuthToken() {
        try {
            return localStorage.getItem("token");
        } catch (error) {
            console.warn("No se pudo acceder al localStorage:", error);
            return null;
        }
    }
}

export const requestService = new Request();