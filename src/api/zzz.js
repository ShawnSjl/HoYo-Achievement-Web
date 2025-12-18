import api from "@/utils/request";

// Get all ZZZ achievement
export const zzzGetAll = (request) => {
    return api.get('/zzz/all', request);
}

// Get all ZZZ achievement with empty record
export const zzzGetAllEmpty = () => {
    return api.get('/zzz/all-empty-record');
}

// Update one ZZZ achievement status
export const zzzUpdateAchievement = (request) => {
    return api.put("/zzz/update", request);
};

// Get all ZZZ achievement branch
export const zzzGetAllBranch = () => {
    return api.get('/zzz/branches');
}
