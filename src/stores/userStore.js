import {defineStore} from "pinia";
import {ref} from 'vue';
import {changePassword, deleteCurrentUser, isAdmin, isLogin, login, logout, updateUsername} from "@/api/user";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {useAccountStore} from "@/stores/accountStore.js";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref('');
        const user = ref('');
        const admin = ref(false);

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
                if (loginResponse.data.code === 200) {
                    token.value = loginResponse.data.data.token;
                    user.value = loginResponse.data.data.username;
                    admin.value = loginResponse.data.data.isAdmin;

                    localStorage.setItem('token', token.value);

                    // Fetch accounts from the backend
                    const accountStore = useAccountStore();
                    await accountStore.fetchAccounts();

                    showSuccess('登录成功');
                } else {
                    showInfo(loginResponse.data.msg);
                }
            } catch (error) {
                console.error('Login error:', error);
                showError("登录错误", error)
            }
        }

        /**
         * Force check if the current user is logged in.
         * @returns {Promise<boolean>}
         */
        async function forceCheckIsUserLogin() {
            if (!token.value) return false;

            try {
                const isLoginResponse = await isLogin();
                if (isLoginResponse.data.code === 200) {
                    if (!isLoginResponse.data.data) {
                        await logoutUser();
                    }
                    return isLoginResponse.data.data;
                } else {
                    showError(isLoginResponse.data.msg)
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
                if (logoutResponse.data.code === 200) {
                    showSuccess(logoutResponse.data.msg)
                } else {
                    showError(logoutResponse.data.msg)
                }
            } catch (error) {
                console.error('Logout error:', error);
                showError("登出错误", error);
            }

            // Remove data from local storage whatever the response is
            token.value = '';
            user.value = '';
            admin.value = false;

            // Empty the account list in the account store
            const accountStore = useAccountStore();
            accountStore.accounts.value = [];
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
                if (isAdminResponse.data.code === 200) {
                    return isAdminResponse.data.data;
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
                if (updateResponse.data.code === 200) {
                    user.value = newUsername;
                    showInfo(updateResponse.data.msg);
                } else {
                    showInfo(updateResponse.data.msg);
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
                if (updateResponse.data.code === 200) {
                    showInfo(updateResponse.data.msg);
                } else {
                    showInfo(updateResponse.data.msg);
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
                if (deleteResponse.data.code === 200) {
                    await logoutUser();
                    showSuccess(deleteResponse.data.msg);
                } else {
                    showInfo(deleteResponse.data.msg);
                }
            } catch (error) {
                console.error('Delete error:', error);
                showError("用户删除失败", error)
            }
        }

        /**
         * Get the user's name
         * @returns {UnwrapRef<string>|string}
         */
        function getUserName() {
            if (!user.value) return '游客'
            return user.value;
        }

        return {
            token,
            user,
            admin,
            loginUser,
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