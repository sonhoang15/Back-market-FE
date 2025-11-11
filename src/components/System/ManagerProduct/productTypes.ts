export interface ProductVariant {
    id?: number;
    product_id?: number;
    name: string;
    color?: string;
    size?: string;
    price: number;
    stock?: number;
    image?: string;
    source_url?: string;
}
export interface Category {
    id: number;
    name: string;
    description?: string;
    source_type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: number
    name: string
    description?: string
    thumbnail?: string
    category_id?: number
    source: 'manual' | 'crawl'
    source_url?: string
    price_min?: number
    price_max?: number
    is_active: boolean
    status: 'draft' | 'published' | 'hidden'
    manual_override: boolean
    created_at: string
    updated_at: string
    variants?: ProductVariant[]
    image?: string;
    category?: Category;
    totalStock?: number;
}
