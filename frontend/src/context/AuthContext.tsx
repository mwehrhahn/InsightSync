import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

type User = {
    id: number;
    email: string;
    full_name: string | null;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setLoading(false);
            return;
        }

        api
            .get<User>("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("access_token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const form = new URLSearchParams();
        form.append("username", email);
        form.append("password", password);

        const res = await api.post<{ access_token: string; token_type: string }>(
            `/auth/login`,
            form,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );

        localStorage.setItem("access_token", res.data.access_token);

        // Fetch current user
        const me = await api.get<User>("/auth/me");
        setUser(me.data);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};