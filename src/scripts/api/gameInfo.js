import api from "@/scripts/api/request.js"

// Get game info by game id
export const getGameInfoByGameId = (params) => {
    return api.get('/game/id', {params: params});
}