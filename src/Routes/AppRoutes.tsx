import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "../components/Login-Register/AuthPage";
import Accessory from "../components/Client/subPage/accessory";
import Home from "../components/Client/Section/HomeClient";
import Pants from "../components/Client/subPage/pants";
import Shirts from "../components/Client/subPage/shirt";
import News from "../components/Client/subPage/news";
import ProductDetail from "../components/Client/subPage/productDetail";
import User from "../components/System/ManageUsers/User";
import GroupRole from "../components/System/Roles/GroupRole";
import Roles from "../components/System/Roles/Roles";

import ClientLayout from "../layouts/ClientLayout";
import SystemLayout from "../layouts/SystemLayout";
import { PublicRoute, AdminRoute, HomeRedirect } from "./RouteGuards";
import AdminAddProduct from "../components/System/Product/AdminAddProduct";
// bạn tách riêng mấy hàm PrivateRoute, PublicRoute, AdminRoute, HomeRedirect ra 1 file RouteGuards.tsx cho gọn

export default function AppRoutes() {
    return (
        <Routes>
            {/* Auth */}
            <Route
                path="/auth"
                element={
                    <PublicRoute>
                        <AuthForm />
                    </PublicRoute>
                }
            />

            {/* Client routes */}
            <Route element={<ClientLayout />}>
                <Route path="/accessories" element={<Accessory />} />
                <Route path="/pants" element={<Pants />} />
                <Route path="/shirts" element={<Shirts />} />
                <Route path="/news" element={<News />} />
                <Route path="/productDetail" element={<ProductDetail />} />
                <Route path="/home" element={<Home />} />
            </Route>

            {/* System routes */}
            <Route
                path="/system"
                element={
                    <AdminRoute>
                        <SystemLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<Navigate to="user" replace />} />
                <Route path="user" element={<User />} />
                <Route path="group-role" element={<GroupRole />} />
                <Route path="roles" element={<Roles />} />
                <Route path="add-product" element={<AdminAddProduct />} />
                <Route path="*" element={<div>Page not found in System</div>} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<HomeRedirect />} />

            {/* 404 */}
            <Route path="*" element={<div>404 not found</div>} />
        </Routes>
    );
}
