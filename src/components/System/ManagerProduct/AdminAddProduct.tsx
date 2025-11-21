import React from "react";
import { useAddProduct } from "./AddProductTypes";

const AddProductForm: React.FC = () => {
    const {
        formData,
        errors,
        categories,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        handleFileChange,
        removeImage,
        addVariant,
        updateVariant,
        removeVariant,
        handleVariantFileChange,
    } = useAddProduct();

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Thêm sản phẩm</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Tên sản phẩm *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên sản phẩm"
                            className="border p-2 w-full rounded"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block font-medium">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả sản phẩm"
                            className="border p-2 w-full rounded"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Giá sản phẩm *</label>
                        <input
                            type="number"
                            name="price_min"
                            value={formData.price_min}
                            onChange={handleInputChange}
                            placeholder="Nhập giá sản phẩm"
                            className="border p-2 w-full rounded"
                        />
                        {errors.price_min && <p className="text-red-500">{errors.price_min}</p>}
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block font-medium">Danh mục *</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-500">{errors.category_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium">Ảnh chính *</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            aria-label="Chọn ảnh sản phẩm"
                        />

                        <div className="flex gap-2 mt-2 flex-wrap">
                            {formData.thumbnail.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={img}
                                        alt={`Ảnh sản phẩm ${idx + 1}`}
                                        className="w-20 h-20 object-cover border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1"
                                        title="Xóa ảnh"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.images && (
                            <p className="text-red-500">{errors.images}</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleCheckboxChange}
                            />
                            Active
                        </label>
                    </div>
                </div>


                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Biến thể sản phẩm</h3>
                    {formData.variants.map((variant, idx) => (
                        <div
                            key={idx}
                            className="p-4 border rounded-lg space-y-3 bg-gray-50"
                        >
                            <div className="grid grid-cols-4 gap-3">
                                <input
                                    placeholder="Size"
                                    value={variant.size}
                                    onChange={(e) =>
                                        updateVariant(idx, "size", e.target.value)
                                    }
                                    className="border p-2 rounded"
                                />
                                <input
                                    placeholder="Màu"
                                    value={variant.color}
                                    onChange={(e) =>
                                        updateVariant(idx, "color", e.target.value)
                                    }
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Giá"
                                    value={variant.price}
                                    onChange={(e) =>
                                        updateVariant(idx, "price", Number(e.target.value))
                                    }
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Số lượng"
                                    value={variant.quantity}
                                    onChange={(e) =>
                                        updateVariant(idx, "quantity", Number(e.target.value))
                                    }
                                    className="border p-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block font-medium">Ảnh biến thể</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) =>
                                        e.target.files &&
                                        handleVariantFileChange(idx, Array.from(e.target.files))
                                    }
                                    aria-label="Chọn ảnh biến thể"
                                />

                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {variant.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Ảnh biến thể ${i + 1}`}
                                            className="w-16 h-16 object-cover border rounded"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeVariant(idx)}
                                className="text-red-500 text-sm"
                                title="Xóa biến thể"
                            >
                                Xóa biến thể
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addVariant}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        + Thêm biến thể
                    </button>
                    {errors.variants && (
                        <p className="text-red-500">{errors.variants}</p>
                    )}
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Lưu sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;
