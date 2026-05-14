import api from "@/scripts/api/request.js"

// Get all server info
export const getAllServerUpdateLog = () => {
    return api.get('/server/all');
}

// Get latest server info
export const getLatestServerUpdateLog = (request) => {
    return api.get('/server/latest', {params: request});
}
