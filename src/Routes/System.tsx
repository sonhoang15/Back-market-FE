import { Component } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Roles from '../components/System/Roles/Roles';
import GroupRole from '../components/System/Roles/GroupRole';
import User from '../components/System/ManageUsers/User';
import Header from '../components/System/Nav';
import { UserState } from "../context/UserContext";
import AdminAddProduct from '../components/System/Product/AdminAddProduct';
import Category from '../components/System/Product/Category';

interface User {
  isLoggedIn: boolean;
  role: string;
}

interface SystemProps {
  systemMenuPath: string;
  user: UserState;
}

class System extends Component<SystemProps> {
  render() {
    const { user } = this.props;

    if (!user.isAuthenticated) {
      // Nếu chưa đăng nhập thì redirect về login
      return <Navigate to="/login" />;
    }

    if (user?.account?.groupWithRoles?.id !== 1) {
      // Nếu không phải admin thì chuyển đến trang không được phép truy cập
      return <Navigate to="/home" />;
    }

    // Nếu là admin thì render nội dung hệ thống
    return (
      <>
        <Header />
        <div className="system-container">
          <div className="system-list">
            <Routes>
              {/* khi vào /system thì tự động chuyển sang /system/user */}
              <Route index element={<Navigate to="user" replace />} />

              <Route path="user" element={<User />} />
              <Route path="group-role" element={<GroupRole />} />
              <Route path="roles" element={<Roles />} />
              <Route path="add-product" element={<AdminAddProduct />} />
              <Route path="category" element={<Category />} />

              {/* fallback khác: hiện 404 thay vì quay về /system */}
              <Route path="*" element={<div>Page not found in System</div>} />
            </Routes>

          </div>
        </div>
      </>
    );
  }
}

export default System;