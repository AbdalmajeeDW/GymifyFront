import api from "../api";
import { Player } from "../types/player.types";
import { ApiResponse } from "../types/api.types";
import { API_ENDPOINTS } from "../endpoints";
import { UserRole, MembershipType, gender } from "@/common/enums";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole | string;
  gender: gender | string;
  password: string;
  phone: number | any;
  profileImage: File;

  playerData: {
    membershipType: MembershipType | string;
    year: number | any;
    weight: number | any;
    height: number | any;
    firstName: string;
  };
}
class playerApi {
  async getAll(): Promise<ApiResponse<Player[]>> {
    const response = await api.get(API_ENDPOINTS.Players.GET_ALL);
    return response.data;
  }

  async getById(id: number): Promise<ApiResponse<Player>> {
    const response = await api.get(API_ENDPOINTS.Players.GET_BY_ID(id));
    return response.data;
  }

  async create(userData: CreateUserDto): Promise<ApiResponse<Player>> {
    const response = await api.post(API_ENDPOINTS.Players.CREATE, userData);
    return response.data;
  }

  async update(id: number): Promise<ApiResponse<Player>> {
    const response = await api.put(API_ENDPOINTS.Players.UPDATE(id));
    return response.data;
  }

  async partialUpdate(id: number): Promise<ApiResponse<Player>> {
    const response = await api.patch(API_ENDPOINTS.Players.UPDATE(id));
    return response.data;
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(API_ENDPOINTS.Players.DELETE(id));
    return response.data;
  }

  async search(query: string): Promise<ApiResponse<Player[]>> {
    const response = await api.get(API_ENDPOINTS.Players.SEARCH, {
      params: { q: query },
    });
    return response.data;
  }
}
export const userApi = new playerApi();
