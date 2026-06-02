import api from "@/scripts/api/request.js";

// Get accounts by user id
export const getAccountByUserId = () => {
    return api.get('/account/get-by-user-id');
}

// Get account by uuid
export const getAccountByUuid = (params) => {
    return api.get('/account/get-by-uuid', {params: params});
}

// Create a new account for the current user
export const createAccount = (params, body) => {
    return api.post('/account/create', body, {params: params});
}

// Update account name
export const updateAccountName = (params, body) => {
    return api.put('/account/update-name', body, {params: params});
}

// Update account in-game uid
export const updateAccountInGameUid = (params, body) => {
    return api.put('/account/update-in-game-uid', body, {params: params});
}

// Delete an account
export const deleteAccount = (params, body) => {
    return api.delete('/account/delete', {params: params, data: body});
}
