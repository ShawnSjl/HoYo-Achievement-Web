import { defineStore } from "pinia";
import { ref } from 'vue';
import {deleteCurrentUser, login, logout, isLogin} from "@/api/user";
import {showError, showInfo, showSuccess, showWarn} from "@/utils/notification.js";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref('');
        const username = ref('');
        const admin = ref(false);

        /**
         * Async function that tries to log in the user
         * @param credentials
         * @returns {Promise<void>}
         */
        async function loginUser(credentials) {
            try {
                // Login by given credentials
                const loginResponse = await login(credentials);
                if (loginResponse.code === 200) {
                    token.value = loginResponse.data.token;
                    username.value = loginResponse.data.username;
                    admin.value = loginResponse.data.isAdmin;

                    localStorage.setItem("sa_token", token.value);
                    localStorage.setItem('username', username.value);
                    localStorage.setItem('admin', admin.value);
                } else {
                    showInfo(loginResponse.msg);
                    return
                }

                // TODO: get user account on other store

                showSuccess('登录成功');
            } catch (error) {
                console.error('Login error:', error);
                showError("登录错误", error)
            }
        }

        /**
         * Check if the current user is logged in
         * @returns {Promise<boolean>}
         */
        async function isUserLogin() {
            if (!token.value) return false;

            const isLoginResponse = await isLogin();
            if (isLoginResponse.code === 200) {
                if (!isLoginResponse.data) {
                    await logoutUser();
                }
                return isLoginResponse.data;
            } else {
                showError(isLoginResponse.msg)
                return false;
            }
        }

        /**
         * Log out current user
         */
        async function logoutUser() {
            // Log out the token in the backend
            const logoutResponse = await logout();
            if (logoutResponse.code === 200) {
                showSuccess(logoutResponse.msg)
            } else {
                showError(logoutResponse.msg)
            }

            // Remove data from local storage
            token.value = '';
            username.value = '';
            admin.value = false;

            localStorage.removeItem("sa_token");
            localStorage.removeItem('username')
            localStorage.removeItem('admin');
        }

        /**
         * Delete the current user and log out
         * @returns {Promise<void>}
         */
        async function deleteUser() {
            try {
                // FIXME: check the return value
                await deleteCurrentUser();
                await logoutUser();
            } catch (error) {
                console.error('Delete error:', error);
                throw error;
            }
        }

        /**
         * Get username
         * @returns {UnwrapRef<string>|string}
         */
        function getUserName() {
            if (!username.value) return '游客'
            return username.value;
        }

        return { token, username, admin, loginUser, isUserLogin, logoutUser, getUserName };
    },
    {
        persist: true,
    },
);