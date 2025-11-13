import { RegisterService } from "../../Services/userService";
import { useEffect } from "react";
import * as React from 'react';
import { toast } from 'react-toastify';

const SignUpForm = () => {
    // const { user } = useContext(UserContext)
    const [email, setEmail] = React.useState("");
    const [username, setUserName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const defaultInput = {
        isValidEmail: true,
        isValidUserName: true,
        isValidPhone: true,
        isValidAddress: true,
        isValidSex: true,
        isValidPassword: true,
        isValidRePassword: true
    }
    const [objectCheckInput, setObjectCheckInput] = React.useState({ ...defaultInput });

    const isValidInput = () => {
        setObjectCheckInput({ ...defaultInput });
        if (!email || !username || !phone || !address || !password) {
            setObjectCheckInput({
                isValidEmail: false,
                isValidUserName: false,
                isValidPhone: false,
                isValidAddress: false,
                isValidSex: false,
                isValidPassword: false,
                isValidRePassword: false
            });
            toast.error("Please fill all fields");
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            setObjectCheckInput({
                ...defaultInput,
                isValidEmail: false
            });
            toast.error("Invalid email format");
            return false;
        }

        return true;
    }

    useEffect(() => {
        let session = sessionStorage.getItem('account');
        if (session) {
            // history.push("/");
            window.location.reload();
        }
    }, [])

    const handleSignUp = async () => {
        let check = isValidInput();
        if (check === true) {
            let severData = await RegisterService(email, username, phone, address, password);
            if (+severData.EC === 0) {
                toast.success(severData.EM);
                setEmail('');
                setUserName('');
                setPhone('');
                setAddress('');
                setPassword('');
                setObjectCheckInput({ ...defaultInput });
            } else {
                toast.error(severData.EM);
            }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-full px-[50px] text-center bg-white">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>
            <input
                type="text"
                placeholder="Name"
                className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                ${objectCheckInput.isValidUserName ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                ${objectCheckInput.isValidEmail ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="phone"
                placeholder="Phone"
                className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                ${objectCheckInput.isValidPhone ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                type="address"
                placeholder="Address"
                className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                ${objectCheckInput.isValidAddress ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className={`bg-[#eee] p-3 mb-2 w-full outline-none transition-all duration-200 rounded
                ${objectCheckInput.isValidPassword ? 'border-2' : 'border-2 border-red-500 bg-red-100'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="bg-[#6200ea] hover:bg-[#5300d6] text-white font-bold text-sm px-[45px] py-3 mt-4 uppercase rounded-[20px] transition-transform duration-100"
                onClick={() => handleSignUp()}
            >
                Sign Up
            </button>
        </div>
    );
}
export default SignUpForm