import { useContext, useEffect, useState } from 'react';
import { Search, Phone, User, Menu, X } from 'lucide-react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import logo from "../../../assets/anh/logo.png";
import CartSidebar from '../productSection/cart';
import { toast } from "react-toastify";
import { UserContext } from "../../../context/UserContext";
import { logOutUser } from "../../../Services/userService";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, logoutContext } = useContext(UserContext)!;
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Lắng nghe scroll để bật/tắt sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowTopBar(true);  // hiện topbar khi ở đầu trang
      } else {
        setShowTopBar(false); // ẩn topbar khi cuộn xuống
      }

      setIsSticky(window.scrollY > 40); // sticky khi cuộn >40px
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // gọi hàm ngay để thiết lập trạng thái ban đầu
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy role từ localStorage
  useEffect(() => {
    const role = localStorage.getItem("role"); // "admin" hoặc "customer"
    setUserRole(role);
  }, []);

  const handleAdminClick = () => {
    navigate('/system'); // chuyển hướng tới trang admin
  };

  const handleLogout = async () => {
    try {
      const data = await logOutUser();
      setShowMenu(false);
      logoutContext();
      localStorage.removeItem("jwt");

      if (data && +data.EC === 0) {
        toast.success("Logout succeeds...");
        navigate("/auth"); // v6 dùng navigate thay cho history.push
      } else {
        toast.error(data?.EM || "Logout failed");
      }
    } catch (error) {
      toast.error("Có lỗi khi logout");
      console.error(error);
    }
  };
  if (user && user.isAuthenticated === true || location.pathname === '/home' || location.pathname === '/news') {
    return (
      <header className="w-full">
        {/* Top bar */}
        <div className="w-full bg-gray-100 transition-all duration-300">
          <div className="max-w-[110rem] mx-auto px-4 flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone size={16} />
              <span>0325.542.941</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600 relative">
              <CartSidebar />

              {!user.isAuthenticated ? (
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <NavLink to="/auth" className="hover:text-gray-800">
                    TÀI KHOẢN
                  </NavLink>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-1 hover:text-gray-800"
                  >
                    <User size={16} />
                    <span>{(user.account as any).username}</span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                      {/* Admin button */}
                      {user?.account?.groupWithRoles?.id === 1 && (
                        <button
                          onClick={handleAdminClick}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Quản Trị
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div
          className={`fixed left-0 w-full z-30 transition-all duration-600
      ${isSticky ? "shadow-md backdrop-blur bg-white/80 top-0" : "bg-white"}  `}
        >
          <div className="max-w-[110rem] mx-auto px-4 py-4">
            <div className="flex items-center justify-between relative">
              {/* Logo */}
              <NavLink to="/home" className="flex items-center">
                <img
                  src={logo}
                  alt="logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </NavLink>

              {/* Nav desktop */}
              <nav className="hidden md:flex gap-6 lg:gap-12 text-sm lg:text-base absolute left-1/2 -translate-x-1/2">
                <NavLink to="/shirts" className="hover:text-gray-500 font-medium">ÁO NAM</NavLink>
                <NavLink to="/pants" className="hover:text-gray-500 font-medium">QUẦN NAM</NavLink>
                <NavLink to="/accessories" className="hover:text-gray-500 font-medium">PHỤ KIỆN</NavLink>
                <NavLink to="/news" className="hover:text-gray-500 font-medium">TIN TỨC</NavLink>
              </nav>

              {/* Search (desktop) */}
              <div className="relative hidden md:block w-40 md:w-56 lg:w-64">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full"
                >
                  <Search size={20} />
                </button>
              </div>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenu(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
        {mobileMenu && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenu(false)}
            ></div>

            {/* Sidebar */}
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 animate-slideIn">
              <button
                onClick={() => setMobileMenu(false)}
                className="mb-6 p-2 rounded-lg active:bg-gray-200"
              >
                <X size={24} />
              </button>
              {/* Search box cho mobile */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  className="w-full pl-4 pr-2 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <nav className="flex flex-col space-y-4 text-lg font-medium">
                <NavLink
                  to="/shirts"
                  onClick={() => setMobileMenu(false)}
                  className="active:text-gray-700"
                >
                  ÁO NAM
                </NavLink>
                <NavLink
                  to="/pants"
                  onClick={() => setMobileMenu(false)}
                  className="active:text-gray-700"
                >
                  QUẦN NAM
                </NavLink>
                <NavLink
                  to="/accessories"
                  onClick={() => setMobileMenu(false)}
                  className="active:text-gray-700"
                >
                  PHỤ KIỆN
                </NavLink>
                <NavLink
                  to="/news"
                  onClick={() => setMobileMenu(false)}
                  className="active:text-gray-700"
                >
                  TIN TỨC
                </NavLink>
              </nav>
            </div>
          </div>
        )}

      </header>
    );

  } else {
    return <></>;
  }
};


export default Header;
