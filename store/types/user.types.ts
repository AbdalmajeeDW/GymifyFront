import { statusRequest, UserRole } from "@/common/enums";
import { playerProfile } from "./player.types";
import { TrainerProfile } from "./trainer.types";

export interface User {
  id?: number;
  profileImage: File | any;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  updatedAt?: Date;
  isActive?: boolean;

  createdAt?: Date;
  role: UserRole;
  playerData: playerProfile;
}
export interface UserState {
  users: User[];
  status: statusRequest;
  currentUser: User | null;
  statusAddUser: statusRequest;
  statusFetchUser: statusRequest;
  titlePage: {
    title: string;
    description: string;
  };
}
