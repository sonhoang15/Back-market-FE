import React, { useEffect, useState, ReactNode } from "react";
import { getUserAccount } from "../Services/userService";


interface Account {
    email: string;
    username: string;
    groupWithRoles: any;
}


export interface UserState {
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string;
    account: Account | null;
    role: string;
    groupWithRoles?: any;
}


interface UserContextType {
    user: UserState;
    loginContext: (userData: UserState) => void;
    logoutContext: () => void;
}


const UserContext = React.createContext<UserContextType | null>(null);


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
        localStorage.setItem("jwt", userData.token);
        setUser({ ...userData, isLoading: false });
    };

    const logoutContext = () => {
        localStorage.removeItem("jwt");
        setUser({ ...userDefault, isLoading: false });
    };

    const fetchUser = async (token: string) => {
        try {
            const response = await getUserAccount(token);
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

            fetchUser(token);
        } else {

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
