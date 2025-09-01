import img1 from "../../../assets/anh/6.jpeg";
import img2 from "../../../assets/anh/7.jpeg";
import img3 from "../../../assets/anh/8.jpeg";
import img4 from "../../../assets/anh/9.jpeg";


import ProductCard from "../productSection/ProductCard";


const products = [
    {
        id: 1,
        name: 'Dây Lưng Karik 0029',
        price: '449.000₫',
        img: img1,
        thumbnails: [img1, img2],
    },
    {
        id: 2,
        name: 'Dây Lưng Karik 0028',
        price: '449.000₫',
        img: img2,
        thumbnails: [img2, img3],
    },
    {
        id: 3,
        name: 'Dây Lưng Karik 0024',
        price: '449.000₫',
        img: img3,
        thumbnails: [img3, img4],
    },
    {
        id: 4,
        name: 'Dây Lưng Karik 0027',
        price: '449.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
    {
        id: 5,
        name: 'Dây Lưng Karik 0029',
        price: '449.000₫',
        img: img1,
        thumbnails: [img1, img2],
    },
    {
        id: 6,
        name: 'Dây Lưng Karik 0028',
        price: '449.000₫',
        img: img2,
        thumbnails: [img2, img3],
    },
    {
        id: 7,
        name: 'Dây Lưng Karik 0024',
        price: '449.000₫',
        img: img3,
        thumbnails: [img3, img4],
    },
    {
        id: 8,
        name: 'Dây Lưng Karik 0027',
        price: '449.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
];
function Shirts() {
    return (
        <>
            {/* Tiêu đề */}
            <div className="flex ml-[45px] mt-[10px]">
                <div className="back">
                    <a href="/home" className="no-underline text-black">
                        <i className="fa-solid fa-house-chimney"></i>
                        <span>Trang chủ |</span>
                    </a>
                </div>
                <span className="ml-[10px]">Áo</span>
            </div>

            {/* Header */}
            <div className="mt-[80px] ml-[45px] flex justify-between">

                <div>
                    <h1 className="uppercase text-[35px] font-semibold font-sans">Áo</h1>
                    <div className="relative flex mt-[21px]">
                        <h4 className="mt-[21px]">BỘ LỌC</h4>
                        <ul className="flex ml-[50px] mt-[21px]">
                            <li className="list-none text-[16px] mx-[27px]">
                                <a href="#" className="text-black no-underline">Màu Sắc <i className="fa-solid fa-angle-down"></i></a>
                            </li>
                            <li className="list-none text-[16px] mx-[27px]">
                                <a href="#" className="text-black no-underline">Kích cỡ <i className="fa-solid fa-angle-down"></i></a>
                            </li>
                            <li className="list-none text-[16px] mx-[27px]">
                                <a href="#" className="text-black no-underline">Khoảng giá <i className="fa-solid fa-angle-down"></i></a>
                            </li>
                        </ul>

                        <div className="hidden group-hover:block absolute z-[1] border border-gray-200 bg-white p-[10px] top-[55px] left-[130px] w-full">
                            <div className="flex gap-6">

                                <div className="flex flex-wrap gap-2">
                                    <div className="w-6 h-6 bg-red-500"></div>
                                    <div className="w-6 h-6 bg-blue-500"></div>
                                    <div className="w-6 h-6 bg-yellow-300"></div>
                                    <div className="w-6 h-6 bg-gray-500"></div>
                                    <div className="w-6 h-6 bg-black"></div>
                                    <div className="w-6 h-6 bg-white border"></div>
                                    <div className="w-6 h-6 bg-pink-400"></div>
                                    <div className="w-6 h-6 bg-amber-900"></div>
                                </div>


                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="size-s" />
                                        <span>S</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="size-m" />
                                        <span>M</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="size-l" />
                                        <span>L</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="size-xl" />
                                        <span>XL</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="size-2xl" />
                                        <span>2XL</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="size-3xl" />
                                        <span>3XL</span>
                                    </label>
                                </div>


                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="price-1" />
                                        <span>Dưới 200k</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="price-2" />
                                        <span>Từ 200k - 500k</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="price-3" />
                                        <span>Từ 500k - 1 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" id="price-4" />
                                        <span>Trên 1 triệu</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex items-center mt-[107px] mr-[50px]">
                    <h5>Sắp xếp theo:</h5>
                    <select className="ml-[20px] px-2 py-1 border rounded">
                        <option>Mới nhất</option>
                        <option>Giá giảm dần</option>
                        <option>Giá tăng dần</option>
                        <option>Sale</option>
                    </select>
                </div>
            </div>


            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}
export default Shirts;
