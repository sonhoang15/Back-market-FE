import React, { Component } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Roles from '../components/System/Roles/Roles';
import GroupRole from '../components/System/Roles/GroupRole';
import User from '../components/System/ManageUsers/User';
import Header from '../components/System/Nav';

interface User {
  isLoggedIn: boolean;
  role: string;
}

interface SystemProps {
  systemMenuPath: string;
  user: User;
}

class System extends Component<SystemProps> {
  render() {
    const { systemMenuPath, user } = this.props;

    if (!user.isLoggedIn) {
      // Nếu chưa đăng nhập thì redirect về login
      return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
      // Nếu không phải admin thì chuyển đến trang không được phép truy cập
      return <Navigate to="/" />;
    }

    // Nếu là admin thì render nội dung hệ thống
    return (
      <>
        <Header />
        <div className="system-container">
          <div className="system-list">
            <Routes>
              <Route path="/system/user" element={<User />} />
              <Route path="/system/group-role" element={<GroupRole />} />
              <Route path="/system/roles" element={<Roles />} />
              <Route path="*" element={<Navigate to={systemMenuPath} replace />} />
            </Routes>
          </div>
        </div>
      </>
    );
  }
}

export default System;