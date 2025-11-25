import { useState, useEffect } from "react";
import ProductCard from "../productSection/ProductCard";
import { getProductsByCategory } from "../../../Services/clientSevice";
import type { Product } from "../productSection/ProductCard";

function Pants() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {

            try {
                const data = await getProductsByCategory(2);
                setProducts(data);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <div className="flex ml-[45px] mt-[150px]">
                <div>
                    <a href="/home" className="text-black no-underline flex items-center">
                        <i className="fa-solid fa-house-chimney"></i>
                        <span>Trang chủ |</span>
                    </a>
                </div>
                <span className="ml-[10px]">Quần</span>
            </div>

            <div className="mt-[80px] ml-[45px] flex justify-between">

                <div>
                    <h1 className="uppercase text-[35px] font-semibold font-sans">Quần</h1>

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
                    </div>
                </div>

                <div className="flex items-center mt-[107px] mr-[50px]">
                    <label className="flex items-center gap-2">
                        <h5>Sắp xếp theo:</h5>
                        <select className="ml-[20px] px-2 py-1 border rounded">
                            <option>Mới nhất</option>
                            <option>Giá giảm dần</option>
                            <option>Giá tăng dần</option>
                            <option>Sale</option>
                        </select>
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-gray-200 h-[500px]"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mt-10">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </>
    );
}

export default Pants;
