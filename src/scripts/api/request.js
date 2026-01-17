import axios from "axios";
import {useUserStore} from "@/scripts/stores/userStore.js";

// 创建 Axios 实例
const api = axios.create({
    // baseURL: import.meta.env.VITE_BACKEND_HOST, // 后端 API 地址
    timeout: 10000, // 超时时间
    headers: {
        "Content-Type": "application/json",
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 从 localStorage 或 Vuex 中获取 token
        const token = localStorage.getItem("token");

        if (token) {
            config.headers["satoken"] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        const res = response.data;

        // 拦截需要二次验证，并弹窗
        if (res.code === 418) {
            const userStore = useUserStore();

            return new Promise((resolve, reject) => {
                userStore.trigger2FA(() => {
                    api(response.config).then(resolve).catch(reject);
                });
            });
        }

        return res;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
