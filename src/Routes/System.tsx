import { Component } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Roles from '../components/System/Roles/Roles';
import GroupRole from '../components/System/Roles/GroupRole';
import User from '../components/System/ManageUsers/User';
import Header from '../components/System/Nav';
import { UserState } from "../context/UserContext";
import AdminAddProduct from '../components/System/ManagerProduct/AdminAddProduct';
import Category from '../components/System/ManagerProduct/Category';
import { ProductPage } from '../components/System/ManagerProduct/Product';
import OrderAdmin from '../components/System/ManagerProduct/OrderAdmin';

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

      return <Navigate to="/login" />;
    }

    if (user?.account?.groupWithRoles?.id !== 1) {

      return <Navigate to="/home" />;
    }


    return (
      <>
        <Header />
        <div className="system-container">
          <div className="system-list">
            <Routes>

              <Route index element={<Navigate to="user" replace />} />

              <Route path="user" element={<User />} />
              <Route path="group-role" element={<GroupRole />} />
              <Route path="roles" element={<Roles />} />
              <Route path="add-product" element={<AdminAddProduct />} />
              <Route path="category" element={<Category />} />
              <Route path="product" element={<ProductPage />} />
              <Route path="order" element={<OrderAdmin />} />


              <Route path="*" element={<div>Page not found in System</div>} />
            </Routes>

          </div>
        </div>
      </>
    );
  }
}

export default System;