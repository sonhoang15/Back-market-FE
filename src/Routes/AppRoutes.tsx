import React, { ReactNode, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "../components/Login-Register/AuthPage";
import Accessory from "../components/Client/subPage/accessory";
import Home from "../components/Client/Section/HomeClient";
import System from "../Routes/System";
import Pants from "../components/Client/subPage/pants";
import Shirts from "../components/Client/subPage/shirt";
import News from "../components/Client/subPage/news";
import ProductDetail from "../components/Client/subPage/productDetail";
import BuyNowModal from "../components/Client/productSection/buyNow";

import { UserContext } from "../context/UserContext";

interface User {
    isAuthenticated: boolean;
    // thêm các trường khác nếu có
}

interface UserContextType {
    user: User;
}

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user } = context;
    return user.isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }: PrivateRouteProps) {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user } = context;
    return !user.isAuthenticated ? <>{children}</> : <Navigate to="/system" replace />;
}

function HomeRedirect() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user } = context;
    return user.isAuthenticated ? <Navigate to="/system" replace /> : <Navigate to="/home" replace />;
}
function Approutes() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user } = context;
    return (
        <Routes>
            {/* Route đăng nhập: chỉ truy cập khi chưa đăng nhập */}
            <Route
                path="/auth"
                element={
                    <PublicRoute>
                        <AuthForm />
                    </PublicRoute>
                }
            />

            {/* Route phụ kiện, có thể truy cập bình thường */}
            <Route path="/accessories" element={<Accessory />} />
            <Route path="/pants" element={<Pants />} />
            <Route path="/shirts" element={<Shirts />} />
            <Route path="/news" element={<News />} />
            <Route path="/productDetail" element={<ProductDetail />} />



            {/* Route hệ thống chỉ cho người đã đăng nhập */}
            <Route
                path="/system/*"
                element={
                    <PrivateRoute>
                        <System systemMenuPath="/system" user={user} />
                    </PrivateRoute>
                }
            />

            {/* Route /home là trang chủ hiển thị khi chưa đăng nhập */}
            <Route path="/home" element={<Home />} />

            {/* Trang gốc / sẽ redirect theo trạng thái đăng nhập */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Route fallback 404 */}
            <Route path="*" element={<div>404 not found</div>} />
        </Routes>
    );
}
export default Approutes;
