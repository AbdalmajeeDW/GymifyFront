import api from "../api";
import { API_ENDPOINTS } from "../endpoints";

export const productsAPi = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, formData);
    return response.data;
  },
};
