import api from "@/utils/request";

// Get all ZZZ achievement
export const zzzGetAllAchievement = () => {
    return api.get('/api/zzz/all');
}

// Get account's ZZZ records
export const zzzGetAccountRecord = (request) => {
    return api.get('/api/zzz/account-records', {params: request});
}

// Update one ZZZ achievement status
export const zzzUpdateAchievement = (request) => {
    return api.put("/api/zzz/update", request);
};

// Get all ZZZ achievement branch
export const zzzGetAllBranch = () => {
    return api.get('/api/zzz/branches');
}
