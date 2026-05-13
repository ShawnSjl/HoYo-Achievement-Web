import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {zzzGetAllAchievement, zzzGetAllBranch, zzzUpdateAchievement} from '@/scripts/api/zzz.js';
import {showError, showInfo, showSuccess, showWarn} from "@/scripts/utils/notification.js";
import {useAccountStore} from "@/scripts/stores/accountStore.js";
import {getGameInfoByGameId} from "@/scripts/api/gameInfo.js";

export const useZzzAchievementStore = defineStore(
    'zzzAchievementStore',
    () => {
        const achievementVersion = ref("0.0");
        const achievements = ref([]);
        const branches = ref([]);
        const isMale = ref(true);
        const isCompleteFirst = ref(false);

        /**
         * Fetch achievement version from the backend.
         * @return {Promise<void>}
         */
        async function fetchAchievementVersion() {
            try {
                const requestBody = {gameId: 'zzz'};
                const resp = await getGameInfoByGameId(requestBody);
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
                const response = await zzzGetAllAchievement();
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
                const response = await zzzGetAllBranch();
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
                const accountStore = useAccountStore();
                const account = accountStore.getAccounts().find(item => item.uuid === uuid);
                const records = account.records;

                // Get the target record from the record list
                const targetRecord = records.find(record => record.achievement_id === achievementId);

                // If the target record exists and the complete status is the same, ignore the update
                if (targetRecord && targetRecord.complete === complete) {
                    return;
                }

                // Update achievement in the backend if the user is logged in
                if (localStorage.getItem('token')) {
                    const requestBody = {
                        uuid: uuid,
                        achievement_id: `${achievementId}`,
                        complete_status: `${complete}`
                    }

                    const updateResponse = await zzzUpdateAchievement(requestBody);
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
                console.error("Fail to update achievements:", error);
                showError("成就状态更新失败", error);
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
            getAchievementBranchID,
        };
    },
    {
        persist: true,
    },
);
