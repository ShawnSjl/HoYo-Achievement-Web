import {defineStore} from "pinia";
import {ref} from "vue";
import {srGetAll, srGetAllBranch, srUpdateAchievement} from "@/api/sr";

export const useSrAchievementStore = defineStore (
    'sr-achievements',
    () => {
        const achievements = ref([]);
        const branches = ref([]);
        const length = ref(0);
        const currentUser = ref(null);
        const isCompleteFirst = ref(false);

        // Get achievements for current user
        async function fetchAchievements() {
            // 强制更新，忽略本地数据
            try {
                const response = await srGetAll();
                achievements.value = response.achievements;

                branches.value = await srGetAllBranch();
            } catch (error) {
                console.error('Fail to get achievements:', error);
                achievements.value = [];
            }

            // 更新用户信息用于比对
            currentUser.value = localStorage.getItem("user")

            // 储存条目数，做简单的验证
            length.value = achievements.value.length;
        }

        // Update achievement
        async function updateAchievements() {
            const user = localStorage.getItem('user');

            // 如果本地数据是空的或者有异常，获取新的数据
            if (achievements.value.length === 0 || achievements.value.length !== length.value) {
                await fetchAchievements();
            } else if (currentUser.value !== user) {
                // 如果用户变更，则立刻更新数据
                await fetchAchievements();
            }
        }

        async function completeAchievement(achievementId, complete) {
            await updateAchievements();

            const user = localStorage.getItem('user');

            // 获取本地的成就数据
            const target = achievements.value.find(item => item.achievement_id === achievementId);
            if (!target) { console.error('Fail to get achievements:', achievementId); return; }

            // 忽略未更改数据
            if (target.complete === complete) {
                return;
            }

            // 如果是登录用户，更新后端数据库
            if (user) {
                // 尝试更新，如果更新失败，重新获取所有数据
                try {
                    await srUpdateAchievement({ achievement_id: `${achievementId}`, complete: `${complete}` });
                } catch (error) {
                    console.error('Fail to update achievements:', error);
                    await fetchAchievements();
                    return;
                }
            }

            // 更新本地数据
            target.complete = complete;
            const branchAchievements = getOtherAchievements (achievementId);
            const branchStatus = complete === 1 ? 2 : 0;
            for (const branchAchievement of branchAchievements) {
                const branchTarget = achievements.value.find(item => item.achievement_id === branchAchievement);
                branchTarget.complete = branchStatus;
            }
        }

        function getOtherAchievements(targetId) {
            const branch = branches.value.find(item => item.achievement_id.includes(targetId));
            if (!branch) return []; // 找不到直接返回空数组

            return branch.achievement_id.filter(id => id !== targetId);
        }

        function getBranchAchievementsNumber() {
            let count = 0;
            for (const branch of branches.value) {
                count = count + branch.achievement_id.length - 1;
            }
            return count;
        }

        function getBranchAchievementNumberByLevel(level) {
            if (achievements.value.length === 0) {
                fetchAchievements();
            }

            let count = 0;
            for (const branch of branches.value) {
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.value.find(item => item.achievement_id === achievement_id);

                if (level === achievement.reward_level) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        function getBranchAchievementsNumberByClass(sr_class) {
            if (achievements.value.length === 0) {
                fetchAchievements();
            }

            let count = 0;
            for (const branch of branches.value) {
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.value.find(item => item.achievement_id === achievement_id);

                if (sr_class === achievement.class) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        function getBranchAchievementNumberByClassAndLevel(sr_class, level) {
            if (achievements.value.length === 0) {
                fetchAchievements();
            }

            let count = 0;
            for (const branch of branches.value) {
                const achievement_id = branch.achievement_id[0];
                const achievement = achievements.value.find(item => item.achievement_id === achievement_id);

                if (sr_class === achievement.class && level === achievement.reward_level) {
                    count = count + branch.achievement_id.length - 1;
                }
            }
            return count;
        }

        return {
            achievements,
            isCompleteFirst,
            currentUser,
            length,
            branches,
            fetchAchievements,
            updateAchievements,
            completeAchievement,
            getBranchAchievementsNumber,
            getBranchAchievementNumberByLevel,
            getBranchAchievementsNumberByClass,
            getBranchAchievementNumberByClassAndLevel };
    },
    {
        persist: true,
    }
);