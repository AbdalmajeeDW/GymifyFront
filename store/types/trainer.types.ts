// src/store/types/trainer.types.ts

import { statusRequest } from "@/common/enums";
import { AppUser, User } from "../types/user.types";
export interface TrainerProfile {
  specialization?: string;
  experienceYears?: number;
  certifications?: string;
  bio?: string;
  hourlyRate?: number;
  currentClients?: number;
  rating?: number;
  id?: number;
  updatedAt?: string;
  createdAt?: Date;
}

export type Trainer = User & {
  trainerData: TrainerProfile;
  trainer: TrainerProfile;
};

export function isTrainer(user: AppUser): user is Trainer {
  return "trainerData" in user;
}

export interface TrainerState {
  trainers: Trainer[];
  status: statusRequest;
  statusFetchTrainer: statusRequest;
  currentTrainer: Trainer | null;
  statusAddTrainer: statusRequest;
  titlePage: {
    title: string;
    description: string;
  };
}
