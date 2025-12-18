import api from "@/utils/request";

// User login
export const login = (credentials) => {
    return api.post("/user/login", credentials);
};

// Check if the current user is logged in
export const isLogin = () => {
    return api.get("/user/is-login");
}

// User logout
export const logout = () => {
    return api.post("/user/logout");
}

// Check if the current user is an admin
export const isAdmin = () => {
    return api.get("/user/is-admin");
}

// Get all users
export const getAllUsers = () => {
    return api.get("/user/all");
}

// Create a new user
export const createUser = (request) => {
    return api.post("/user/create", request);
};

// Update the user's username
export const updateUsername = (request) => {
    return api.put("/user/update-username", request);
}

// Change the user's password
export const changePassword = (request) => {
    return api.put("/auth/change-password", request);
}

// Update the user's status
export const updateUserStatus = (request) => {
    return api.put("/user/update-status", request);
}

// Update the user's role; Should only be called by admin or root
export const updateUserRoles = (request) => {
    return api.put("/user/update-role", request);
}

// Delete the user
export const deleteCurrentUser = () => {
    return api.delete("/user/delete");
}

// Do the second authentication
export const secondAuth = () => {
    return api.get("/user/second-auth");
}
