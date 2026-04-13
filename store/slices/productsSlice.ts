// src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductState } from "../types/products.types";
import { productsAPi } from "../services/productsApi";
import { statusRequest } from "@/common/enums";

const initialState: ProductState = {
  products: [],
  status: statusRequest.IDLE,
  statusFetchProducts: statusRequest.IDLE,
  selectedProduct: null,
  statusAddProduct: statusRequest.IDLE,
  titlePage: {
    title: "Products Management",
    description: "Manage all gym products",
  },
};

// جلب جميع المنتجات
export const fetchProducts = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await productsAPi.getAll();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في جلب المنتجات",
    );
  }
});

export const addProduct = createAsyncThunk<any, any, { rejectValue: string }>(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsAPi.create(productData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "فشل في إضافة المنتج",
      );
    }
  },
);

export const fetchProduct = createAsyncThunk<any, any, { rejectValue: string }>(
  "products/fetchProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productsAPi.getById(productId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "فشل في جلب المنتج",
      );
    }
  },
);

// export const updateProduct = createAsyncThunk<
//   any,
//   { id: number; data: any },
//   { rejectValue: string }
// >("products/updateProduct", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const response = await productsAPi.update(id, data);
//     return response;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "فشل في تحديث المنتج",
//     );
//   }
// });

// export const deleteProduct = createAsyncThunk<
//   any,
//   number,
//   { rejectValue: string }
// >("products/deleteProduct", async (productId, { rejectWithValue }) => {
//   try {
//     const response = await productsAPi.delete(productId);
//     return response;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "فشل في حذف المنتج",
//     );
//   }
// });

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    resetAddProductStatus: (state) => {
      state.statusAddProduct = statusRequest.IDLE;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = statusRequest.LOADING;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = statusRequest.SUCCEEDED;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = statusRequest.FAILED;
      });

    // Add Product
    builder
      .addCase(addProduct.pending, (state) => {
        state.statusAddProduct = statusRequest.LOADING;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.statusAddProduct = statusRequest.SUCCEEDED;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.statusAddProduct = statusRequest.FAILED;
      });

    builder
      .addCase(fetchProduct.pending, (state) => {
        state.statusFetchProducts = statusRequest.LOADING;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.statusFetchProducts = statusRequest.SUCCEEDED;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.statusFetchProducts = statusRequest.FAILED;
      });

    // builder
    //   .addCase(updateProduct.pending, (state) => {
    //     state.status = statusRequest.LOADING;
    //   })
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     const index = state.products.findIndex(
    //       (p) => p.id === action.payload.id,
    //     );
    //     if (index !== -1) {
    //       state.products[index] = action.payload;
    //     }
    //     state.selectedProduct = action.payload;
    //     state.status = statusRequest.SUCCEEDED;
    //   })
    //   .addCase(updateProduct.rejected, (state, action) => {
    //     state.status = statusRequest.FAILED;
    //   });

    // Delete Product
    // builder
    //   .addCase(deleteProduct.pending, (state) => {
    //     state.status = statusRequest.LOADING;
    //   })
    //   .addCase(deleteProduct.fulfilled, (state, action) => {
    //     state.products = state.products.filter(
    //       (p) => p.id !== action.payload.id,
    //     );
    //     state.status = statusRequest.SUCCEEDED;
    //   })
    //   .addCase(deleteProduct.rejected, (state, action) => {
    //     state.status = statusRequest.FAILED;
    //   });
  },
});

export const { selectProduct, resetAddProductStatus, clearSelectedProduct } =
  productSlice.actions;

export const selectAllProducts = (state: { products: ProductState }) =>
  state.products.products;
export const selectSelectedProduct = (state: { products: ProductState }) =>
  state.products.selectedProduct;
export const selectProductsStatus = (state: { products: ProductState }) =>
  state.products.status;
export const selectFetchProductsStatus = (state: { products: ProductState }) =>
  state.products.statusFetchProducts;
export const selectAddProductStatus = (state: { products: ProductState }) =>
  state.products.statusAddProduct;
export const selectProductsTitlePage = (state: { products: ProductState }) =>
  state.products.titlePage;

export default productSlice.reducer;
