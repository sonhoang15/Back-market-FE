import { Outlet } from "react-router-dom";
import Header from "../components/Client/Section/Header";
import Footer from "../components/Client/Section/Footer";

export default function ClientLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
