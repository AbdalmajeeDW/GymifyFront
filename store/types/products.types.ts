// src/types/product.types.ts
import { statusRequest } from "@/common/enums";

// تصنيفات المنتجات
export enum ProductCategory {
  SUPPLEMENTS = "supplements",
  CLOTHING = "clothing",
  EQUIPMENT = "equipment",
  ACCESSORIES = "accessories",
  PROTEIN_BARS = "protein_bars",
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  category: ProductCategory;
  brand: string;
  imageUrl: string;
  sku: string;
  rating: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductState {
  products: Product[];
  status: statusRequest;
  statusAddProduct: statusRequest;
  statusFetchProducts: statusRequest;
  selectedProduct: Product | null;
  titlePage: {
    title: string;
    description: string;
  };
}
