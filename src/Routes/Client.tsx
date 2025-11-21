import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home: React.FC = () => {
    const { user } = useContext(UserContext)!;

    const isLoggedIn = user?.isAuthenticated;

    const linkToRedirect = isLoggedIn ? '/system' : '/home';

    return <Navigate to={linkToRedirect} replace />;
};

export default Home;
