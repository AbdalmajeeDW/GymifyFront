"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Search,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
} from "@/store/slices/productsSlice";
import { Product, ProductCategory } from "@/store/types/products.types";
import { statusRequest } from "@/common/enums";
import StatsCard from "@/components/Cards/StatsCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion as FramerMotion } from "framer-motion";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const productsData = useAppSelector(selectAllProducts);
  const statusData = useAppSelector(selectProductsStatus);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string>(statusRequest.LOADING);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStock, setFilterStock] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setLoading(statusData);
    if (statusData === statusRequest.FAILED) {
      setError("فشل في تحميل البيانات");
    }
  }, [statusData]);

  useEffect(() => {
    if (Array.isArray(productsData)) {
      setProducts(productsData);
    }
  }, [productsData]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0);
    const lowStock = products.filter((p) => Number(p.stock) < 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const featured = products.filter((p) => p.isFeatured).length;

    return {
      totalProducts,
      totalValue,
      lowStock,
      outOfStock,
      featured,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase()) ||
          product.brand.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filterCategory,
      );
    }

    if (filterStock !== "all") {
      if (filterStock === "in_stock") {
        filtered = filtered.filter((product) => product.stock > 0);
      } else if (filterStock === "low_stock") {
        filtered = filtered.filter(
          (product) => product.stock > 0 && product.stock < 10,
        );
      } else if (filterStock === "out_of_stock") {
        filtered = filtered.filter((product) => product.stock === 0);
      }
    }

    return filtered;
  }, [products, search, filterCategory, filterStock]);

  const cardArray = [
    {
      title: { text: "Total Products" },
      value: { text: stats.totalProducts },
      icon: <Package className="w-7 h-7 text-blue-600" />,
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      description: "All products in store",
    },
    {
      title: { text: "Total Value" },
      value: { text: `$${stats.totalValue.toLocaleString()}` },
      icon: <DollarSign className="w-7 h-7 text-green-600" />,
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-emerald-600",
      description: "Inventory total value",
    },
    {
      title: { text: "Low Stock" },
      value: { text: stats.lowStock },
      icon: <TrendingUp className="w-7 h-7 text-orange-600" />,
      bgColor: "bg-orange-100",
      gradient: "from-orange-500 to-red-500",
      description: "Products with low stock",
    },
    {
      title: { text: "Out of Stock" },
      value: { text: stats.outOfStock },
      icon: <ShoppingBag className="w-7 h-7 text-red-600" />,
      bgColor: "bg-red-100",
      gradient: "from-red-500 to-pink-500",
      description: "Products unavailable",
    },
  ];

  const handleView = (id: number) => {
    router.push(`/products/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/products/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(fetchProducts());
    }
  };

  const handleAddProduct = () => {
    router.push("/products/add");
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
          Out of Stock
        </span>
      );
    } else if (stock < 10) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
          Low Stock ({stock})
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
          In Stock ({stock})
        </span>
      );
    }
  };

  const getCategoryBadge = (category: ProductCategory) => {
    const colors = {
      [ProductCategory.SUPPLEMENTS]: "bg-purple-100 text-purple-600",
      [ProductCategory.CLOTHING]: "bg-pink-100 text-pink-600",
      [ProductCategory.EQUIPMENT]: "bg-blue-100 text-blue-600",
      [ProductCategory.ACCESSORIES]: "bg-yellow-100 text-yellow-600",
      [ProductCategory.PROTEIN_BARS]: "bg-green-100 text-green-600",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  if (loading === statusRequest.LOADING) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <div className=" mx-auto space-y-8">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardArray.map((card, i) => (
            <StatsCard
              key={i}
              title={card.title}
              value={card.value}
              icon={card.icon}
              bgColor={card.bgColor}
              gradient={card.gradient}
              description={card.description}
            />
          ))}
        </motion.div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products List
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                  {filteredProducts.length} products
                </span>
              </h2>

              <div className="flex gap-3 w-full md:w-auto flex-wrap">
                {/* Search */}
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, SKU, or brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer pr-10"
                  >
                    <option value="all">All Categories</option>
                    {Object.values(ProductCategory).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Stock Filter */}
                <div className="relative">
                  <select
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer pr-10"
                  >
                    <option value="all">All Stock</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock (&lt;10)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {search
                    ? "Try adjusting your search criteria"
                    : "Add your first product to get started"}
                </p>
                <Button
                  iconAfterLoading
                  titleAfterLoading=""
                  onClick={handleAddProduct}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Image
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        SKU
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <FramerMotion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            {product.imageUrl ? (
                              <Image
                                src={`https://gymifyback.onrender.com${product.imageUrl}`}
                                alt={product.name}
                                width={48}
                                unoptimized={true}
                                height={48}
                                className="w-auto h-auto object-cover "
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.brand}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono text-gray-600">
                            {product.sku}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(product.category)}`}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            {product.discountPrice ? (
                              <>
                                <span className="font-bold text-purple-600">
                                  ${product.discountPrice}
                                </span>
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  ${product.price}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-gray-800">
                                ${product.price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStockBadge(product.stock)}
                        </td>
                        <td className="py-3 px-4">
                          {product.isFeatured && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(product.id!)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(product.id!)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </FramerMotion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
