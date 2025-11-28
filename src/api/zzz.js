import api from "@/utils/request";

// Get all ZZZ achievement
export const zzzGetAll = () => {
    return api.get('/zzz/all');
}

// Update one ZZZ achievement status
export const zzzUpdateAchievement = (updates) => {
    return api.put("/zzz/user-update", updates);
};

// Get all ZZZ achievement branch
export const zzzGetAllBranch = () => {
    return api.get('/zzz/branch');
}