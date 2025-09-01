import img1 from "../../../assets/anh/6.jpeg";
import img2 from "../../../assets/anh/7.jpeg";
import img3 from "../../../assets/anh/8.jpeg";
import img4 from "../../../assets/anh/9.jpeg";

import ProductCard from "./ProductCard";

const products = [
    {
        id: 1,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img1,
        thumbnails: [img1, img2],
    },
    {
        id: 2,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img2,
        thumbnails: [img2, img3],
    },
    {
        id: 3,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img3,
        thumbnails: [img3, img4],
    },
    {
        id: 4,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
    {
        id: 5,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
    {
        id: 6,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
    {
        id: 7,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
    {
        id: 8,
        name: 'Áo polo cổ Đức Regular Cotton 1024',
        price: '319.000₫',
        img: img4,
        thumbnails: [img4, img1],
    },
];

export default function BestSaleProduct() {
    return (
        <>
            <div className="px-4 py-8">
                <h1 className="text-2xl font-bold text-center mb-6 uppercase">Sản phẩm bán chạy</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </>
    );
}
