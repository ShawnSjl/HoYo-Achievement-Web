import api from "@/scripts/api/request.js"

// Get all SR achievement
export const srGetAllAchievement = () => {
    return api.get('/sr/all');
}

// Get account's SR records
export const srGetAccountRecord = (request) => {
    return api.get('/sr/account-records', {params: request});
}

// Update one SR achievement status
export const srUpdateAchievement = (request) => {
    return api.put('/sr/update', request);
};

// Get all SR achievement branch
export const srGetAllBranch = () => {
    return api.get('/sr/branches');
}
