import {defineStore} from "pinia";
import {ref} from "vue";
import {srGetAllAchievement, srGetAllBranch, srUpdateAchievement} from "@/api/sr";
import {showError, showInfo, showWarn} from "@/utils/notification.js";
import {useAccountStore} from "@/stores/accountStore.js";

export const useSrAchievementStore = defineStore(
    'sr-achievement',
    () => {
        const achievements = ref([]);
        const branches = ref([]);
        const isCompleteFirst = ref(false);

        /**
         * Fetch achievements from the backend.
         * @returns {Promise<void>}
         */
        async function fetchAchievements() {
            try {
                const response = await srGetAllAchievement();
                if (response.data.code === 200) {
                    achievements.value = response.data.data;
                } else {
                    showInfo(response.data.msg);
                }
            } catch (error) {
                console.error("Fail to get SR achievements:", error);
                showError("SR成就列表获取失败", error);
            }
        }

        /**
         * Ensure that the achievements data is fetched from the backend.
         * @returns {Promise<void>}
         */
        async function ensureAchievementData() {
            if (achievements.value.length === 0) await fetchAchievements();
        }

        /**
         * Fetch branches from the backend.
         * @returns {Promise<void>}
         */
        async function fetchBranches() {
            try {
                const response = await srGetAllBranch();
                if (response.data.code === 200) {
                    branches.value = processBranchData(response.data.data);
                } else {
                    showInfo(response.data.msg);
                }
            } catch (error) {
                console.error("Fail to get SR achievements\' branches:", error);
                showError("SR成就分支获取失败", error)
            }
        }

        /**
         * Ensure that the branches data is fetched from the backend.
         * @returns {Promise<void>}
         */
        async function ensureBranchData() {
            if (branches.value.length === 0) await fetchBranches();
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
                await ensureBranchData();
                await ensureAchievementData();

                // Ignore complete status other than 1 and 0
                if (complete !== 1 && complete !== 0) {
                    showWarn("未知完成状态");
                    return;
                }

                // Check if the target achievement exists in the achievements list
                const targetAchievement = achievements.value.find(item => item.achievement_id === achievementId);
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

                    const updateResponse = await srUpdateAchievement(requestBody);
                    if (updateResponse.data.code !== 200) {
                        showInfo(updateResponse.data.msg)
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
         * Get the total number of additional achievements in all branches.
         * @returns number
         */
        function getBranchAchievementsNumber() {
            let count = 0;
            for (const branch of branches.value) {
                count = count + branch.achievement_id.length - 1;
            }
            return count;
        }

        /**
         * Get the total number of additional achievements in all branches with the specified level.
         * @param level
         * @returns number
         */
        function getBranchAchievementNumberByLevel(level) {
            let count = 0;
            for (const branch of branches.value) {
                // Get an example achievement from the branch
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.value.find(item => item.achievement_id === achievement_id);

                // If the level matches, add to the total count
                if (level === achievement.reward_level) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of additional achievements in all branches with the specified class.
         * @param sr_class
         * @returns number
         */
        function getBranchAchievementsNumberByClass(sr_class) {
            let count = 0;
            for (const branch of branches.value) {
                // Get an example achievement from the branch
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.value.find(item => item.achievement_id === achievement_id);

                // If the class matches, add to the total count
                if (sr_class === achievement.class_name) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of additional achievements in all branches with the specified class and level.
         * @param sr_class
         * @param level
         * @returns number
         */
        function getBranchAchievementNumberByClassAndLevel(sr_class, level) {
            let count = 0;
            for (const branch of branches.value) {
                // Get an example achievement from the branch
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.value.find(item => item.achievement_id === achievement_id);

                // If the class and level matches, add to the total count
                if (sr_class === achievement.class_name && level === achievement.reward_level) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of complete records in a given level.
         * @param uuid
         * @param level
         * @returns {number}
         */
        function getCompleteRecordNumberByLevel(uuid, level) {
            // Get records by given uuid
            const accountStore = useAccountStore();
            const account = accountStore.getAccounts().find(item => item.uuid === uuid);
            const records = account.records;

            // Get the number of complete records by the given level
            const completeRecords = records.filter(record => record.complete === 1);
            let count = 0;
            for (const completeRecord of completeRecords) {
                const achievement = achievements.value.find(item => item.achievement_id === completeRecord.achievement_id);
                if (achievement.reward_level === level) {
                    count = count + 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of complete records in a given class id.
         * @param uuid
         * @param sr_class
         * @returns {number}
         */
        function getCompleteRecordNumberByClass(uuid, sr_class) {
            // Get records by given uuid
            const accountStore = useAccountStore();
            const account = accountStore.getAccounts().find(item => item.uuid === uuid);
            const records = account.records;

            // Get the number of complete records by the given level
            const completeRecords = records.filter(record => record.complete === 1);
            let count = 0;
            for (const completeRecord of completeRecords) {
                const achievement = achievements.value.find(item => item.achievement_id === completeRecord.achievement_id);
                if (achievement.class_name === sr_class) {
                    count = count + 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of complete records in a given class id.
         * @param uuid
         * @param sr_class
         * @param level
         * @returns {number}
         */
        function getCompleteRecordNumberByClassAndLevel(uuid, sr_class, level) {
            // Get records by given uuid
            const accountStore = useAccountStore();
            const account = accountStore.getAccounts().find(item => item.uuid === uuid);
            const records = account.records;

            // Get the number of complete records by the given level
            const completeRecords = records.filter(record => record.complete === 1);
            let count = 0;
            for (const completeRecord of completeRecords) {
                const achievement = achievements.value.find(item => item.achievement_id === completeRecord.achievement_id);
                if (achievement.class_name === sr_class && achievement.reward_level === level) {
                    count = count + 1;
                }
            }
            return count;
        }

        return {
            achievements,
            branches,
            isCompleteFirst,
            fetchAchievements,
            ensureAchievementData,
            fetchBranches,
            ensureBranchData,
            completeAchievement,
            getBranchAchievementsNumber,
            getBranchAchievementNumberByLevel,
            getBranchAchievementsNumberByClass,
            getBranchAchievementNumberByClassAndLevel,
            getCompleteRecordNumberByLevel,
            getCompleteRecordNumberByClass,
            getCompleteRecordNumberByClassAndLevel
        };
    },
    {
        persist: true,
    }
);
