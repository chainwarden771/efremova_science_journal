import { useState } from "react";

import { authorize }
    from "../services/profileService";

import { saveUser }
    from "../utils/localStorage";

import { setCookie }
    from "../utils/cookies";

export default function useProfile() {

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    async function login(data) {

        setLoading(true);

        try {

            const result =
                await authorize(data);

            saveUser(result.user);

            setCookie(
                "jwt",
                result.token
            );

            setProfile(result.user);

            return result.user;

        } finally {
            setLoading(false);
        }
    }

    // function logout() {

    //     localStorage.removeItem("user");

    //     removeCookie("jwt");

    //     setProfile(null);
    // }

    return {
        profile,
        loading,
        login,
        // logout
    };
}