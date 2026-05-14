import axios from "axios";
import {useUserStore} from "@/scripts/stores/userStore.js";

// 创建 Axios 实例
const api = axios.create({
    // baseURL: import.meta.env.VITE_BACKEND_HOST, // 后端 API 地址
    timeout: 10000, // 超时时间
    headers: {
        "Content-Type": "application/json",
        "x-auth-mode": "cookie",
    },
    withCredentials: true,
});

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
