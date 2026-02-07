import { useEffect, useState } from "react";
import {
    saveToLocalStorage,
    readFromLocalStorage,
    removeFromLocalStorage,
} from "./useLocalStorage";

/**
 * Save user data to localStorage on login.
 * @param {Object} userData - The user object to save.
 */
export function loginUser(userData) {
    return saveToLocalStorage("user", userData);
}

/**
 * Remove user data from localStorage on logout.
 */
export function logoutUser() {
    return removeFromLocalStorage("user");
}

/**
 * Get the current logged-in user data from localStorage.
 * @returns {Object|null} The user object or null if not logged in.
 */
export function getAuthUser() {
    return readFromLocalStorage("user");
}

/**
 * Check if a user is logged in.
 * @returns {boolean}
 */
export function isLoggedIn() {
    return !!getAuthUser();
}

/**
 * Custom hook to get and update auth user on login/logout.
 * @returns {[user, setUser]} - Current user and setter.
 */
export function useAuthUser() {
    const [user, setUser] = useState(getAuthUser());

    useEffect(() => {
        const updateUser = () => setUser(getAuthUser());

        window.addEventListener("authChange", updateUser);
        window.addEventListener("storage", updateUser);

        return () => {
            window.removeEventListener("authChange", updateUser);
            window.removeEventListener("storage", updateUser);
        };
    }, []);

    return [user, setUser];
}