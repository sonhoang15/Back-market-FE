import img1 from "../../assets/anh/251.webp"

const Footer = () => {
    return (
        <>
            <div className="top-[720px]">
                <div className="relative w-full mt-[70px]">
                    <img src={img1} alt="" className="w-full object-cover" />
                </div>

                <div className="relative w-full mt-[70px]">
                    <div className="border-t border-gray-300 flex flex-wrap p-10 relative -bottom-12">
                        <div className="w-full md:w-1/4 text-left px-5 mb-4">
                            <h4 className="mb-2 font-semibold">Gọi mua hàng (8:30-22:00)</h4>
                            <p className="flex items-center gap-2"><span className="text-white rounded-full bg-red-600 w-6 h-6 text-center leading-6"> <i className='bx bxs-phone'></i> </span><a className="text-black text-xl" href="">0982022969</a></p>
                            <p className="mt-2">Tất cả các ngày trong tuần</p>
                        </div>
                        <div className="w-full md:w-1/4 text-left px-5 mb-4">
                            <h4 className="mb-2 font-semibold">Góp ý, khiếu nại (8:30-22:00)</h4>
                            <p className="flex items-center gap-2"><span className="text-white rounded-full bg-red-600 w-6 h-6 text-center leading-6"> <i className='bx bxs-phone'></i> </span><a className="text-black text-xl" href="">0915988888</a></p>
                            <p className="mt-2">Tất cả các ngày trong tuần</p>
                        </div>
                        <div className="w-full md:w-1/4 px-5 mb-4">
                            <h4 className="text-lg font-semibold mb-4 text-gray-800"> ĐĂNG KÍ NHẬN THÔNG TIN MỚI</h4>
                            <div className="flex">
                                <input type="email" placeholder="Nhập email..." className="px-4 py-2 border border-gray-300" />
                                <a href="#" className="border border-black bg-black text-white px-4 py-2"> Đăng ký </a>
                            </div>
                        </div>
                        <div className="w-full md:w-1/4 px-5 mb-4">
                            <h4 className="mb-2 font-semibold">THEO DÕI CHÚNG TÔI</h4>
                            <div className="flex gap-4 text-3xl">
                                <a href="#" className="text-black"><i className='bx bxl-facebook'></i></a>
                                <a href="#" className="text-black"><i className='bx bxl-instagram'></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="bg-gray-100 text-gray-800 py-6 mt-6">
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold mb-4">VỀ CHÚNG TÔI</h3>
                            <p className="font-semibold">Công ty TNHH KRIK Việt Nam</p>
                            <p><strong>Địa chỉ:</strong> Số 344 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội</p>
                            <p><strong>Mã số doanh nghiệp:</strong> 0108901419 do Sở kế hoạch và đầu tư thành phố Hà Nội cấp ngày 17/09/2019</p>
                            <p><strong>Điện thoại:</strong> 0982.022.969</p>
                            <p><strong>Email:</strong> nhansu@krik.vn</p>
                            <img src="" alt="Đã thông báo" className="mt-4 w-48" />
                        </div>


                        <div>
                            <h3 className="font-bold mb-4">CHÍNH SÁCH VÀ QUY ĐỊNH</h3>
                            <ul className="space-y-2">
                                <li>Cách thức đặt hàng</li>
                                <li>Chính sách thành viên</li>
                                <li>Chính sách giao hàng</li>
                                <li>Quy định đổi trả</li>
                                <li>Hình thức thanh toán</li>
                                <li>Chính sách bảo mật</li>
                                <li>Chính sách xử lí khiếu nại</li>
                                <li>Chính sách kiểm hàng</li>
                            </ul>
                        </div>


                        <div>
                            <h3 className="font-bold mb-4">HỆ THỐNG CỬA HÀNG</h3>
                            <ul className="space-y-2">
                                <li>25c Đại La</li>
                                <li>334 Cầu Giấy</li>
                                <li>132 Cầu Giấy</li>
                                <li>280-282 Nguyễn Trãi</li>
                                <li>167 Chùa Bộc</li>
                                <li>307H Bạch Mai</li>
                                <li>23 Chùa Bộc</li>
                                <li>189 Phố Nhổn</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">FANPAGE CHÚNG TÔI</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li>NOTICE</li>
                                <li>REVIEW</li>
                                <li>WEEKLY TOP 10</li>
                                <li>1:1 Q & A</li>
                            </ul>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}

export default Footer;