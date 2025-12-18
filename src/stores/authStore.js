import { defineStore } from "pinia";
import { ref } from 'vue';
import {deleteCurrentUser, login} from "@/api/user";
import { isTokenExpired } from "@/utils/jwt";

export const useAuthStore = defineStore(
    "auth",
    () => {
        const token = ref('');
        const user = ref(null);

        async function loginUser(credentials) {
            try {
                const response = await login(credentials);
                if (response.token) {
                    token.value = response.token;
                    user.value = response.user;

                    localStorage.setItem("jwt_token", token.value);
                    localStorage.setItem('user', JSON.stringify(user.value))
                } else {
                    throw new Error('Login failed.');
                }
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        }

        async function deleteUser() {
            try {
                await deleteCurrentUser();
                logoutUser()
            } catch (error) {
                console.error('Delete error:', error);
                throw error;
            }
        }

        function logoutUser() {
            token.value = null;
            user.value = null;

            localStorage.removeItem("jwt_token");
            localStorage.removeItem('user')
        }

        function getUserName() {
            if (!user.value) return '游客'
            return user.value.username;
        }

        function isAuthenticated() {
            return !!token.value && !isTokenExpired(token.value);
        }

        function loadUser() {
            if (token.value && !isTokenExpired(token.value)) {
                user.value = JSON.parse(localStorage.getItem("user"));
            } else {
                logoutUser();
            }
        }
        return { token, user, loginUser, deleteUser, logoutUser, getUserName, isAuthenticated, loadUser };

    },
    {
        persist: true,
    },
);