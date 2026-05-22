import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {showError, showInfo, showSuccess, showWarn} from "@/scripts/utils/notification.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {getGameInfoByGameId} from "@/scripts/api/gameInfo.js";
import {useUserStore} from "@/scripts/stores/userStore.js";
import {
    getAllAchievementByGameId,
    getAllBranchByGameId,
    updateAchievementBatch,
    updateAchievementById
} from "@/scripts/api/achievement.js";

export const useZzzAchievementStore = defineStore(
    'zzzAchievementStore',
    () => {
        const userStore = useUserStore();
        const accountStore = useAccountStore();

        const achievementVersion = ref("0.0");
        const achievements = ref([]);
        const branches = ref([]);
        const isMale = ref(true);
        const isCompleteFirst = ref(false);

        const gameId = "ZZZ";

        /**
         * Fetch achievement version from the backend.
         * @return {Promise<void>}
         */
        async function fetchAchievementVersion() {
            try {
                const requestParams = {gameId: gameId};
                const resp = await getGameInfoByGameId(requestParams);
                if (resp.code === 200) {
                    achievementVersion.value = resp.data.game_version;
                    showSuccess("检查ZZZ成就版本", resp.msg)
                } else {
                    showWarn(resp.msg)
                }
            } catch (error) {
                console.error("Fail to get ZZZ achievement version:", error);
                showError("ZZZ成就版本获取失败", error);
            }
        }

        /**
         * Fetch achievements from the backend.
         * @returns {Promise<void>}
         */
        async function fetchAchievements() {
            try {
                const requestParams = {gameId: gameId};
                const response = await getAllAchievementByGameId(requestParams);
                if (response.code === 200) {
                    achievements.value = response.data;
                } else {
                    showInfo(response.msg);
                }
            } catch (error) {
                console.error("Fail to get ZZZ achievements:", error);
                showError("ZZZ成就列表获取失败", error);
            }
        }

        /**
         * Map achievement_id to an achievement object.
         * @type {ComputedRef<Map<any, any>>}
         */
        const achievementMap = computed(() => {
            const map = new Map();
            if (achievements.value && achievements.value.length > 0) {
                achievements.value.forEach(item => {
                    map.set(item.achievement_id, item);
                });
            }
            return map;
        });

        /**
         * Fetch branches from the backend.
         * @returns {Promise<void>}
         */
        async function fetchBranches() {
            try {
                const requestParams = {gameId: gameId};
                const response = await getAllBranchByGameId(requestParams);
                if (response.code === 200) {
                    branches.value = processBranchData(response.data);
                } else {
                    showInfo(response.msg);
                }
            } catch (error) {
                console.error("Fail to get ZZZ achievements\' branches:", error);
                showError("ZZZ成就分支获取失败", error)
            }
        }

        /**
         * Force to fetch all data from the backend.
         * @return {Promise<void>}
         */
        async function fetchAll() {
            await fetchAchievementVersion()
            await fetchAchievements();
            await fetchBranches();
        }

        /**
         * Check the version of the achievement data and fetch data from the backend if the version is different.
         * @return {Promise<void>}
         */
        async function checkAchievementVersion() {
            const oldValue = achievementVersion.value;
            await fetchAchievementVersion();
            if (oldValue !== achievementVersion.value) {
                await fetchAll();
            }
        }

        /**
         * Ensure that the achievement data is fetched from the backend.
         * @returns {Promise<void>}
         */
        async function ensureAchievementData() {
            // data is empty, fetch data from backend
            if (achievements.value.length === 0 || achievementVersion.value === "0.0") {
                await fetchAll()
            }
        }

        /**
         * Process raw data from the backend into a format suitable for the frontend.
         * @param rawData
         * @returns {any[]}
         */
        function processBranchData(rawData) {
            /*
            [
                {
                    "achievement_id": 8001009,
                    "branch_id": 1
                },
                {
                    "achievement_id": 8001008,
                    "branch_id": 1
                },
            ]
            =>
            [
                {
                    "branch_id": 1,
                    "achievement_id": [8001009, 8001008]
                },
            ]
             */
            const map = new Map();

            rawData.forEach(item => {
                const bid = item.branch_id;

                if (!map.has(bid)) {
                    map.set(bid, {
                        branch_id: bid,
                        achievement_id: []
                    });
                }

                map.get(bid).achievement_id.push(item.achievement_id);
            });

            return Array.from(map.values());
        }

        /**
         * Update achievement status in the backend and local data.
         * @param uuid
         * @param achievementId
         * @param complete
         * @returns {Promise<void>}
         */
        async function completeAchievement(uuid, achievementId, complete) {
            try {
                // Ensure data is fetched from the backend before updating
                await ensureAchievementData();

                // Ignore complete status other than 1 and 0
                if (complete !== 1 && complete !== 0) {
                    showWarn("未知完成状态");
                    return;
                }

                // Check if the target achievement exists in the achievement list
                const targetAchievement = achievementMap.value.get(achievementId);
                if (!targetAchievement) {
                    showWarn("未知成就ID");
                    return;
                }

                // Get records by given uuid
                const account = accountStore.getAccounts().find(item => item.uuid === uuid);
                const records = account.records;

                // Get the target record from the record list
                const targetRecord = records.find(record => record.achievement_id === achievementId);

                // If the target record exists and the complete status is the same, ignore the update
                if (targetRecord && targetRecord.complete === complete) {
                    return;
                }

                // Update achievement in the backend if the user is logged in
                if (userStore.isLogin) {
                    const requestBody = {
                        uuid: uuid,
                        game_id: gameId,
                        achievement_id: `${achievementId}`,
                        complete_status: `${complete}`
                    }
                    const updateResponse = await updateAchievementById(requestBody);
                    if (updateResponse.code !== 200) {
                        showInfo(updateResponse.msg)
                        return;
                    }
                }

                // If the target record does not exist, add a new record to the record list
                if (!targetRecord) {
                    records.push({
                        account_uuid: uuid,
                        achievement_id: achievementId,
                        complete: complete,
                    })
                }
                // If the target record exists but the complete status is different, update the complete status
                else {
                    targetRecord.complete = complete;
                }

                // Update other achievements in the same branch
                const branchAchievements = getOtherAchievements(achievementId);
                const branchStatus = complete === 1 ? 2 : 0;
                for (const branchAchievement of branchAchievements) {
                    const branchTarget = records.find(record => record.achievement_id === branchAchievement);
                    if (branchTarget) {
                        branchTarget.complete = branchStatus;
                    } else {
                        records.push({
                            account_uuid: uuid,
                            achievement_id: branchAchievement,
                            complete: branchStatus,
                        })
                    }
                }
            } catch (error) {
                console.error("Fail to update achievement:", error);
                showError("成就状态更新失败", error);
            }
        }

        async function handleJson(uuid, json) {
            try {
                // Ensure data is fetched from the backend before updating
                await ensureAchievementData();

                // Get records by given uuid
                const account = accountStore.getAccounts().find(item => item.uuid === uuid);
                const records = account.records;

                // 更新记录
                const batch = []; // 记录更新数据
                const errorMessages = []; // 记录错误

                for (const item of json) {
                    const complete = Number(item.complete) === 1 || item.complete === '已完成' ? 1 : 0;

                    // Check if the target achievement exists in the achievement list
                    const targetAchievement = achievementMap.value.get(item.achievement_id);
                    if (!targetAchievement) {
                        errorMessages.push(item.achievement_id);
                        if (errorMessages.length >= 10) {
                            showError('成就表格导入失败', '错误次数过多');
                            return false;
                        }
                        continue;
                    }

                    // Get the target record from the record list
                    const targetRecord = records.find(record => record.achievement_id === item.achievement_id);

                    // If the target record exists and the complete status is the same, ignore the update
                    if (targetRecord && targetRecord.complete === complete) {
                        continue;
                    }
                    // If the target record exists and the complete status is 2, ignore the update
                    if (targetRecord && targetRecord.complete === 2 && complete === 0) {
                        continue;
                    }

                    // Update achievement in the backend if the user is logged in
                    if (userStore.isLogin) {
                        const requestBody = {
                            uuid: item.uuid,
                            game_id: gameId,
                            achievement_id: `${item.achievement_id}`,
                            complete_status: `${item.complete}`
                        }
                        batch.push(requestBody);
                    }

                    // If the target record does not exist, add a new record to the record list
                    if (!targetRecord) {
                        records.push({
                            account_uuid: uuid,
                            achievement_id: item.achievement_id,
                            complete: complete,
                        })
                    }
                    // If the target record exists but the complete status is different, update the complete status
                    else {
                        targetRecord.complete = complete;
                    }

                    // Update other achievements in the same branch
                    const branchAchievements = getOtherAchievements(item.achievement_id);
                    const branchStatus = complete === 1 ? 2 : 0;
                    for (const branchAchievement of branchAchievements) {
                        const branchTarget = records.find(record => record.achievement_id === branchAchievement);
                        if (branchTarget) {
                            branchTarget.complete = branchStatus;
                        } else {
                            records.push({
                                account_uuid: uuid,
                                achievement_id: branchAchievement,
                                complete: branchStatus,
                            })
                        }
                    }
                }

                // Show know ids
                if (errorMessages.length > 0) {
                    showWarn('未知成就ID', String.join(', ', errorMessages))
                }

                // Update records in the backend
                if (userStore.isLogin) {
                    const updateResponse = await updateAchievementBatch(batch);
                    if (updateResponse.code !== 200) {
                        showWarn(updateResponse.msg)
                        return;
                    }
                }

                showSuccess('成就表格导入成功')
            } catch (error) {
                console.error("Fail to import achievements:", error);
                showError("成就表格导入失败", error);
            }
        }

        /**
         * Get other achievements in the same branch out of the target achievement.
         * @param targetId
         * @returns []
         */
        function getOtherAchievements(targetId) {
            const branch = branches.value.find(item => item.achievement_id.includes(targetId));
            if (!branch) return []; // return empty array if not found

            return branch.achievement_id.filter(id => id !== targetId);
        }

        /**
         * Get the branch ID of the target achievement.
         * @param achievementId
         * @return {*}
         */
        function getAchievementBranchID(achievementId) {
            const branch = branches.value.find(item => item.achievement_id.includes(achievementId));
            if (!branch) return 0;
            return branch.branch_id;
        }

        return {
            achievementVersion,
            achievements,
            achievementMap,
            branches,
            isMale,
            isCompleteFirst,
            fetchAll,
            checkAchievementVersion,
            ensureAchievementData,
            completeAchievement,
            handleJson,
            getAchievementBranchID,
        };
    },
    {
        persist: true,
    },
);
