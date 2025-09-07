import { useState } from 'react';
import BuyNowModal from './buyNow';

interface Product {
    img: string;
    name: string;
    price: string | number;
    thumbnails: string[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [currentImage, setCurrentImage] = useState(product.img);

    return (
        <div className="product-item shadow-lg p-4">
            {/* Ảnh chính */}
            <div className="product-top mb-4">
                <a href="/productDetail" className="product-thumb block overflow-hidden ">
                    <img
                        src={currentImage}
                        alt={product.name}
                        className="img-feature w-full h-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                </a>
            </div>

            {/* Thumbnail */}
            <div className="image-min mb-4">
                <ul className="list-logo flex justify-center gap-2">
                    {product.thumbnails.map((thumb, index) => (
                        <li
                            key={index}
                            className="list-logo-min w-6 h-6 border overflow-hidden cursor-pointer rounded-full"
                            onMouseOver={() => setCurrentImage(thumb)}
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