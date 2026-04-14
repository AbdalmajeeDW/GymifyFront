import { MembershipType, statusRequest, UserRole } from "@/common/enums";
import { AppUser, User } from "./user.types";

export interface playerProfile {
  id?: number;
  membershipType: MembershipType;
  year: number | null;
  weight: number | null;
  height: number | null;
  userId?: number;
  firstName?: string;
  trainerId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Player = User & {
  // type: "player";
  playerData: playerProfile;
};

export function isPlayer(user: AppUser): user is Player {
  return "playerData" in user;
}

export interface playerState {
  players: Player[];
  status: statusRequest;
  currentUser: Player | null;
  statusAddUser: statusRequest;
  statusFetchUser: statusRequest;
  titlePage: {
    title: string;
    description: string;
  };
}
