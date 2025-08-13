import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { logOutUser } from '../../Services/userService';
import { toast } from 'react-toastify';

const NavHeader: React.FC = () => {
    const { user, logoutContext } = useContext<any>(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const data = await logOutUser();
            logoutContext();
            localStorage.removeItem('jwt');
            if (data && +data.EC === 0) {
                toast.success("Logout succeeded...");
                navigate('/login');
            } else {
                toast.error(data.EM || "Logout failed");
            }
        } catch {
            toast.error("Logout error");
        }
    };

    if (!((user && user.isAuthenticated) || location.pathname === '/' || location.pathname === '/about')) {
        return null;
    }

    return (
        <header className="bg-gray-900 text-white shadow">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
                {/* Brand */}
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    <span>C</span>
                    <i className="fa fa-codepen" aria-hidden="true" />
                    <span>D E</span>
                </Link>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586 5.636 15.536l1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-4.95-4.95 4.95-4.95z"
                            />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop menu */}
                <nav className="hidden lg:flex lg:items-center lg:space-x-6">
                    <NavLink to="/" className={({ isActive }) =>
                        "nav-link menus " + (isActive ? "font-semibold underline" : "")}>Home</NavLink>
                    <NavLink to="/users" className={({ isActive }) =>
                        "nav-link menus " + (isActive ? "font-semibold underline" : "")}>User</NavLink>
                    <NavLink to="/roles" className={({ isActive }) =>
                        "nav-link menus " + (isActive ? "font-semibold underline" : "")}>Roles</NavLink>
                    <NavLink to="/group-role" className={({ isActive }) =>
                        "nav-link menus " + (isActive ? "font-semibold underline" : "")}>Group roles</NavLink>
                    <NavLink to="/about" className={({ isActive }) =>
                        "nav-link menus " + (isActive ? "font-semibold underline" : "")}>About</NavLink>
                </nav>

                {/* Desktop user section */}
                <div className="hidden lg:flex items-center space-x-4">
                    {user && user.isAuthenticated ? (
                        <>
                            <span>Hello {user.account.username}</span>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="px-3 py-1 border border-gray-700 rounded hover:bg-gray-800"
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                >
                                    Setting
                                </button>
                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg z-10"
                                        onMouseLeave={() => setIsDropdownOpen(false)}
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <nav className="lg:hidden bg-gray-800 text-white px-4 py-3 space-y-3">
                    <NavLink
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/users"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        User
                    </NavLink>
                    <NavLink
                        to="/roles"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Roles
                    </NavLink>
                    <NavLink
                        to="/group-role"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Group roles
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        About
                    </NavLink>

                    <div className="border-t border-gray-700 pt-3">
                        {user && user.isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <span>Hello <strong>{user.account.username}</strong></span>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded block text-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
};

export default NavHeader;
