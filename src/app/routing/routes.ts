export const ROUTES = {
    //PUBLIC: { LOGIN: "/login", REGISTER: "/register" },
    PRIVATE: {
        TODAY_SESSION: "/",
        HISTORY: "/history",
        HISTORY_DETAIL: "/history/:id"
    },
    ERROR: { NOT_FOUND: "*" },
} as const;

