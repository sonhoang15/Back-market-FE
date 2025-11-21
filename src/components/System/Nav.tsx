import React, { useContext, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { logOutUser } from '../../Services/userService';
import { toast } from 'react-toastify';
import logo from "../../assets/anh/logo.png";

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
                navigate('/auth');
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
        <header className="bg-gray-700 text-white shadow">
            <div className="container mx-auto px-4 flex items-center justify-between h-[80px]">
                {/* Brand */}
                <NavLink to="/home" className="flex items-center">
                    <img
                        src={logo}
                        alt="logo"
                        width={60}
                        height={60}
                        className="object-contain"
                    />
                </NavLink>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {isMenuOpen ? (
                            // Icon "X" (close)
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            // Icon "☰" (hamburger)
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>


                {/* Desktop menu */}
                <nav className="hidden lg:flex lg:items-center lg:space-x-6">
                    <NavLink
                        to="/system/user"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        User
                    </NavLink>

                    <NavLink
                        to="/system/roles"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        Role
                    </NavLink>

                    <NavLink
                        to="/system/group-role"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        Group roles
                    </NavLink>

                    <NavLink
                        to="/system/add-product"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        Add product
                    </NavLink>
                    <NavLink
                        to="/system/category"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        Category
                    </NavLink>
                    <NavLink
                        to="/system/product"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        Products
                    </NavLink>
                    <NavLink
                        to="/system/order"
                        className={({ isActive }) =>
                            `px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : ""
                            }`
                        }
                    >
                        Orders
                    </NavLink>
                </nav>


                {/* Desktop user section */}
                <div className="hidden lg:flex items-center space-x-4">
                    {user && user.isAuthenticated ? (
                        <>
                            <span>Hello {user.account.username}</span>
                            <div className="relative">
                                <button
                                    aria-label="Setting"
                                    title="Setting"
                                    type="button"
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
                        to="/system/user"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        User
                    </NavLink>
                    <NavLink
                        to="/system/roles"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Roles
                    </NavLink>
                    <NavLink
                        to="/system/group-role"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Group roles
                    </NavLink>
                    <NavLink
                        to="/system/add-product"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Add product
                    </NavLink>

                    <NavLink
                        to="/system/category"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        category
                    </NavLink>
                    <NavLink
                        to="/system/order"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                            "block nav-link menus " + (isActive ? "font-semibold underline" : "")
                        }
                    >
                        Orders
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
