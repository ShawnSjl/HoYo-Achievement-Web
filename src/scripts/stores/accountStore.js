import {defineStore} from "pinia";
import {ref} from "vue";
import {
    createAccount,
    deleteAccount,
    getAccountByUserId,
    getAccountByUuid,
    updateAccountInGameUid,
    updateAccountName
} from "@/scripts/api/account.js";
import {showError, showInfo, showSuccess, showWarn} from "@/scripts/utils/notification.js";
import {v7 as uuidv7} from 'uuid';
import {useUserStore} from "@/scripts/stores/userStore.js";
import {getRecordById} from "@/scripts/api/achievement.js";
import {getClientId} from "@/scripts/utils/clientId.js";

export const useAccountStore = defineStore(
    'accountStore',
    () => {
        const userStore = useUserStore();

        const remoteAccounts = ref([]);
        const localAccounts = ref([]);

        /**
         * Return the list of accounts. If the user is logged in, return the accounts from the backend; otherwise, return the local data.
         * @returns []
         */
        function getAccounts() {
            if (userStore.isLogin) {
                return remoteAccounts.value;
            } else {
                return localAccounts.value;
            }
        }

        /**
         * Fetch accounts from the backend.
         * @returns {Promise<void>}
         */
        async function fetchAccounts() {
            try {
                // Clean the current data first
                remoteAccounts.value = [];

                // Get accounts from the backend
                const accountsResponse = await getAccountByUserId();
                if (accountsResponse.code !== 200) {
                    showInfo(accountsResponse.msg)
                    return;
                }
                showSuccess(accountsResponse.msg);

                // For each account, get achievements from the backend
                for (const account of accountsResponse.data) {
                    // Get achievements from the backend
                    const requestParams = {uuid: account.account_uuid};
                    const recordResponse = await getRecordById(requestParams);

                    // Check response
                    if (recordResponse.code !== 200) {
                        showInfo(recordResponse.msg);
                        continue;
                    }

                    // Create a data structure for the account
                    const accountData = {
                        uuid: account.account_uuid,
                        type: account.game_id,
                        name: account.account_name,
                        inGameUid: account.account_in_game_uid,
                        records: recordResponse.data,
                    }

                    // Push the account to the list
                    remoteAccounts.value.push(accountData);
                }
            } catch (error) {
                console.error('Fail to get accounts:', error);
                showError("游戏账号获取错误", error)
            }
        }

        async function fetchAccountByUuid(uuid) {
            try {
                // Check if the target account exists in the local data
                const targetAccount = remoteAccounts.value.find(item => item.uuid === uuid);
                if (!targetAccount) {
                    showWarn('未知UUID');
                    return;
                }

                // Get account from the backend
                const requestParams = {accountUuid: uuid};
                const accountResponse = await getAccountByUuid(requestParams);
                if (accountResponse.code !== 200) {
                    showWarn(accountResponse.msg)
                    return;
                }
                showSuccess(accountResponse.msg);

                // Update the account data in the local data
                targetAccount.name = accountResponse.data.account_name;
                targetAccount.inGameUid = accountResponse.data.account_in_game_uid;
            } catch (error) {
                console.error('Fail to get account by uuid:', error);
                showError("游戏账号获取错误", error)
            }
        }

        async function fetchNewAccountByUuid(uuid) {
            try {
                // Get account from the backend
                const requestParams = {accountUuid: uuid};
                const accountResponse = await getAccountByUuid(requestParams);
                if (accountResponse.code !== 200) {
                    showWarn(accountResponse.msg)
                    return;
                }
                showSuccess(accountResponse.msg);

                // Create a data structure for the account
                const accountData = {
                    uuid: accountResponse.data.account_uuid,
                    type: accountResponse.data.game_id,
                    name: accountResponse.data.account_name,
                    inGameUid: accountResponse.data.account_in_game_uid,
                    records: [],
                }
                remoteAccounts.value.push(accountData);
            } catch (error) {
                console.error('Fail to get account by uuid:', error);
                showError("游戏账号获取错误", error)
            }
        }

        async function fetchAccountRecords(uuid) {
            try {
                // Check if the target account exists in the local data
                const targetAccount = remoteAccounts.value.find(item => item.uuid === uuid);
                if (!targetAccount) {
                    showWarn('未知UUID');
                    return;
                }

                // Get account from the backend
                const requestParams = {uuid: uuid};
                const recordResponse = await getRecordById(requestParams);
                if (recordResponse.code !== 200) {
                    showWarn(recordResponse.msg)
                    return;
                }
                showSuccess(recordResponse.msg);

                // Update the account data in the local data
                targetAccount.records = recordResponse.data;
            } catch (error) {
                console.error('Fail to get account records:', error);
                showError("游戏账号记录获取错误", error)
            }
        }

        /**
         * Create a new account; if the user is login, create it at the backend.
         * @param type
         * @param accountName
         * @param inGameUid
         * @returns {Promise<void>}
         */
        async function createNew(type, accountName, inGameUid) {
            try {
                // Generate a new UUID for the account
                const uuid = uuidv7();

                // In user is login, create a new account at the backend
                if (userStore.isLogin) {
                    const requestParams = {
                        clientId: getClientId(),
                    }
                    const requestBody = {
                        account_uuid: uuid,
                        game_id: type,
                        account_name: accountName,
                        account_in_game_uid: inGameUid,
                    }
                    const createResponse = await createAccount(requestParams, requestBody);
                    if (createResponse.code !== 200) {
                        showInfo(createResponse.msg);
                        return;
                    }
                }

                // Create a new account data structure
                const newAccount = {
                    uuid: uuid,
                    type: type,
                    name: accountName,
                    inGameUid: inGameUid,
                    records: [],
                }

                // Push the account to the list
                if (userStore.isLogin) {
                    remoteAccounts.value.push(newAccount);
                    showSuccess("游戏账号创建成功")
                } else {
                    localAccounts.value.push(newAccount);
                    showSuccess("本地游戏账号创建成功")
                }
            } catch (error) {
                console.error("Fail to create new account:", error);
                showError("游戏账号创建错误", error);
            }
        }

        /**
         * Update the new account name; if the user is login, update it at the backend.
         * @param uuid
         * @param newName
         * @returns {Promise<void>}
         */
        async function updateName(uuid, newName) {
            try {
                // If user is login
                if (userStore.isLogin) {
                    // Update the account name in the backend
                    const requestParams = {
                        clientId: getClientId(),
                    }
                    const requestBody = {
                        account_uuid: uuid,
                        account_name: newName
                    };

                    const updateResponse = await updateAccountName(requestParams, requestBody);
                    if (updateResponse.code !== 200) {
                        showInfo(updateResponse.msg);
                        return;
                    }

                    // Update the account name in the local data
                    const target = remoteAccounts.value.find(item => item.uuid === uuid);
                    target.name = newName;
                    showSuccess("游戏账户名称更新成功")
                } else {
                    // Update the account name in the local data
                    const target = localAccounts.value.find(item => item.uuid === uuid);
                    target.name = newName;
                    showSuccess("本地游戏账户名称更新成功")
                }
            } catch (error) {
                console.error("Fail to update new account name:", error);
                showError("游戏账户名称更新失败", error);
            }
        }

        /**
         * Update the account's in game uid; if the user is login, update it at the backend.'
         * @param uuid
         * @param newInGameUid
         * @returns {Promise<void>}
         */
        async function updateInGameUid(uuid, newInGameUid) {
            try {
                // If user is login
                if (userStore.isLogin) {
                    // Update the account in game uid in the backend
                    const requestParams = {
                        clientId: getClientId(),
                    }
                    const requestBody = {
                        account_uuid: uuid,
                        account_in_game_uid: newInGameUid
                    };

                    const updateResponse = await updateAccountInGameUid(requestParams, requestBody);
                    if (updateResponse.code !== 200) {
                        showInfo(updateResponse.msg);
                        return;
                    }

                    // Update the account in game uid in the local data
                    const target = remoteAccounts.value.find(item => item.uuid === uuid);
                    target.inGameUid = newInGameUid;
                    showSuccess("游戏账户uid更新成功")
                } else {
                    // Update the account in game uid in the local data
                    const target = localAccounts.value.find(item => item.uuid === uuid);
                    target.inGameUid = newInGameUid;
                    showSuccess("本地游戏账户uid更新成功")
                }
            } catch (error) {
                console.error("Fail to update account's in game uid:", error);
                showError("游戏账户uid更新失败", error);
            }
        }

        /**
         * Delete the target account; if the user is login, delete it at the backend.
         * @param uuid
         * @returns {Promise<void>}
         */
        async function deleteTargetAccount(uuid) {
            try {
                // If user is login
                if (userStore.isLogin) {
                    // Delete the account from the backend if the user is login
                    const requestParams = {
                        clientId: getClientId(),
                    }
                    const requestBody = {
                        account_uuid: uuid
                    };

                    const deleteResponse = await deleteAccount(requestParams, requestBody);
                    if (deleteResponse.code !== 200) {
                        showInfo(deleteResponse.msg);
                        return;
                    }

                    // Remove the account from the local data
                    const index = remoteAccounts.value.findIndex(item => item.uuid === uuid);
                    remoteAccounts.value.splice(index, 1);
                    showSuccess("游戏账户删除成功")
                } else {
                    // Remove the account from the local data
                    const index = localAccounts.value.findIndex(item => item.uuid === uuid);
                    localAccounts.value.splice(index, 1);
                    showSuccess("本地游戏账户删除成功")
                }
            } catch (error) {
                console.error("Fail to delete account:", error);
                showError("游戏账户删除失败", error)
            }
        }

        function removeRemoteAccount() {
            remoteAccounts.value = [];
        }

        return {
            remoteAccounts,
            localAccounts,
            getAccounts,
            fetchAccounts,
            fetchAccountByUuid,
            fetchNewAccountByUuid,
            fetchAccountRecords,
            createNew,
            updateName,
            updateInGameUid,
            deleteTargetAccount,
            removeRemoteAccount
        };
    },
    {persist: true}
);