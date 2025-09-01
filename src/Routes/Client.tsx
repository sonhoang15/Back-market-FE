import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Đường dẫn đến file context của bạn

const Home: React.FC = () => {
    const { user } = useContext(UserContext)!;

    // Giả sử user có isAuthenticated: boolean
    const isLoggedIn = user?.isAuthenticated;

    const linkToRedirect = isLoggedIn ? '/system/user' : '/home';

    return <Navigate to={linkToRedirect} replace />;
};

export default Home;
