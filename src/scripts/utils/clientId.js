const clientIdKey = 'SSE_CLIENT_ID';

export const getClientId = () => {
    // Get client id from session storage or generate a new one
    let clientId = localStorage.getItem(clientIdKey);
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem(clientIdKey, clientId)
    }
    return clientId
}