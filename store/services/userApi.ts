import api from "../api";
import { User } from "../types/user.types";
import { ApiResponse } from "../types/api.types";
import { API_ENDPOINTS } from "../endpoints";
import { UserRole, MembershipType, gender } from "@/common/enums";

class playerApi {
  async getAll(): Promise<ApiResponse<User[]>> {
    const response = await api.get(API_ENDPOINTS.USERS.GET_ALL);
    return response.data;
  }

  async getById(id: number): Promise<ApiResponse<User>> {
    const response = await api.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
    return response.data;
  }

  async create(userData: User): Promise<ApiResponse<User>> {
    const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  }

  async update(id: number): Promise<ApiResponse<User>> {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id));
    return response.data;
  }

  async partialUpdate(id: number): Promise<ApiResponse<User>> {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE(id));
    return response.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  }

  async search(query: string): Promise<ApiResponse<User[]>> {
    const response = await api.get(API_ENDPOINTS.USERS.SEARCH, {
      params: { q: query },
    });
    return response.data;
  }
}
export const userApi = new playerApi();
