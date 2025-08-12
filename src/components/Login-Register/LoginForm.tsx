import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { LoginService } from "../../Services/userService";
import { UserContext } from "../../context/UserContext"
import { join } from "lodash";
import { ClimbingBoxLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";

const SignInForm = () => {
    const navigate = useNavigate();
    const { user, loginContext } = useContext(UserContext)!;
    const [isLoading, setIsLoading] = useState(false);
    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");
    const defaultInput = {
        isValidValueLogin: true,
        isValidPassword: true,
    }
    const [objvalidInput, setObjValidInput] = useState(defaultInput);

    const login = async () => {
        setObjValidInput(defaultInput)
        if (!valueLogin) {
            setObjValidInput({
                ...objvalidInput,
                isValidValueLogin: false
            })
            toast.error("Please enter your email or phone number");
            return;
        }
        if (!password) {
            setObjValidInput({
                ...objvalidInput,
                isValidPassword: false
            })
            toast.error("Please enter your password");
            return;
        }

        setIsLoading(true); // Bắt đầu loading
        try {
            let response = await LoginService(valueLogin, password)
            if (response && +response.EC === 0) {
                let groupWithRoles = response.DT.groupWithRoles;
                let email = response.DT.email;
                let username = response.DT.username;
                let token = response.DT.access_token
                let data = {
                    isAuthenticated: true,
                    token,
                    account: { groupWithRoles, email, username },
                    isLoading: false
                }
                localStorage.setItem("jwt", token)
                loginContext(data)
                navigate("/");
                toast.success("Login success");
            }
            if (response && +response.EC === 0) {
                if (response.user.roleid === 'R1') {
                    navigate('/system');
                } else {
                    navigate('/home');
                }
            }
            if (response && +response.EC !== 0) {
                setObjValidInput({
                    ...objvalidInput,
                    isValidValueLogin: false
                })
                toast.error(response?.EM || "Login failed");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false); // Kết thúc loading dù thành công hay lỗi
        }

    }

    const handlePressEnter = (e: React.KeyboardEvent) => {
        if (e.charCode === 13 || e.code === 'Enter') {
            login();
        }
    }
    useEffect(() => {
        if (user && user.isAuthenticated) {
            navigate('/')
        }
    }, [])
    return (
        <>
            {isLoading ? (
                <div className='loading-container'>
                    <ClimbingBoxLoader
                        color="green"
                        loading
                        size={20}
                        speedMultiplier={1}
                    />
                    <div className='loading'>loading ...</div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full px-[50px] text-center bg-white">
                    <h1 className="text-2xl font-bold mb-4">Sign in</h1>
                    <input
                        type="email"
                        placeholder="Email and phone"
                        className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                        ${objvalidInput.isValidValueLogin ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                        value={valueLogin}
                        onChange={(e) => { setValueLogin(e.target.value) }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                        ${objvalidInput.isValidPassword ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        onKeyPress={(e) => handlePressEnter(e)}
                    />
                    <button
                        className="bg-[#6200ea] hover:bg-[#5300d6] text-white font-bold text-sm px-[45px] py-3 mt-4 uppercase rounded-[20px] transition-transform duration-100"
                        onClick={() => login()}
                    >
                        Sign In
                    </button>
                </div>
            )}
        </>
    );
}
export default SignInForm
