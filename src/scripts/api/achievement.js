import api from "@/scripts/api/request.js"

// Get all achievement by game id
export const getAllAchievementByGameId = (requestParams) => {
    return api.get('/achievement/all', {params: requestParams});
}

// Get all achievement branch by game id
export const getAllBranchByGameId = (requestParams) => {
    return api.get('/achievement/branches', {params: requestParams});
}

// Get achievement record by id
export const getRecordById = (requestParams) => {
    return api.get('/achievement/account-records', {params: requestParams});
}

// Update on achievement status
export const updateAchievementById = (requestBody) => {
    return api.put('/achievement/update', requestBody);
}

// Update achievement status in batch
export const updateAchievementBatch = (requestBody) => {
    return api.put('/achievement/update-batch', requestBody);
}
