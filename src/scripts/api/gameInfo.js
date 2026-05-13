import api from "@/scripts/api/request.js"

// Get game info by game id
export const getGameInfoByGameId = (request) => {
    return api.get('/api/game/id', {params: request});
}