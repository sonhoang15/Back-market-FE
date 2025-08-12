import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoutes: React.FC = () => {
    const { user } = useContext(UserContext)!;

    return user && user.isAuthenticated === true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;