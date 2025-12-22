import axios from "axios";

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

// TODO 添加要求二次验证的拦截，并弹窗
// 响应拦截器
// api.interceptors.response.use(
//     (response) => {
//         return response.data;
//     },
//     (error) => {
//         // 处理 token 过期等情况
//         if (error.response && error.response.status === 401) {
//             console.warn("Token 可能已过期，请重新登录");
//             // 可以在这里触发退出登录逻辑，比如清除 token 并跳转到登录页
//             localStorage.removeItem("sa_token");
//         }
//
//         return Promise.reject(error);
//     }
// );

export default api;
