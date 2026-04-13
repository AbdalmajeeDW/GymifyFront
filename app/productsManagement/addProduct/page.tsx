"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SpinnerCustom from "../../../components/Loader/page";
import { IoImageOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusRequest } from "@/common/enums";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Toaster } from "../../../components/ui/sonner";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Tag,
  Box,
  Image as ImageIcon,
  Save,
  Plus,
  ShoppingBag,
  Weight,
  Ruler,
  Flame,
  Droplet,
  Scissors,
  Shirt,
  Zap,
} from "lucide-react";
import MotionCard from "@/components/Cards/MotionCard";
import {
  addProduct,
  resetAddProductStatus,
  selectAddProductStatus,
} from "@/store/slices/productsSlice";
import { ProductCategory } from "@/store/types/products.types";
import Image from "next/image";

interface ProductFormState {
  name: string;
  description: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  category: ProductCategory;
  brand: string;
  imageUrl: File | string | null;
  specifications: {
    flavor?: string;
    servings?: number;
    weight?: string;
    material?: string;
    size?: string;
    color?: string;
    proteinPerServing?: number;
    caloriesPerServing?: number;
  };
  isFeatured: boolean;
}

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addStatus = useAppSelector(selectAddProductStatus);

  const initialForm: ProductFormState = {
    name: "",
    description: "",
    sku: "",
    price: 0,
    discountPrice: null,
    stock: 0,
    category: ProductCategory.SUPPLEMENTS,
    brand: "",
    imageUrl: null,
    specifications: {
      material: "",
      size: "",
      color: "",
    },
    isFeatured: false,
  };

  const [forceValidate, setForceValidate] = useState({
    name: false,
    sku: false,
    price: false,
    stock: false,
    category: false,
    brand: false,
    imageUrl: false,
  });

  const isLoading = addStatus === statusRequest.LOADING;
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const submitModeRef = useRef<"exit" | "continue" | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSpecifications, setShowSpecifications] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("specifications.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setForm((prev) => ({
        ...prev,
        imageUrl: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (addStatus === statusRequest.SUCCEEDED) {
      toast.success("Product added successfully!", {
        position: "bottom-center",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
        },
      });

      setForm(initialForm);
      setPreviewImage(null);

      dispatch(resetAddProductStatus());
      if (submitModeRef.current === "exit") {
        router.push("/productsManagement/");
      }

      submitModeRef.current = null;
    } else if (addStatus === statusRequest.FAILED) {
      toast.error("Failed to add product. Please try again.", {
        position: "bottom-center",
      });

      dispatch(resetAddProductStatus());
    }
  }, [addStatus, dispatch, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      name: !form.name,
      sku: !form.sku,
      price: form.price <= 0,
      stock: form.stock < 0,
      category: !form.category,
      brand: !form.brand,
      imageUrl: !form.imageUrl,
    };

    setForceValidate(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("sku", form.sku);
    formData.append("price", form.price.toString());
    if (form.discountPrice) {
      formData.append("discountPrice", form.discountPrice.toString());
    }
    formData.append("stock", form.stock.toString());
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    formData.append("isFeatured", form.isFeatured.toString());

    if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl);
    }
    formData.append(
      "specifications",
      JSON.stringify({
        color: form.specifications.color,
        material: form.specifications.material,

        size: form.specifications.size,
      }),
    );

    dispatch(addProduct(formData));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // الحصول على أيقونة التصنيف
  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.SUPPLEMENTS:
        return <Droplet className="w-4 h-4" />;
      case ProductCategory.CLOTHING:
        return <Shirt className="w-4 h-4" />;
      case ProductCategory.EQUIPMENT:
        return <Weight className="w-4 h-4" />;
      case ProductCategory.ACCESSORIES:
        return <Scissors className="w-4 h-4" />;
      case ProductCategory.PROTEIN_BARS:
        return <Flame className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100  mx-auto   space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

        <Toaster />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto space-y-6"
        >
          <MotionCard>
            <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Product Name"
                  type="text"
                  name="name"
                  icon={<Package />}
                  value={form.name}
                  onChange={handleChange}
                  required
                  showError={forceValidate.name}
                  errorMessage={!form.name ? "Product name is required" : ""}
                />

                <FormInput
                  label="SKU (Stock Keeping Unit)"
                  type="text"
                  name="sku"
                  icon={<Tag />}
                  value={form.sku}
                  onChange={handleChange}
                  required
                  showError={forceValidate.sku}
                  errorMessage={!form.sku ? "SKU is required" : ""}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter product description..."
                  />
                </div>

                <FormInput
                  label="Brand"
                  type="text"
                  name="brand"
                  icon={<Shirt />}
                  value={form.brand}
                  onChange={handleChange}
                  required
                  showError={forceValidate.brand}
                  errorMessage={!form.brand ? "Brand is required" : ""}
                />

                <Field data-invalid className="space-y-2">
                  <FieldLabel
                    className={`text-sm font-medium ${
                      forceValidate.category ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    Category <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    value={form.category}
                    onValueChange={(value) => {
                      setForm((prev) => ({
                        ...prev,
                        category: value as ProductCategory,
                      }));
                      setForceValidate((prev) => ({
                        ...prev,
                        category: false,
                      }));
                    }}
                  >
                    <SelectTrigger
                      validate={forceValidate.category}
                      className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductCategory).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <span className="flex items-center gap-2">
                            {getCategoryIcon(cat)}
                            {cat}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    showError={forceValidate.category}
                    className="text-red-500 text-sm"
                  >
                    Category is required
                  </FieldError>
                </Field>
              </div>
            </div>
          </MotionCard>

          {/* Pricing & Stock Card */}
          <MotionCard>
            <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing & Stock
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Price (SAR)"
                  type="number"
                  name="price"
                  icon={<DollarSign />}
                  value={form.price.toString()}
                  onChange={handleNumberChange}
                  required
                  showError={forceValidate.price}
                  errorMessage={
                    form.price <= 0 ? "Price must be greater than 0" : ""
                  }
                />

                <FormInput
                  label="Discount Price (SAR)"
                  type="number"
                  name="discountPrice"
                  icon={<DollarSign />}
                  value={form.discountPrice?.toString() ?? ""}
                  onChange={handleNumberChange}
                  showError={false}
                  errorMessage=""
                />

                <FormInput
                  label="Stock Quantity"
                  type="number"
                  name="stock"
                  icon={<Box />}
                  value={form.stock.toString()}
                  onChange={handleNumberChange}
                  required
                  showError={forceValidate.stock}
                  errorMessage={
                    form.stock < 0 ? "Stock cannot be negative" : ""
                  }
                />
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Feature this product (show on homepage)
                  </span>
                </label>
              </div>
            </div>
          </MotionCard>

          {/* Specifications Card (Optional) */}
          <MotionCard>
            <div
              className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-4 cursor-pointer"
              onClick={() => setShowSpecifications(!showSpecifications)}
            >
              <h2 className="text-xl font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Specifications (Optional)
                </span>
                <span>{showSpecifications ? "▲" : "▼"}</span>
              </h2>
            </div>

            {showSpecifications && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {form.category === ProductCategory.SUPPLEMENTS && (
                    <>
                      <FormInput
                        label="Flavor"
                        type="text"
                        name="specifications.flavor"
                        icon={<Droplet />}
                        value={form.specifications.flavor ?? ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Servings"
                        type="number"
                        name="specifications.servings"
                        icon={<Box />}
                        value={form.specifications.servings?.toString() ?? ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Weight"
                        type="text"
                        name="specifications.weight"
                        icon={<Weight />}
                        value={form.specifications.weight ?? ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Protein Per Serving (g)"
                        type="number"
                        name="specifications.proteinPerServing"
                        icon={<Zap />}
                        value={
                          form.specifications.proteinPerServing?.toString() ??
                          ""
                        }
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Calories Per Serving"
                        type="number"
                        name="specifications.caloriesPerServing"
                        icon={<Flame />}
                        value={
                          form.specifications.caloriesPerServing?.toString() ??
                          ""
                        }
                        onChange={handleChange}
                      />
                    </>
                  )}

                  {form.category === ProductCategory.CLOTHING && (
                    <>
                      <FormInput
                        label="Material"
                        type="text"
                        name="specifications.material"
                        icon={<Shirt />}
                        value={form.specifications.material ?? ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Size"
                        type="text"
                        name="specifications.size"
                        icon={<Ruler />}
                        value={form.specifications.size ?? ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Color"
                        type="text"
                        name="specifications.color"
                        icon={<Droplet />}
                        value={form.specifications.color ?? ""}
                        onChange={handleChange}
                      />
                    </>
                  )}

                  {form.category === ProductCategory.EQUIPMENT && (
                    <>
                      <FormInput
                        label="Weight (kg)"
                        type="text"
                        name="specifications.weight"
                        icon={<Weight />}
                        value={form.specifications.weight ?? ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Material"
                        type="text"
                        name="specifications.material"
                        icon={<Shirt />}
                        value={form.specifications.material ?? ""}
                        onChange={handleChange}
                      />
                      {/* <FormInput
                        label="Dimensions"
                        type="text"
                        name="specifications.dimensions"
                        icon={<Ruler />}
                        value={form.specifications. ?? ""}
                        onChange={handleChange}
                      /> */}
                    </>
                  )}
                </div>
              </div>
            )}
          </MotionCard>

          {/* Product Image Card */}
          <MotionCard>
            <div className="bg-linear-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <IoImageOutline size={25} />
                Product Image
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center gap-6">
                {/* Image Preview */}
                {previewImage && (
                  <div className="relative w-40 h-40">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={48}
                      unoptimized={true}
                      height={48}
                      className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, imageUrl: null }));
                        setPreviewImage(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {forceValidate.imageUrl && !form.imageUrl && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      Product image is required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </MotionCard>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
            <Button
              className="bg-purple-600 p-5 hover:bg-purple-700 text-white rounded-xl shadow-md transition-all duration-300"
              type="submit"
              onClick={() => {
                submitModeRef.current = "exit";
              }}
              disabled={isLoading}
              isLoading={isLoading}
              iconIsLoading={<SpinnerCustom className="text-white size-4" />}
              titleAfterLoading="Save & Exit"
              titleIsLoading="Saving..."
              iconAfterLoading={<Save className="w-5 h-5" />}
            />
            <Button
              className="bg-purple-600 p-5 hover:bg-purple-700 text-white rounded-xl shadow-md transition-all duration-300"
              type="submit"
              onClick={() => {
                submitModeRef.current = "continue";
              }}
              disabled={isLoading}
              isLoading={isLoading}
              iconIsLoading={<SpinnerCustom className="text-white size-4" />}
              titleAfterLoading="Save & Add Another"
              titleIsLoading="Saving..."
              iconAfterLoading={<Plus className="w-5 h-5" />}
            />
          </div>
        </motion.div>
      </div>
    </form>
  );
}
