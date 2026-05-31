import api from "@/scripts/api/request.js";

// User login
export const login = (body) => {
    return api.post("/user/login", body);
};

// Check if the current user is logged in
export const isUserLogin = () => {
    return api.get("/user/is-login");
}

// User logout
export const logout = () => {
    return api.post("/user/logout");
}

// Check if the current user has super role
export const isSuperUser = () => {
    return api.get("/user/is-super");
}

// Check if the current user is a root
export const isRootUser = () => {
    return api.get("/user/is-root");
}

// Get all users
export const getAllUsers = () => {
    return api.get("/user/all");
}

// Create a new user
export const createUser = (body) => {
    return api.post("/user/create", body);
};

// Update the user's username
export const updateUsername = (params, body) => {
    return api.put("/user/update-username", body, {params: params});
}

// Change the user's password
export const changePassword = (body) => {
    return api.put("/user/update-password", body);
}

// Update the user's status
export const updateUserStatus = (body) => {
    return api.put("/user/update-status", body);
}

// Update the user's role; Should only be called by admin or root
export const updateUserRole = (body) => {
    return api.put("/user/update-role", body);
}

// Delete the user
export const deleteCurrentUser = (params) => {
    return api.delete("/user/delete", {params: params});
}

// Do the second authentication
export const secondAuth = (body) => {
    return api.post("/user/second-auth", body);
}
