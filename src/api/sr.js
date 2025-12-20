import api from "@/utils/request"

// Get all SR achievement
export const srGetAll = (request) => {
    return api.get('/api/sr/all', request);
}

// Get all SR achievement with empty record
export const srGetAllEmpty = () => {
    return api.get('/api/sr/all-empty-record');
}

// Update one SR achievement status
export const srUpdateAchievement = (request) => {
    return api.put("/api/sr/update", request);
};

// Get all SR achievement branch
export const srGetAllBranch = () => {
    return api.get('/api/sr/branches');
}
