import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Phone, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import logo from "../../assets/anh/logo.png";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(true);

  // Lắng nghe scroll để bật/tắt sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40); // >40px là bắt đầu cuộn
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className="w-full">
      {/* Top bar */}
      <div
        className={`bg-gray-100 border-b border-gray-200 py-2 transition-all duration-300 
    ${isSticky ? 'opacity-0 invisible h-0 overflow-hidden' : 'opacity-100 visible h-auto'}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone size={16} />
            <span>0325.542.941</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <ShoppingCart size={16} />
              <span>GIỎ HÀNG (0)</span>
            </div>
            <div className="flex items-center space-x-1">
              <User size={16} />
              <span>TÀI KHOẢN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 ${isSticky ? 'shadow-md backdrop-blur bg-white/80' : ''} transition-shadow duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <NavLink to="/">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
