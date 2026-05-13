import api from "@/scripts/api/request.js"

// Get all server info
export const getAllServerUpdateLog = () => {
    return api.get('/api/server/all');
}

// Get latest server info
export const getLatestServerUpdateLog = (request) => {
    return api.get('/api/server/latest', {params: request});
}
