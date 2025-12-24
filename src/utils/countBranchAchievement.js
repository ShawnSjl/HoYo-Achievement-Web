import {showError} from "@/utils/notification.js";
import {useSrAchievementStore} from "@/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";

/**
 * Get the total number of additional achievements in all branches.
 * @param type 'SR' or 'ZZZ'
 * @returns number
 */
export const branchAchievementCount = (type) => {
    let branches;
    switch (type) {
        case 'SR':
            const srStore = useSrAchievementStore();
            branches = srStore.branches;
            break;
        case 'ZZZ':
            const zzzStore = useZzzAchievementStore();
            branches = zzzStore.branches;
            break;
        default:
            showError("未知游戏类型");
            return 0;
    }

    let count = 0;
    for (const branch of branches) {
        count = count + branch.achievement_id.length - 1;
    }
    return count;
}

/**
 * Get the total number of additional achievements in all branches with the specified level.
 * @param type 'SR' or 'ZZZ'
 * @param level
 * @returns {number}
 */
export const branchAchievementCountByLevel = (type, level) => {
    let store;
    switch (type) {
        case 'SR':
            store = useSrAchievementStore();
            break;
        case 'ZZZ':
            store = useZzzAchievementStore();
            break;
        default:
            showError("未知游戏类型");
            return 0;
    }

    let count = 0;
    for (const branch of store.branches) {
        // Get an example achievement from the branch
        const achievementId = branch.achievement_id[0];
        const achievement = store.achievementMap.get(achievementId);

        // If the level matches, add to the total count
        if (achievement.reward_level !== level) continue;
        count = count + branch.achievement_id.length - 1;
    }
    return count;
}

/**
 * Get the total number of additional achievements in all branches with the specified class.
 * @param type 'SR' or 'ZZZ'
 * @param achievement_class
 * @returns number
 */
export const branchAchievementCountByClass = (type, achievement_class) => {
    let store;
    switch (type) {
        case 'SR':
            store = useSrAchievementStore();
            break;
        case 'ZZZ':
            store = useZzzAchievementStore();
            break;
        default:
            showError("未知游戏类型");
            return 0;
    }

    let count = 0;
    for (const branch of store.branches) {
        // Get an example achievement from the branch
        const achievementId = branch.achievement_id[0];
        const achievement = store.achievementMap.get(achievementId);

        // If the level matches, add to the total count
        if (type === 'SR') {
            if (achievement.class_name !== achievement_class) continue;
        } else {
            if (achievement.class_id !== achievement_class) continue;
        }
        count = count + branch.achievement_id.length - 1;
    }
    return count;
}

/**
 * Get the total number of additional achievements in all branches with the specified class and level.
 * @param type 'SR' or 'ZZZ'
 * @param achievement_class
 * @param level
 * @returns {number}
 */
export const branchAchievementCountByClassAndLevel = (type, achievement_class, level) => {
    let store;
    switch (type) {
        case 'SR':
            store = useSrAchievementStore();
            break;
        case 'ZZZ':
            store = useZzzAchievementStore();
            break;
        default:
            showError("未知游戏类型");
            return 0;
    }

    let count = 0;
    for (const branch of store.branches) {
        // Get an example achievement from the branch
        const achievementId = branch.achievement_id[0];
        const achievement = store.achievementMap.get(achievementId);

        // If the level matches, add to the total count
        if (achievement.reward_level !== level) continue;
        if (type === 'SR') {
            if (achievement.class_name !== achievement_class) continue;
        } else {
            if (achievement.class_id !== achievement_class) continue;
        }
        count = count + branch.achievement_id.length - 1;
    }
    return count;
}
