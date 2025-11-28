import api from "@/utils/request"

// Get all SR achievement
export const srGetAll = () => {
    return api.get('/sr/all');
}

// Update one SR achievement status
export const srUpdateAchievement = (updates) => {
    return api.put("/sr/user-update", updates);
};

// Get all SR achievement branch
export const srGetAllBranch = () => {
    return api.get('/sr/branch');
}