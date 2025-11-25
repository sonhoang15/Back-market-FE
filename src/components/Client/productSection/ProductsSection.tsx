import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import * as clientService from "../../../Services/clientSevice";
import { normalizeProduct } from "./ProductCard";


export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  thumbnails: string[];
}

export default function NewProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientService.getNewestProducts(8)
      .then(res => {
        const normalized = res.data.DT.map((p: any) => normalizeProduct(p));
        setProducts(normalized);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="form-top px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6 uppercase">Sản phẩm mới</h1>

      {loading ? (
        // Loading UI
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-[500px]"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
