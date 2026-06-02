import api from "@/scripts/api/request.js"

// Get all server info
export const getAllServerUpdateLog = () => {
    return api.get('/server/all');
}

// Get latest server info
export const getLatestServerUpdateLog = (params) => {
    return api.get('/server/latest', {params: params});
}
