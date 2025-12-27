import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './layouts/ScrollToTop.tsx';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollToTop />
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
