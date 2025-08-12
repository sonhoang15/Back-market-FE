import { Routes, Route } from "react-router-dom";
import AuthForm from "../components/Login-Register/AuthPage";
import Accessory from "../components/subPage/accessory";
import Home from "../components/Section/home";

function Approutes() {
    return (
        <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/accessories" element={<Accessory />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<div>404 not found</div>} />
        </Routes>
    );
}

export default Approutes;