import {defineStore} from "pinia";
import {computed, ref} from 'vue';
import {changePassword, deleteCurrentUser, isAdmin, isLogin, login, logout, updateUsername} from "@/api/user";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref('');
        const username = ref('');
        const admin = ref(false);

        /**
         * Async function that tries to log in the user
         * @param credentials
         */
        async function loginUser(credentials) {
            try {
                // Login by given credentials
                const loginResponse = await login(credentials);
                if (loginResponse.code === 200) {
                    token.value = loginResponse.data.token;
                    username.value = loginResponse.data.username;
                    admin.value = loginResponse.data.isAdmin;

                    // TODO: get user account on other store

                    showSuccess('登录成功');
                } else {
                    showInfo(loginResponse.msg);
                }
            } catch (error) {
                console.error('Login error:', error);
                showError("登录错误", error)
            }
        }

        /**
         * Get whether the current user is login
         * @type {ComputedRef<boolean>}
         */
        const isUserLogin = computed(() => {
            return !!(token.value);
        });

        /**
         * Force check if the current user is logged in.
         * @returns {Promise<boolean>}
         */
        async function forceCheckIsUserLogin() {
            if (!token.value) return false;

            try {
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
            } catch (error) {
                console.error('Check login error:', error);
                return false;
            }
        }

        /**
         * Log out current user
         */
        async function logoutUser() {
            // Log out the token in the backend
            try {
                const logoutResponse = await logout();
                if (logoutResponse.code === 200) {
                    showSuccess(logoutResponse.msg)
                } else {
                    showError(logoutResponse.msg)
                }
            } catch (error) {
                console.error('Logout error:', error);
                showError("登出错误", error);
            }

            // Remove data from local storage whatever the response is
            token.value = '';
            username.value = '';
            admin.value = false;
        }

        /**
         * Get whether the current user is an admin
         * @type {ComputedRef<boolean>}
         */
        const isUserAdmin = computed(() => {
            return !!(token.value && admin.value);
        });

        /**
         * Force check if the current user is an admin.
         * If the response is not 200, log out the user.
         * @returns {Promise<any|boolean>}
         */
        async function forceCheckIsUserAdmin() {
            if (!token.value) return false;

            // Check if the user is an admin
            try {
                const isAdminResponse = await isAdmin();
                if (isAdminResponse.code === 200) {
                    return isAdminResponse.data;
                } else {
                    await logoutUser()
                    return false;
                }
            } catch (error) {
                console.error('Check admin error:', error);
                return false;
            }
        }

        /**
         * Update the username of the current user.
         * @param newUsername
         * @returns {Promise<void>}
         */
        async function updateUserUsername(newUsername) {
            if (!token.value) {
                showInfo("用户未登录");
                return;
            }

            // Update the username in the backend
            try {
                const updateResponse = await updateUsername({username: newUsername});
                if (updateResponse.code === 200) {
                    username.value = newUsername;
                    showInfo(updateResponse.msg);
                } else {
                    showInfo(updateResponse.msg);
                }
            } catch (error) {
                console.error('Update username error:', error);
                showError("用户名更新错误", error)
            }
        }

        /**
         * Update the password of the current user.
         * @param newPassword
         * @returns {Promise<void>}
         */
        async function updateUserPassword(newPassword) {
            if (!token.value) {
                showInfo("用户未登录");
                return;
            }

            try {
                const updateResponse = await changePassword({password: newPassword});
                if (updateResponse.code === 200) {
                    showInfo(updateResponse.msg);
                } else {
                    showInfo(updateResponse.msg);
                }
            } catch (error) {
                console.error('Update password error:', error);
                showError("密码更新错误", error)
            }
        }

        /**
         * Delete the current user and log out
         * @returns {Promise<void>}
         */
        async function deleteUser() {
            if (!token.value) {
                showInfo("用户未登录");
                return;
            }

            try {
                const deleteResponse = await deleteCurrentUser();
                if (deleteResponse.code === 200) {
                    await logoutUser();
                    showSuccess(deleteResponse.msg);
                } else {
                    showInfo(deleteResponse.msg);
                }
            } catch (error) {
                console.error('Delete error:', error);
                showError("用户删除失败", error)
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

        return {
            token,
            username,
            admin,
            loginUser,
            isUserLogin,
            forceCheckIsUserLogin,
            logoutUser,
            isUserAdmin,
            forceCheckIsUserAdmin,
            updateUserUsername,
            updateUserPassword,
            getUserName,
            deleteUser
        };
    },
    {
        persist: true,
    },
);