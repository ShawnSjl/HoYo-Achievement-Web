import api from "@/utils/request";

// Get all ZZZ achievement
export const zzzGetAll = (request) => {
    return api.get('/api/zzz/all', {params: request});
}

// Get all ZZZ achievement with empty record
export const zzzGetAllEmpty = () => {
    return api.get('/api/zzz/all-empty-record');
}

// Update one ZZZ achievement status
export const zzzUpdateAchievement = (request) => {
    return api.put("/api/zzz/update", request);
};

// Get all ZZZ achievement branch
export const zzzGetAllBranch = () => {
    return api.get('/api/zzz/branches');
}
