import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, Profile } from "../../../Services/clientSevice";
import { toast } from "react-toastify";

const PersonalInfoForm: React.FC = () => {
    const [info, setInfo] = useState<Profile>({
        username: "",
        birthday: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        ward: "",
        address: "",
    });



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProfile();

                if (res.data.EC === 0) {
                    const user = res.data.DT;

                    setInfo({
                        username: user.username || "",
                        birthday: user.birthday || "",
                        phone: user.phone || "",
                        email: user.email || "",
                        province: user.province || "",
                        district: user.district || "",
                        ward: user.ward || "",
                        address: user.address || "",
                    });
                }
            } catch (err) {
                console.error("Load profile error:", err);
                toast.error("Lỗi tải dữ liệu!");
            }
        };

        fetchData();
    }, []);



    const handleChange = (field: keyof Profile, value: string) => {
        setInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {

        const requiredFields: { key: keyof Profile; label: string }[] = [
            { key: "username", label: "Họ tên" },
            { key: "birthday", label: "Ngày sinh" },
            { key: "province", label: "Tỉnh/Thành phố" },
            { key: "district", label: "Quận/Huyện" },
            { key: "ward", label: "Phường/Xã" },
            { key: "address", label: "Địa chỉ chi tiết" },
        ];

        for (let field of requiredFields) {
            const value = info[field.key] ?? "";

            if (value.trim() === "") {
                toast.error(`Vui lòng nhập ${field.label}`);
                return;
            }
        }

        try {
            const res = await updateProfile(info);

            if (res.data.EC === 0) {
                toast.success("Cập nhật thành công!");
            } else {
                toast.warning(res.data.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi hệ thống");
        }
    };
    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-center text-4xl font-semibold mb-10">Thông tin cá nhân</h1>

            <div className="space-y-6">

                <div className="flex items-center">
                    <label className="w-40 text-lg">Email:</label>
                    <input
                        value={info.email}
                        disabled
                        className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                        title="Email không thể thay đổi"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Điện thoại:</label>
                    <input
                        value={info.phone}
                        disabled
                        className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                        title="Số điện thoại không thể thay đổi"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Họ tên:</label>
                    <input
                        value={info.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="Nhập họ tên"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Ngày sinh:</label>
                    <input
                        type="date"
                        value={info.birthday}
                        onChange={(e) => handleChange("birthday", e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="Chọn ngày sinh"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Tỉnh/Thành phố:</label>
                    <input
                        value={info.province}
                        onChange={(e) => handleChange("province", e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="VD: Hà Nội"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Quận/Huyện:</label>
                    <input
                        value={info.district}
                        onChange={(e) => handleChange("district", e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="VD: Cầu Giấy"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Phường/Xã:</label>
                    <input
                        value={info.ward}
                        onChange={(e) => handleChange("ward", e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="VD: Dịch Vọng"
                    />
                </div>

                <div className="flex items-center">
                    <label className="w-40 text-lg">Địa chỉ chi tiết:</label>
                    <input
                        value={info.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="VD: Số 12, Ngõ 50..."
                    />
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={handleUpdate}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        Cập nhật
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
