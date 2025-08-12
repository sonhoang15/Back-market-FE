import React, { useEffect, useState, ReactNode } from 'react';
import { getUserAccount } from "../Services/userService";

// Kiểu dữ liệu cho tài khoản
interface Account {
    email: string;
    username: string;
    groupWithRoles: any;
}

// Kiểu dữ liệu cho UserContext
interface UserState {
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string;
    account: Account | {};
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
        account: {}
    };

    const [user, setUser] = useState<UserState>(userDefault);

    const loginContext = (userData: UserState) => {
        setUser({ ...userData, isLoading: false });
    };

    const logoutContext = () => {
        setUser({ ...userDefault, isLoading: false });
    };

    const fetchUser = async () => {
        const response = await getUserAccount();
        if (response && response.EC === 0) {
            const { groupWithRoles, email, username, access_token: token } = response.DT;
            const data: UserState = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username },
                isLoading: false
            };
            setTimeout(() => setUser(data), 1000);
        } else {
            setTimeout(() => setUser({ ...userDefault, isLoading: false }), 1000);
        }
    };

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
            fetchUser();
        } else {
            setUser({ ...user, isLoading: false });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
