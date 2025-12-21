import {defineStore} from "pinia";
import {ref} from "vue";
import {srGetAllBranch, srUpdateAchievement} from "@/api/sr";
import {showError, showInfo} from "@/utils/notification.js";

export const useSrAchievementStore = defineStore(
    'sr-achievement',
    () => {
        const branches = ref([]);
        const isCompleteFirst = ref(false);

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
                showError("成就分支获取失败", error)
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
         * @param achievements
         * @param achievementId
         * @param complete
         * @returns {Promise<void>}
         */
        async function completeAchievement(achievements, achievementId, complete) {
            try {
                if (branches.value.length === 0) await fetchBranches();

                // Get target achievement from the achievements list
                const target = achievements.value.find(item => item.achievement_id === achievementId);
                if (!target) {
                    console.error('Fail to get achievements:', achievementId);
                    showError("目标成就获取失败");
                    return;
                }

                // Ignore unchanged data
                if (target.complete === complete) {
                    return;
                }

                // Update achievement in the backend if the user is logged in
                if (localStorage.getItem('token')) {
                    const requestBody = {
                        uuid: "",
                        achievement_id: `${achievementId}`,
                        complete_status: `${complete}`
                    }

                    const updateResponse = await srUpdateAchievement(requestBody);
                    if (updateResponse.data.code !== 200) {
                        showInfo(updateResponse.data.msg)
                        return;
                    }
                }

                // Update local data
                target.complete = complete;

                // Update other achievements in the same branch
                const branchAchievements = getOtherAchievements(achievements, achievementId);
                const branchStatus = complete === 1 ? 2 : 0;
                for (const branchAchievement of branchAchievements) {
                    const branchTarget = achievements.value.find(item => item.achievement_id === branchAchievement);
                    branchTarget.complete = branchStatus;
                }
            } catch (error) {
                console.error("Fail to update achievements:", error);
                showError("成就状态更新失败", error);
            }
        }

        /**
         * Get other achievements in the same branch out of the target achievement.
         * @param achievements
         * @param targetId
         * @returns {Promise<*|*[]>}
         */
        async function getOtherAchievements(achievements, targetId) {
            if (branches.value.length === 0) await fetchBranches();

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
         * @param achievements
         * @param level
         * @returns number
         */
        function getBranchAchievementNumberByLevel(achievements, level) {
            let count = 0;
            for (const branch of branches.value) {
                // Get an example achievement from the branch
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.find(item => item.achievement_id === achievement_id);

                // If the level matches, add to the total count
                if (level === achievement.reward_level) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of additional achievements in all branches with the specified class.
         * @param achievements
         * @param sr_class
         * @returns number
         */
        function getBranchAchievementsNumberByClass(achievements, sr_class) {
            let count = 0;
            for (const branch of branches.value) {
                // Get an example achievement from the branch
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.find(item => item.achievement_id === achievement_id);

                // If the class matches, add to the total count
                if (sr_class === achievement.class_name) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        /**
         * Get the total number of additional achievements in all branches with the specified class and level.
         * @param achievements
         * @param sr_class
         * @param level
         * @returns number
         */
        function getBranchAchievementNumberByClassAndLevel(achievements, sr_class, level) {
            let count = 0;
            for (const branch of branches.value) {
                // Get an example achievement from the branch
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.find(item => item.achievement_id === achievement_id);

                // If the class and level matches, add to the total count
                if (sr_class === achievement.class_name && level === achievement.reward_level) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        return {
            branches,
            isCompleteFirst,
            completeAchievement,
            ensureBranchData,
            getBranchAchievementsNumber,
            getBranchAchievementNumberByLevel,
            getBranchAchievementsNumberByClass,
            getBranchAchievementNumberByClassAndLevel
        };
    },
    {
        persist: true,
    }
);
