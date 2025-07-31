
export default function SignInForm() {
    return (
        <form className="flex flex-col items-center justify-center h-full px-[50px] text-center bg-white">
            <h1 className="text-2xl font-bold mb-4">Sign in</h1>
            <input
                type="email"
                placeholder="Email"
                className="bg-[#eee] border-none p-3 mb-2 w-full"
            />
            <input
                type="password"
                placeholder="Password"
                className="bg-[#eee] border-none p-3 mb-2 w-full"
            />
            <button className="bg-[#6200ea] hover:bg-[#5300d6] text-white font-bold text-sm px-[45px] py-3 mt-4 uppercase rounded-[20px] transition-transform duration-100">
                Sign In
            </button>
        </form>
    );
}