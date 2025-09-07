import { ReactNode, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface PrivateRouteProps {
    children?: ReactNode;
}

function useAuth() {
    const context = useContext(UserContext);
    if (!context) throw new Error("UserContext must be used within a UserProvider");
    return context.user;
}

// ---- PrivateRoute: chỉ check đăng nhập ----
export function PrivateRoute({ children }: PrivateRouteProps) {
    const user = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user.isAuthenticated) {
            navigate("/auth", { replace: true });
        }
    }, [user.isAuthenticated, navigate]);

    if (!user.isAuthenticated) return null;
    return <>{children}</>;
}

// ---- PublicRoute: chỉ cho người chưa đăng nhập ----
export function PublicRoute({ children }: PrivateRouteProps) {
    const user = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user.isAuthenticated) {
            navigate("/system", { replace: true });
        }
    }, [user.isAuthenticated, navigate]);
    if (user.isAuthenticated) return null;
    return <>{children}</>;
}

// ---- AdminRoute: check đăng nhập + admin ----
export function AdminRoute({ children }: PrivateRouteProps) {
    const user = useAuth();
    const group = user?.account?.groupWithRoles;
    const isAdmin = group?.id === 1;

    if (!user?.isAuthenticated) return <Navigate to="/auth" replace />;
    if (!isAdmin) return <Navigate to="/home" replace />;

    return <>{children}</>;
}

// ---- HomeRedirect: chuyển hướng theo trạng thái đăng nhập ----
export function HomeRedirect() {
    const user = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user.isAuthenticated) navigate("/home", { replace: true });
        else if (user.groupWithRoles?.id === 1) navigate("/system", { replace: true });
        else navigate("/home", { replace: true });
    }, [user.isAuthenticated, user.groupWithRoles?.id, navigate]);

    return null;
}

