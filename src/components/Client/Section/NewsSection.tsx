import img1 from '../../../assets/anh/239.jpg'
import img2 from '../../../assets/anh/240.webp'
import img3 from '../../../assets/anh/241.webp'
import img4 from '../../../assets/anh/242.webp'
import img5 from "../../../assets/anh/251.webp"

const NewsSection = () => {
  const news = [
    {
      title: "GRAND OPENING - KRIK 132 CẦU GIẤY",
      content: "GRAND OPENING | 132 CẦU GIẤY: Sự kiện khai trương của hãng đáu tiên mang thương hiệu KRIK tại 132 Cầu Giấy trong những ngày vừa qua đã diễn ra",
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
      content: "Cách thức đặt hàng,.dat hàng qua Hotline: Quý trực tiếp đến số điện thoại: 0982.022.969 để được hỗ trợ nhanh nhất về sản phẩm và dịch vụ",
      link: "Xem thêm",
      image: img3
    },
    {
      title: "Chính sách thành viên",
      content: "Chính sách thành viên MEMBER CARD: Tổng giá trị hóa đơn đã mua từ 0-3tr được tích 3% trên tổng giá trị hóa đơn. VIP CARD: Tổng giá trị hóa đơn đã",
      link: "Xem thêm",
      image: img4
    }
  ];

  return (
    <>
      <div className="py-16 bg-white">
        <div className="max-w-[100rem] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">TIN TỨC</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {news.map((article, index) => (
              <div key={index} className="group">
                <img
                  src={article.image}
                  className="mb-4 w-full h-40 object-cover rounded cursor-pointer"
                />
                <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-gray-300 transition-colors duration-300 cursor-pointer">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {article.content}
                </p>
                <a
                  href="#"
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-300"
                >
                  {article.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full mt-[70px]">
        <img src={img5} alt="" className="w-full object-cover" />
      </div>
    </>
  );
};

export default NewsSection;