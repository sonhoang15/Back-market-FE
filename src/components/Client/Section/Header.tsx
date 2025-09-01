import { useEffect, useState } from 'react';
import { Search, Phone, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from "../../../assets/anh/logo.png";
import CartSidebar from '../productSection/cart';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy role từ localStorage
  useEffect(() => {
    const role = localStorage.getItem("role"); // "admin" hoặc "customer"
    setUserRole(role);
  }, []);

  const handleAdminClick = () => {
    navigate('/admin'); // chuyển hướng tới trang admin
  };
  return (
    <header className="w-full">
      {/* Top bar */}
      <div
        className={`w-full bg-gray-100 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone size={16} />
            <span>0325.542.941</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <CartSidebar />
            <div className="flex items-center space-x-1">
              <User size={16} />
              <NavLink to="/auth">TÀI KHOẢN</NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div
        className={`fixed left-0 w-full z-30 transition-all duration-600 
      ${isSticky ? "shadow-md backdrop-blur bg-white/80 top-0" : "bg-white"}  `}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <NavLink to="/home">
                <img src={logo} alt="logo" width={70} height={70} className="object-contain" />
              </NavLink>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8 ml-[365px] mr-[174px]">
              <NavLink to="/shirts" className="text-gray-700 hover:text-gray-300 font-medium">ÁO NAM</NavLink>
              <NavLink to="/pants" className="text-gray-700 hover:text-gray-300 font-medium">QUẦN NAM</NavLink>
              <NavLink to="/accessories" className="text-gray-700 hover:text-gray-300 font-medium">PHỤ KIỆN</NavLink>
              <NavLink to="/news" className="text-gray-700 hover:text-gray-300 font-medium">TIN TỨC</NavLink>
            </nav>

            {/* Search */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none"
              >
                <Search size={20} />
              </button>
            </div>
            {/* Nút vào trang admin chỉ hiện khi role là admin */}
            {userRole === 'admin' && (
              <button
                onClick={handleAdminClick}
                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
              >
                Quản Trị
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
