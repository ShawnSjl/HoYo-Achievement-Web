import {useAccountStore} from "@/stores/accountStore.js";
import {useSrAchievementStore} from "@/stores/srAchievementStore.js";
import {useZzzAchievementStore} from "@/stores/zzzAchievementsStore.js";
import {showError} from "@/utils/notification.js";

/**
 * Get the total number of complete records in a given level.
 * @param type
 * @param uuid
 * @param level
 * @returns {number}
 */
export const completeAchievementCountByLevel = (type, uuid, level) => {
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

    // Get records by given uuid
    const accountStore = useAccountStore();
    const account = accountStore.getAccounts().find(item => item.uuid === uuid);

    // Get the number of complete records by the given level
    let count = 0;
    for (const record of account.records) {
        if (record.complete !== 1) continue;

        const achievement = store.achievementMap.get(record.achievement_id);
        if (!achievement) continue;
        if (achievement.reward_level !== level) continue;
        count++;
    }
    return count;
}

/**
 * Get the total number of complete records in a given class.
 * @param type
 * @param uuid
 * @param achievement_class
 * @returns {number}
 */
export const completeAchievementCountByClass = (type, uuid, achievement_class) => {
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

    // Get records by given uuid
    const accountStore = useAccountStore();
    const account = accountStore.getAccounts().find(item => item.uuid === uuid);

    // Get the number of complete records by the given level
    let count = 0;
    for (const record of account.records) {
        if (record.complete !== 1) continue;

        // If the class matches, add to the total count
        const achievement = store.achievementMap.get(record.achievement_id);
        if (!achievement) continue;
        if (type === 'SR') {
            if (achievement.class_name !== achievement_class) continue;
        } else {
            if (achievement.class_id !== achievement_class) continue;
        }
        count++;
    }
    return count;
}

/**
 * Get the total number of complete records in a given class and level.
 * @param type
 * @param uuid
 * @param achievement_class
 * @param level
 * @returns {number}
 */
export const completeAchievementCountByClassAndLevel = (type, uuid, achievement_class, level) => {
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

    // Get records by given uuid
    const accountStore = useAccountStore();
    const account = accountStore.getAccounts().find(item => item.uuid === uuid);

    // Get the number of complete records by the given level
    let count = 0;
    for (const record of account.records) {
        if (record.complete !== 1) continue;

        // If the class matches, add to the total count
        const achievement = store.achievementMap.get(record.achievement_id);
        if (!achievement) continue;
        if (achievement.reward_level !== level) continue;
        if (type === 'SR') {
            if (achievement.class_name !== achievement_class) continue;
        } else {
            if (achievement.class_id !== achievement_class) continue;
        }
        count++;
    }
    return count;
}
