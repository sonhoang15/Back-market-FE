import { useState } from 'react';
import BuyNowModal from './buyNow';

export interface Product {
    id: number;
    img: string;
    name: string;
    price: string | number;
    thumbnails: string[];
    variants?: Array<{
        color?: string;
        image?: string;
        images?: string[];
    }>;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [currentImage, setCurrentImage] = useState(product.img);

    // Hàm lấy ảnh DUY NHẤT (bao gồm cả ảnh chính và loại bỏ trùng lặp)
    const getUniqueThumbnails = () => {
        // Tạo mảng bao gồm ảnh chính + tất cả thumbnails
        const allImages = [product.img, ...product.thumbnails];

        // Sử dụng Set để loại bỏ các URL trùng lặp
        const uniqueThumbnails = [...new Set(allImages)];

        console.log('Main image:', product.img);
        console.log('All thumbnails:', product.thumbnails);
        console.log('Unique thumbnails (including main):', uniqueThumbnails);

        return uniqueThumbnails;
    };

    const uniqueThumbnails = getUniqueThumbnails();

    return (
        <div className="product-item shadow-lg p-4">
            {/* Ảnh chính */}
            <div className="product-top mb-4">
                <a
                    href="/productDetail"
                    className="product-thumb block overflow-hidden rounded-lg bg-[#f8f9fc]"
                >
                    <div className="w-full h-[500px] flex items-center justify-center">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </div>
                </a>
            </div>

            {/* Thumbnail - BAO GỒM CẢ ẢNH CHÍNH VÀ ẢNH DUY NHẤT */}
            {uniqueThumbnails.length > 0 && (
                <div className="image-min mb-4">
                    <ul className="list-logo flex justify-center gap-2">
                        {uniqueThumbnails.map((thumb, index) => (
                            <li
                                key={index}
                                className={`list-logo-min w-6 h-6 border overflow-hidden cursor-pointer rounded-full ${thumb === currentImage ? 'border-2 border-blue-500' : 'border-gray-300'
                                    }`}
                                onMouseOver={() => setCurrentImage(thumb)}
                                onClick={() => setCurrentImage(thumb)}
                            >
                                <img
                                    src={thumb}
                                    alt={`thumb-${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Thông tin */}
            <div className="product-infor text-center">
                <a href="#" className="block font-medium text-gray-800 hover:text-gray-400 transition">
                    {product.name}
                </a>
                <span className="text-red-600 font-semibold text-lg block mt-1">
                    {product.price}
                </span>
            </div>
            <div className="mt-2">
                <ul className="flex justify-around border border-black p-[10px] ">
                    <BuyNowModal />
                    <li>
                        <a href="/productDetail" className="text-black hover:text-gray-400">Chi Tiết</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}