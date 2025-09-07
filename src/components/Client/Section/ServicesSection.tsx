import React from 'react';
import { RotateCcw, Package, Truck } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <RotateCcw size={48} />,
      title: "Đổi trả trong vòng 5 ngày",
      description: "Chính sách đổi trả linh hoạt",
      buttonText: "XEM CHI TIẾT"
    },
    {
      icon: <Package size={48} />,
      title: "Kiểm tra hàng trước khi thanh toán",
      description: "Đảm bảo chất lượng sản phẩm",
      buttonText: "XEM CHI TIẾT"
    },
    {
      icon: <Truck size={48} />,
      title: "HỖ TRỢ SHIP cho đơn hàng từ 500K",
      description: "Miễn phí vận chuyển",
      buttonText: "XEM CHI TIẾT"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-[100rem] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4 text-gray-700">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <button className="border border-gray-800 px-6 py-2 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300">
                {service.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;