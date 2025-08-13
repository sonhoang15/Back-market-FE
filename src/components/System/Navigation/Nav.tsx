import React, { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { logOutUser } from "../../../Services/userService";
import { toast } from "react-toastify";

interface UserAccount {
    username: string;
}

interface UserType {
    isAuthenticated: boolean;
    account: UserAccount;
}

interface UserContextType {
    user: UserType | null;
    logoutContext: () => void;
}

const NavHeader: React.FC = () => {
    const { user, logoutContext } = useContext(UserContext) as UserContextType;
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        let data = await logOutUser();
        logoutContext();
        localStorage.removeItem("jwt");
        if (data && +data.EC === 0) {
            toast.success("logout succeds...");
            navigate("/login");
        } else {
            toast.error(data.EM);
        }
    };

    if (
        (user && user.isAuthenticated === true) ||
        location.pathname === "/" ||
        location.pathname === "/about"
    ) {
        return (
            <div className="bg-black">
                <nav className="bg-black px-4">
                    <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
                        {/* Logo */}
                        <div className="flex items-center">
                            <span className="text-white text-lg font-semibold">
                                C <i className="fa fa-codepen" aria-hidden="true"></i> D E
                            </span>
                        </div>

                        {/* Toggle button cho mobile */}
                        <button
                            className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Menu items */}
                        <div className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}>
                            <ul className="flex flex-col p-4 mt-4 border border-gray-700 rounded-lg bg-black md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-black">
                                <li>
                                    <NavLink
                                        to="/"
                                        end
                                        className={({ isActive }) =>
                                            `px-4 py-2 text-white rounded hover:bg-gray-600 ${isActive ? "bg-teal-500" : "bg-gray-700"
                                            }`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/users"
                                        className={({ isActive }) =>
                                            `px-4 py-2 text-white rounded hover:bg-gray-600 ${isActive ? "bg-teal-500" : "bg-gray-700"
                                            }`
                                        }
                                    >
                                        User
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/roles"
                                        className={({ isActive }) =>
                                            `px-4 py-2 text-white rounded hover:bg-gray-600 ${isActive ? "bg-teal-500" : "bg-gray-700"
                                            }`
                                        }
                                    >
                                        Roles
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/group-role"
                                        className={({ isActive }) =>
                                            `px-4 py-2 text-white rounded hover:bg-gray-600 ${isActive ? "bg-teal-500" : "bg-gray-700"
                                            }`
                                        }
                                    >
                                        Group roles
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) =>
                                            `px-4 py-2 text-white rounded hover:bg-gray-600 ${isActive ? "bg-teal-500" : "bg-gray-700"
                                            }`
                                        }
                                    >
                                        About
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                        {/* User section */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user && user.isAuthenticated ? (
                                <>
                                    <span className="text-white px-4 py-2">
                                        Hello {user.account.username}
                                    </span>
                                    <div className="relative group">
                                        <button className="bg-green-400 rounded px-4 py-2 text-white hover:bg-green-700">
                                            Setting
                                        </button>
                                        <div className="absolute hidden group-hover:block right-0 mt-2 w-32 bg-white rounded shadow-lg z-10">
                                            <button
                                                onClick={handleLogout}
                                                className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    className="bg-green-400 rounded px-4 py-2 text-black hover:bg-green-700 hover:text-white"
                                    to="/login"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        );

    } else {
        return <></>;
    }
};

export default NavHeader;
