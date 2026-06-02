import {defineStore} from "pinia";
import {ref} from 'vue';
import {
    changePassword,
    deleteCurrentUser,
    isRootUser,
    isSuperUser,
    isUserLogin,
    login,
    logout,
    updateUsername
} from "@/scripts/api/user.js";
import {showError, showInfo, showSuccess, showWarn} from "@/scripts/utils/notification.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {getClientId} from "@/scripts/utils/clientId.js";

export const useUserStore = defineStore(
    "userStore",
    () => {
        const isLogin = ref(false);
        const user = ref('');
        const isSuper = ref(false);
        const isRoot = ref(false);

        // 2FA variable
        const is2FAVisible = ref(false);
        const pendingRetryRequest = ref(null);

        /**
         * Login user
         * @param username
         * @param password
         * @return {Promise<boolean>}
         */
        async function loginUser(username, password) {
            try {
                const requestBody = {
                    username: username,
                    password: password,
                }
                const loginResponse = await login(requestBody);
                if (loginResponse.code === 200) {
                    isLogin.value = true;
                    user.value = loginResponse.data.username;
                    isSuper.value = loginResponse.data.isSuper;
                    isRoot.value = loginResponse.data.isRoot;

                    showSuccess('登录成功');
                    return true;
                } else {
                    showWarn(loginResponse.msg);
                }
            } catch (error) {
                console.log('Login error:', error);
                showError("登录错误", error);
            }
            return false;
        }

        /**
         * Log out the current user
         */
        async function logoutUser() {
            if (!isLogin.value) return;

            // Log out
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
            isLogin.value = false;
            user.value = '';
            isSuper.value = false;
            isRoot.value = false;

            // Empty the account list in the account store
            const accountStore = useAccountStore();
            accountStore.removeRemoteAccount();
        }

        /**
         * Force check if the current user is logged in.
         * @returns {Promise<boolean>}
         */
        async function forceCheckIsUserLogin() {
            try {
                const isLoginResponse = await isUserLogin();
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
         * Get whether the current user is a superuser
         * @returns {boolean}
         */
        function isUserSuper() {
            return !!(isLogin.value && isSuper.value);
        }

        /**
         * Force check if the current user is a superuser.
         * If the response is not 200, log out the user.
         * @returns {Promise<any|boolean>}
         */
        async function forceCheckIsUserSuper() {
            if (!isLogin.value) return false;

            // Check if the user is an admin
            try {
                const isSuperResponse = await isSuperUser();
                if (isSuperResponse.code === 200) {
                    isSuper.value = isSuperResponse.data;
                    return isSuperResponse.data;
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
         * Get whether the current user is a root
         * @returns {boolean}
         */
        function isUserRoot() {
            return !!(isLogin.value && isRoot.value);
        }

        /**
         * Force check if the current user is a root.
         * If the response is not 200, log out the user.
         * @returns {Promise<any|boolean>}
         */
        async function forceCheckIsUserRoot() {
            if (!isLogin.value) return false;

            // Check if the user is an admin
            try {
                const isRootResponse = await isRootUser();
                if (isRootResponse.code === 200) {
                    isRoot.value = isRootResponse.data;
                    return isRootResponse.data;
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
            if (!user.value || !isLogin.value) return '游客'
            return user.value;
        }

        /**
         * Update the username of the current user.
         * @param newUsername
         * @returns {Promise<void>}
         */
        async function updateUserUsername(newUsername) {
            if (!isLogin.value) {
                showInfo("用户未登录");
                return;
            }

            // Update the username in the backend
            try {
                const requestParams = {
                    clientId: getClientId(),
                }
                const requestBody = {
                    username: newUsername,
                }
                const updateResponse = await updateUsername(requestParams, requestBody);
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
            if (!isLogin.value) {
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
            if (!isLogin.value) {
                showInfo("用户未登录");
                return;
            }

            try {
                const requestParams = {
                    clientId: getClientId(),
                }
                const deleteResponse = await deleteCurrentUser(requestParams);
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
         * Open the 2FA validation dialog, register a callback function
         * @param {Function} retryFn
         */
        function trigger2FA(retryFn) {
            is2FAVisible.value = true;
            pendingRetryRequest.value = retryFn;
        }

        /**
         * Close the 2FA validation dialog.
         */
        function close2FA() {
            is2FAVisible.value = false;
            pendingRetryRequest.value = null;
        }

        return {
            user,
            isLogin,
            isSuper,
            isRoot,
            is2FAVisible,
            pendingRetryRequest,
            loginUser,
            logoutUser,
            forceCheckIsUserLogin,
            isUserSuper,
            forceCheckIsUserSuper,
            isUserRoot,
            forceCheckIsUserRoot,
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