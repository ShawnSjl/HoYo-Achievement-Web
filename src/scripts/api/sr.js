import api from "@/scripts/api/request.js"

// Get all SR achievement
export const srGetAllAchievement = () => {
    return api.get('/api/sr/all');
}

// Get account's SR records
export const srGetAccountRecord = (request) => {
    return api.get('/api/sr/account-records', {params: request});
}

// Update one SR achievement status
export const srUpdateAchievement = (request) => {
    return api.put("/api/sr/update", request);
};

// Get all SR achievement branch
export const srGetAllBranch = () => {
    return api.get('/api/sr/branches');
}
