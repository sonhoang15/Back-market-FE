import img1 from "../../../assets/anh/1.jpeg";
import img2 from "../../../assets/anh/2.jpeg";
import img3 from "../../../assets/anh/3.jpeg";
import img4 from "../../../assets/anh/4.jpeg";

import ProductCard from "./ProductCard";

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

export default function NewProduct() {
  return (
    <div className="form-top px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6 uppercase">Sản phẩm mới</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}