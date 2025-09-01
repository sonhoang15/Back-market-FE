import img1 from "../../../assets/anh/240.webp";
import img2 from "../../../assets/anh/239.jpg";
import img3 from "../../../assets/anh/241.webp";
import img4 from "../../../assets/anh/242.webp";
import img5 from "../../../assets/anh/243.webp";
import img6 from "../../../assets/anh/244.webp";
import img7 from "../../../assets/anh/245.webp";
import img8 from "../../../assets/anh/246.webp";
import img9 from "../../../assets/anh/247.webp";
import img10 from "../../../assets/anh/248.webp";
import img11 from "../../../assets/anh/249.jpg";
import img12 from "../../../assets/anh/250.jpg";

const News = () => {
    const newsItems = [
        {
            title: "GRAND OPENING - KRIK 132 CẦU GIẤY",
            content: `GRAND OPENING | KRIK 132 CẦU GIẤY Sự kiện khai trương cửa hàng đầu tiên mang tên KRIK tại 132 Cầu Giấy
                      trong những ngày vừa qua đã diễn ra thành công rực rỡ và ấn tượng.KRIK xin gửi lời cảm ơn chân thành
                      nhất tới các vị khách hàng yêu quý, gia đình và bạn bè đã tới tham dự sự`,
            link: "Xem thêm",
            image: img1
        },
        {
            title: "TONY4MEN CHÍNH THỨC ĐỔI TÊN THÀNH KRIK",
            content: "TONY4MEN CHÍNH THỨC ĐỔI TÊN THÀNH KRIK: Bản thân mến, 5 năm là cả một chặng đường dài đôi với một thương hiệu thời trang, đã có một chỗ",
            link: "Xem thêm",
            image: img2
        },
        {
            title: "Cách thức đặt hàng",
            content: `  Cách thức đặt hàng Đặt hàng qua Hotline: Gọi trực tiếp đến sđt: 0982.022.969 để được nhân viên tư vấn hỗ trợ nhanh nhất về sản phẩm và dịch vụ.
                        Đặt hàng trên FB: Gửi ảnh hoặc mã sp mà mình quan tâm đến Page KRIK (m.me/krik.vn).
                        Nhân viên tư vấn sẽ trả lời nhanh chóng và chính xác.`,
            link: "Xem thêm",
            image: img3
        },
        {
            title: "Chính sách thành viên",
            content: `  GRAND OPENING | KRIK 132 CẦU GIẤY Sự kiện khai trương cửa hàng đầu tiên mang tên KRIK tại 132 Cầu Giấy
                        trong những ngày vừa qua đã diễn ra thành công rực rỡ và ấn tượng.KRIK xin gửi lời cảm ơn chân thành
                        nhất tới các vị khách hàng yêu quý, gia đình và bạn bè đã tới tham dự sự`,
            link: "Xem thêm",
            image: img4
        },
        {
            title: "Chính sách giao hàng",
            content: `  Chính sách giao hàng Nhận ship COD toàn quốc, thanh toán khi nhận hàng. Đơn nội thành nhận trong ngày, với đơn ngoại thành nhận hàng sau 1-2 ngày.
                        Những đơn hàng đi tỉnh tùy thuộc vào vị trí địa lý xa hay gần mà thời gian giao hàng có thể dao động từ 3-5 ngày. Liên hệ`,
            link: "Xem thêm",
            image: img5
        },
        {
            title: "Chính sách đổi trả hàng",
            content: `Chính sách đổi trả hàngĐể giúp khách hàng có những trải nghiệm mua sắm tốt nhất & luôn cảm thấy hài lòng với sự lựa chọn của mình,
                      KRIK mang đến chính sách đổi trả dễ dàng và thuận tiện1. ĐIỀU KIỆN ĐỔI HÀNGKhách hàng còn giữ hóa đơn mua hàng, có để lại thông tin khách hàng khi`,
            link: "Xem thêm",
            image: img6
        },
        {
            title: "Hình thức thanh toán",
            content: `Hình thức thanh toán.
              Các hình thức thanh toán- Thanh toán khi nhận hàng: Tiền Mặt- Thanh toán qua hình thức quẹt thẻ (thẻ nội địa, thẻ VISA/MASTERCARD được phát hành bởi các Ngân hàng thương mại Việt Nam)- Chuyển khoản qua ứng dụng Mobile Banking do các ngân hàng`,
            link: "Xem thêm",
            image: img7
        },
        {
            title: "Chính sách bảo mật",
            content: `Chính sách bảo mật Mục đích: Nhằm tôn trọng sự riêng tư, bảo vệ thông tin cá nhân và thông tin thanh toán của KHÁCH HÀNG cũng như thuận tiện cho việc chăm sóc khách hàng của chúng tôi.
                      Thông tin bao gồm: Họ tên, số điện thoại, email, địa chỉ Cam kết: Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng và không chia sẻ với bất kỳ bên thứ ba nào.`,
            link: "Xem thêm",
            image: img8
        },
        {
            title: "Chính sách khiếu nại",
            content: ` Chính sách xử lý khiếu nạiTrong trường hợp có bất kỳ thắc mắc hay khiếu nại về sản phẩm, dịch vụ, quý khách vui lòng liên hệ hotline: 09159.88888 Khiếu nại về việc giao sản phẩm, thái độ của nhân viên giao hàng, đổi/trả sản phẩm... Khách hàng có thể liên hệ với bộ phận chăm sóc`,
            link: "Xem thêm",
            image: img9
        },
        {
            title: "Chính sách kiểm hàng",
            content: `  Chính sách kiểm hàngNhằm đáp ứng nhu cầu và bảo vệ tối đa quyền lợi khách hàng khi mua sản phẩm của KRIK. Chúng tôi đã triển khai chính sách hỗ trợ việc xem và kiểm tra hàng hóa khi giao hàng. Khách hàng khi nhận được hàng từ nhân viên vận chuyển có thể mở niêm phong gói hàng để kiểm tra sản phẩm trước khi ký nhận.`,
            link: "Xem thêm",
            image: img10
        },
        {
            title: "Sinh nhật 7 tuổi",
            content: `🎁𝗛𝗔𝗣𝗣𝗬 𝟳𝗧𝗛 𝗧𝗢𝗡𝗬𝟰𝗠𝗘𝗡 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬🎁‼TONY4MEN chính thức tròn 7 năm hình thành và phát triển.
                       Đó là một chặng đường không hẳn dài cũng không quá ngắn mà đó là quãng thời gian vừa đủ để chúng mình nỗ lực định hình phong cách thời trang cho đa số các bạn trẻ Việt Nam.`,
            link: "Xem thêm",
            image: img11
        },
        {
            title: "Phối đồ với sơ mi trắng sao cho hợp?",
            content: `Chỉ cần biết cách phối đồ với áo sơ mi trắng nam bạn đã có thể tạo ra những set đồ “cực chất”!Sự thật là…90% phụ nữ thừa nhận họ bị “đốn gục” hoàn toàn trước hình ảnh chàng trai mặc áo sơ mi trắng.
                            Quả thật, sơ mi trắng chính là “vũ khí không lời” giúp phái mạnh toát lên nét quyến rũ.`,
            link: "Xem thêm",
            image: img12
        },
    ];
    return (
        <div className="px-10 pt-10">
            {/* breadcrumb */}
            <div className="flex w-full h-9 bg-[#f5f5f5]">
                <a href="/home" className="no-underline mt-3">
                    <span className="text-black px-3 ml-[30px]">Trang chủ</span>
                </a>
                <p className="m-3 ml-[-6px]">» Tin tức</p>
            </div>

            <div className="grid grid-cols-3 gap-12 mt-[60px] w-full max-w-[1200px] mx-auto px-6">
                {newsItems.map((item, index) => (
                    <div key={index}>
                        <div>
                            <img className="max-w-[350px]" src={item.image} alt="" />
                        </div>
                        <div className="no-underline text-black mt-2 block">
                            <a href="" className="no-underline text-black">
                                <span className="font-semibold uppercase text-[15px]">{item.title}</span>
                            </a>
                            <p className="w-[88%] mt-2 text-sm">{item.content}</p>
                            <a href="" className="no-underline text-red-600 text-sm">
                                <span>{item.link}</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
