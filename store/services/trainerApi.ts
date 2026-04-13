import api from "../api";
import { API_ENDPOINTS } from "../endpoints";

export const trainerApi = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.TRAINER.GET_ALL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(API_ENDPOINTS.TRAINER.GET_BY_ID(id));
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post(API_ENDPOINTS.TRAINER.CREATE, formData);
    return response.data;
  },

  update: async (id: number, formData: FormData) => {
    const response = await api.patch(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },
};
