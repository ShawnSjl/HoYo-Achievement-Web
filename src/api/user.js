import api from "@/utils/request";

// User login
export const login = (credentials) => {
    return api.post("/auth/login", credentials);
};

// User register
export const register = (credentials) => {
    return api.post("/auth/register", credentials);
};

export const getAllUsers = () => {
    return api.get("/auth/get-all");
}

export const changePassword = (credentials) => {
    return api.put("/auth/change-password", credentials);
}

export const deleteUserById = (id) => {
    return api.delete("/auth/delete", {
        params: { id }
    });
}
