// Decode JWT token
export const parseJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(base64));
    } catch (error) {
        return null;
    }
}

// Check if token is expired
export const isTokenExpired = (token) => {
    const decoded = parseJWT(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime;
}