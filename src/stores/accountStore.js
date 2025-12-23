import {defineStore} from "pinia";
import {ref} from "vue";
import {
    createAccount,
    deleteAccount,
    getAccountByUserId,
    updateAccountInGameUid,
    updateAccountName
} from "@/api/account.js";
import {showError, showInfo, showSuccess} from "@/utils/notification.js";
import {srGetAll, srGetAllEmpty} from "@/api/sr.js";
import {zzzGetAccountRecord} from "@/api/zzz.js";
import {v7 as uuidv7} from 'uuid';
import {useUserStore} from "@/stores/userStore.js";

export const useAccountStore = defineStore(
    'account',
    () => {
        const remoteAccounts = ref([]);
        const localAccounts = ref([]);

        /**
         * Return the list of accounts. If the user is logged in, return the accounts from the backend; otherwise, return the local data.
         * @returns {UnwrapRef<*[]>}
         */
        function getAccounts() {
            const userStore = useUserStore();
            if (userStore.token !== '') {
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
                if (accountsResponse.data.code !== 200) {
                    showInfo(accountsResponse.data.msg)
                    return;
                }
                showSuccess(accountsResponse.data.msg);

                // For each account, get achievements from the backend
                for (const account of accountsResponse.data.data) {
                    // Get achievements from the backend
                    const requestBody = {uuid: account.account_uuid};
                    let achievementResponse;
                    switch (account.game_type) {
                        case "SR":
                            achievementResponse = await srGetAll(requestBody);
                            break;
                        case "ZZZ":
                            achievementResponse = await zzzGetAccountRecord(requestBody);
                            break;
                        default:
                            showError("未知游戏类型");
                            return;
                    }

                    // Create a data structure for the account
                    const accountData = {
                        uuid: account.account_uuid,
                        type: account.game_type,
                        name: account.account_name,
                        inGameUid: account.account_in_game_uid,
                        records: achievementResponse.data.data,
                    }

                    // Push the account to the list
                    remoteAccounts.value.push(accountData);
                }
            } catch (error) {
                console.error('Fail to get accounts:', error);
                showError("游戏账号获取错误", error)
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
                if (localStorage.getItem('token')) {
                    const requestBody = {
                        account_uuid: uuid,
                        game_type: type,
                        account_name: accountName,
                        account_in_game_uid: inGameUid,
                    }
                    const createResponse = await createAccount(requestBody);
                    if (createResponse.data.code !== 200) {
                        showInfo(createResponse.data.msg);
                        return;
                    }
                }

                // Get achievements with empty record from the backend
                let achievementResponse;
                switch (type) {
                    case "SR":
                        achievementResponse = await srGetAllEmpty();
                        break;
                    case "ZZZ":
                        // achievementResponse = await zzzGetAllEmpty();
                        break;
                    default:
                        showError("未知游戏类型");
                        return;
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
                if (localStorage.getItem('token')) {
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
                // Update the account name in the backend if the user is login
                if (localStorage.getItem('token')) {
                    const requestBody = {
                        account_uuid: uuid,
                        account_name: newName
                    };

                    const updateResponse = await updateAccountName(requestBody);
                    if (updateResponse.data.code !== 200) {
                        showInfo(updateResponse.data.msg);
                        return;
                    }
                }

                // Update the account name in the local data
                if (localStorage.getItem('token')) {
                    const target = remoteAccounts.value.find(item => item.uuid === uuid);
                    target.name = newName;
                    showSuccess("游戏账户名称更新成功")
                } else {
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
                // Update the account in game uid in the backend if the user is login
                if (localStorage.getItem('token')) {
                    const requestBody = {
                        account_uuid: uuid,
                        account_in_game_uid: newInGameUid
                    };

                    const updateResponse = await updateAccountInGameUid(requestBody);
                    if (updateResponse.data.code !== 200) {
                        showInfo(updateResponse.data.msg);
                        return;
                    }
                }

                // Update the account in game uid in the local data
                if (localStorage.getItem('token')) {
                    const target = remoteAccounts.value.find(item => item.uuid === uuid);
                    target.inGameUid = newInGameUid;
                    showSuccess("游戏账户uid更新成功")
                } else {
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
                // Delete the account from the backend if the user is login
                if (localStorage.getItem('token')) {
                    const requestBody = {
                        account_uuid: uuid
                    };

                    const deleteResponse = await deleteAccount(requestBody);
                    if (deleteResponse.data.code !== 200) {
                        showInfo(deleteResponse.data.msg);
                        return;
                    }
                }

                // Remove the account from the local data
                if (localStorage.getItem('token')) {
                    const index = remoteAccounts.value.findIndex(item => item.uuid === uuid);
                    remoteAccounts.value.splice(index, 1);
                    showSuccess("游戏账户删除成功")
                } else {
                    const index = localAccounts.value.findIndex(item => item.uuid === uuid);
                    localAccounts.value.splice(index, 1);
                    showSuccess("本地游戏账户删除成功")
                }
            } catch (error) {
                console.error("Fail to delete account:", error);
                showError("游戏账户删除失败", error)
            }
        }

        return {
            remoteAccounts,
            localAccounts,
            getAccounts,
            fetchAccounts,
            createNew,
            updateName,
            updateInGameUid,
            deleteTargetAccount
        };
    },
    {persist: true}
);