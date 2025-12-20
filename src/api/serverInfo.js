import api from "@/utils/request"

// Get all server info
export const getAllServerInfo = () => {
    return api.get('/api/info/all');
}

// Get latest server info
export const getLatestServerInfo = () => {
    return api.get('/api/info/latest');
}
