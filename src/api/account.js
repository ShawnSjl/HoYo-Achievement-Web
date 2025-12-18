import api from "@/utils/request";

// Get account by user id
export const getAccountByUserId = () => {
    return api.get('/account/user-id');
}

// Create a new account for the current user
export const createAccount = (request) => {
    return api.post('/account/create', request);
}

// Update account name
export const updateAccountName = (request) => {
    return api.put('/account/update-name', request);
}

// Update account in-game uid
export const updateAccountInGameUid = (request) => {
    return api.put('/account/update-in-game-uid', request);
}

// Delete an account
export const deleteAccount = (request) => {
    return api.delete('/account/delete', request);
}
