import { statusRequest, UserRole } from "@/common/enums";
import { Player, playerProfile } from "./player.types";
import { Trainer, TrainerProfile } from "./trainer.types";

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
  // type: "player" | "trainer";
  createdAt?: Date;
  role: UserRole;
}
export type AppUser = Player | Trainer;

export interface UserState {
  users: User[];
  status: statusRequest;
  currentUser: AppUser | null;
  statusAddUser: statusRequest;
  statusFetchUser: statusRequest;
  titlePage: {
    title: string;
    description: string;
  };
}
