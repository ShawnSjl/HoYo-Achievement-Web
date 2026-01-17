import api from "@/scripts/api/request.js";

// Get account by user id
export const getAccountByUserId = () => {
    return api.get('/api/account/get-by-user-id');
}

// Create a new account for the current user
export const createAccount = (request) => {
    return api.post('/api/account/create', request);
}

// Update account name
export const updateAccountName = (request) => {
    return api.put('/api/account/update-name', request);
}

// Update account in-game uid
export const updateAccountInGameUid = (request) => {
    return api.put('/api/account/update-in-game-uid', request);
}

// Delete an account
export const deleteAccount = (request) => {
    return api.delete('/api/account/delete', {
        data: request
    });
}
