import api from "@/scripts/api/request.js"

// Get all achievement by game id
export const getAllAchievementByGameId = (params) => {
    return api.get('/achievement/all', {params: params});
}

// Get all achievement branch by game id
export const getAllBranchByGameId = (params) => {
    return api.get('/achievement/branches', {params: params});
}

// Get achievement record by id
export const getRecordById = (params) => {
    return api.get('/achievement/account-records', {params: params});
}

// Update on achievement status
export const updateAchievementById = (params, body) => {
    return api.put('/achievement/update', body, {params: params});
}

// Update achievement status in batch
export const updateAchievementBatch = (params, body) => {
    return api.put('/achievement/update-batch', body, {params: params});
}
