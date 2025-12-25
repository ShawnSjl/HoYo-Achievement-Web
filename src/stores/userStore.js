import {defineStore} from "pinia";
import {ref} from 'vue';
import {changePassword, deleteCurrentUser, isAdmin, isLogin, login, logout, updateUsername} from "@/api/user";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {useAccountStore} from "@/stores/accountStore.js";

export const useUserStore = defineStore(
    "userStore",
    () => {
        const token = ref('');
        const user = ref('');
        const admin = ref(false);

        // 2FA variable
        const is2FAVisible = ref(false);
        const pendingRetryRequest = ref(null);

        /**
         * Async function that tries to log in the user
         * @param username
         * @param password
         */
        async function loginUser(username, password) {
            try {
                // Login by given credentials
                const requestBody = {
                    username: username,
                    password: password
                }
                const loginResponse = await login(requestBody);
                if (loginResponse.code === 200) {
                    token.value = loginResponse.data.token;
                    user.value = loginResponse.data.username;
                    admin.value = loginResponse.data.isAdmin;

                    // Save the token in local storage for axios use
                    localStorage.setItem('token', token.value);

                    // Fetch accounts from the backend
                    const accountStore = useAccountStore();
                    await accountStore.fetchAccounts();

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

            // Remove data from the local store whatever the response is
            token.value = '';
            user.value = '';
            admin.value = false;

            // Remove the token from local storage
            localStorage.removeItem('token');

            // Empty the account list in the account store
            const accountStore = useAccountStore();
            accountStore.remoteAccounts.value = [];
        }

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
         * Get whether the current user is an admin
         * @returns {boolean}
         */
        function isUserAdmin() {
            return !!(token.value && admin.value);
        }

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
         * Get the user's name
         * @returns string
         */
        function getUserName() {
            if (!user.value) return '游客'
            return user.value;
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
                    user.value = newUsername;
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
         * @param oldPassword
         * @param newPassword
         * @returns {Promise<void>}
         */
        async function updateUserPassword(oldPassword, newPassword) {
            if (!token.value) {
                showInfo("用户未登录");
                return;
            }

            try {
                const requestBody = {
                    old_password: oldPassword,
                    new_password: newPassword,
                }

                const updateResponse = await changePassword(requestBody);
                if (updateResponse.code === 200) {
                    showSuccess(updateResponse.msg);
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
         * Open 2FA validation dialog, register a callback function
         * @param {Function} retryFn
         */
        function trigger2FA(retryFn) {
            is2FAVisible.value = true;
            pendingRetryRequest.value = retryFn;
        }

        /**
         * Close 2FA validation dialog.
         */
        function close2FA() {
            is2FAVisible.value = false;
            pendingRetryRequest.value = null;
        }

        return {
            token,
            user,
            admin,
            is2FAVisible,
            pendingRetryRequest,
            loginUser,
            logoutUser,
            forceCheckIsUserLogin,
            isUserAdmin,
            forceCheckIsUserAdmin,
            getUserName,
            updateUserUsername,
            updateUserPassword,
            deleteUser,
            trigger2FA,
            close2FA,
        };
    },
    {
        persist: true,
    },
);