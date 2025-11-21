import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../../../Services/clientSevice";
import ProductCard, { Product, normalizeProduct } from "../../Client/productSection/ProductCard";

const SearchPage = () => {
    const [params] = useSearchParams();
    const q = params.get("q") || "";
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const res = await searchProducts(q);
            console.log("KQ API Search:", res);

            if (res.EC === 0 && res.DT && Array.isArray(res.DT.items)) {
                setResults(res.DT.items.map((item: any) => normalizeProduct(item)));
            } else {
                setResults([]);
            }
        };
        fetch();
    }, [q]);

    return (
        <>
            <div className="flex ml-[45px] mt-[150px]">
                <div>
                    <a href="/home" className="text-black no-underline flex items-center">
                        <i className="fa-solid fa-house-chimney"></i>
                        <span>Trang chủ |</span>
                    </a>
                </div>
            </div>
            <div>

                <h1 className="text-2xl font-bold text-center mb-10">
                    Kết quả tìm kiếm cho: <span className="text-blue-600">{q}</span>
                </h1>

                {results.length === 0 && (
                    <div className="w-full text-center py-20">
                        <p className="text-gray-500 text-xl font-medium">
                            Không tìm thấy sản phẩm nào
                        </p>
                        <p className="text-gray-400 mt-2">
                            Hãy thử từ khóa khác hoặc kiểm tra lại chính tả.
                        </p>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                        {results.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                )}
            </div>
        </>

    );

};

export default SearchPage;