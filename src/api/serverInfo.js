import api from "@/utils/request"

// Get all server info
export const getAllServerInfo = () => {
    return api.get('/info/all');
}

// Get latest server info
export const getLatestServerInfo = () => {
    return api.get('/info/latest');
}
