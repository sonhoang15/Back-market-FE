import React, { useEffect, useState, ReactNode } from "react";
import { getUserAccount } from "../Services/userService";

// Kiểu dữ liệu cho tài khoản
interface Account {
    email: string;
    username: string;
    groupWithRoles: any;
}

// Kiểu dữ liệu cho UserContext
export interface UserState {
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string;
    account: Account | null;
    role: string;
    groupWithRoles?: any;
}

// Kiểu dữ liệu cho Context
interface UserContextType {
    user: UserState;
    loginContext: (userData: UserState) => void;
    logoutContext: () => void;
}

// Tạo context với kiểu mặc định
const UserContext = React.createContext<UserContextType | null>(null);

// Props cho provider
interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const userDefault: UserState = {
        isLoading: true,
        isAuthenticated: false,
        token: "",
        account: null,
        role: "",
    };

    const [user, setUser] = useState<UserState>(userDefault);

    const loginContext = (userData: UserState) => {
        localStorage.setItem("jwt", userData.token); // lưu token lại
        setUser({ ...userData, isLoading: false });
    };

    const logoutContext = () => {
        localStorage.removeItem("jwt");
        setUser({ ...userDefault, isLoading: false });
    };

    const fetchUser = async (token: string) => {
        try {
            const response = await getUserAccount();
            if (response && response.EC === 0) {
                const { groupWithRoles, email, username, access_token } = response.DT;
                const data: UserState = {
                    isAuthenticated: true,
                    token: access_token || token,
                    account: { groupWithRoles, email, username },
                    isLoading: false,
                    role: response.DT.groupWithRoles?.groupId ?? "",
                };
                setUser(data);
            } else {
                logoutContext();
            }
        } catch (err) {
            logoutContext();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (token) {
            // Nếu đã có token thì fetch thông tin user
            fetchUser(token);
        } else {
            // Nếu chưa có token thì coi như logout
            setUser({ ...userDefault, isLoading: false });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
