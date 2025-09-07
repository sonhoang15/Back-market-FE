import { Outlet } from "react-router-dom";
import Header from "../components/System/Nav";

export default function SystemLayout() {
    return (
        <>
            <Header />
            <div className="system-container">
                <div className="system-list">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
