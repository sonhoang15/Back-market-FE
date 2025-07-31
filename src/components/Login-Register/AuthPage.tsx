import { useState } from "react";
import clsx from "clsx";
import SignInForm from "./LoginForm";
import SignUpForm from "./RegisterForm";

export default function AuthForm() {
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#f6f5f7]">
            <div
                className={clsx(
                    "relative w-[768px] max-w-full min-h-[480px] bg-white rounded-[10px] shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] overflow-hidden",
                    { "right-panel-active": isRegister }
                )}
            >
                {/* Sign Up */}
                <div
                    className={clsx(
                        "absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out z-[1] opacity-0",
                        { "translate-x-full opacity-100 z-[5]": isRegister }
                    )}
                >
                    <SignUpForm />
                </div>

                {/* Sign In */}
                <div
                    className={clsx(
                        "absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out z-[2]",
                        { "translate-x-full": isRegister }
                    )}
                >
                    <SignInForm />
                </div>

                {/* Overlay */}
                <div
                    className={clsx(
                        "absolute top-0 left-1/2 w-1/2 h-full z-[100] overflow-hidden transition-transform duration-700 ease-in-out",
                        { "-translate-x-full": isRegister }
                    )}
                >
                    <div
                        className={clsx(
                            "absolute left-[-100%] w-[200%] h-full bg-gradient-to-r from-[#6200ea] to-[#7c4dff] text-white transition-transform duration-700 ease-in-out",
                            { "translate-x-1/2": isRegister }
                        )}
                    >
                        {/* Overlay left */}
                        <div
                            className={clsx(
                                "absolute top-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-700 ease-in-out",
                                { "translate-x-0": isRegister, "-translate-x-[20%]": !isRegister }
                            )}
                        >
                            <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
                            <p className="mb-6">To keep connected with us please login with your info</p>
                            <button
                                onClick={() => setIsRegister(false)}
                                className="ghost border-2 border-white text-white px-6 py-2 rounded-[20px] uppercase font-bold hover:bg-white hover:text-[#6200ea] transition"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Overlay right */}
                        <div
                            className={clsx(
                                "absolute right-0 top-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-700 ease-in-out",
                                { "translate-x-[20%]": isRegister, "translate-x-0": !isRegister }
                            )}
                        >
                            <h1 className="text-2xl font-bold mb-2">Hello, Friend!</h1>
                            <p className="mb-6">Enter your details and start your journey with us</p>
                            <button
                                onClick={() => setIsRegister(true)}
                                className="ghost border-2 border-white text-white px-6 py-2 rounded-[20px] uppercase font-bold hover:bg-white hover:text-[#6200ea] transition"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}