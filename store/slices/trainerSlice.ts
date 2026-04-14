import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Trainer, TrainerState } from "../types/trainer.types";
import { trainerApi } from "../services/trainerApi";
import { statusRequest } from "@/common/enums";

const initialState: TrainerState = {
  trainers: [],
  status: statusRequest.IDLE,
  statusFetchTrainer: statusRequest.IDLE,
  currentTrainer: null,
  statusAddTrainer: statusRequest.IDLE,
  titlePage: {
    title: "Trainers Management",
    description: "Manage all gym trainers",
  },
};

export const fetchTrainers = createAsyncThunk<
  Trainer[],
  void,
  { rejectValue: string }
>("trainers/fetchTrainers", async (_, { rejectWithValue }) => {
  try {
    const response = await trainerApi.getAll();
    console.log(response, "res");

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في جلب المدربين",
    );
  }
});

export const fetchTrainer = createAsyncThunk<
  Trainer,
  number,
  { rejectValue: string }
>("trainers/fetchTrainer", async (trainerId, { rejectWithValue }) => {
  try {
    const response = await trainerApi.getById(trainerId);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في جلب بيانات المدرب",
    );
  }
});

export const addTrainer = createAsyncThunk<
  Trainer,
  FormData,
  { rejectValue: string }
>("trainers/addTrainer", async (trainerData, { rejectWithValue }) => {
  try {
    const response = await trainerApi.create(trainerData);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في إضافة المدرب",
    );
  }
});

export const updateTrainer = createAsyncThunk<
  Trainer,
  { id: number; data: FormData },
  { rejectValue: string }
>("trainers/updateTrainer", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await trainerApi.update(id, data);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في تحديث بيانات المدرب",
    );
  }
});

export const deleteTrainer = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("trainers/deleteTrainer", async (id, { rejectWithValue }) => {
  try {
    await trainerApi.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "فشل في حذف المدرب",
    );
  }
});

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    resetAddTrainerStatus: (state) => {
      state.statusAddTrainer = statusRequest.IDLE;
    },
    resetUpdateTrainerStatus: (state) => {
      state.status = statusRequest.IDLE;
    },
    clearCurrentTrainer: (state) => {
      state.currentTrainer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.status = statusRequest.LOADING;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.trainers = action.payload;
        state.status = statusRequest.SUCCEEDED;
      })
      .addCase(fetchTrainers.rejected, (state) => {
        state.status = statusRequest.FAILED;
      });

    // fetchTrainer
    builder
      .addCase(fetchTrainer.pending, (state) => {
        state.statusFetchTrainer = statusRequest.LOADING;
      })
      .addCase(fetchTrainer.fulfilled, (state, action) => {
        state.currentTrainer = action.payload;
        state.statusFetchTrainer = statusRequest.SUCCEEDED;
      })
      .addCase(fetchTrainer.rejected, (state) => {
        state.statusFetchTrainer = statusRequest.FAILED;
      });

    builder
      .addCase(addTrainer.pending, (state) => {
        state.statusAddTrainer = statusRequest.LOADING;
      })
      .addCase(addTrainer.fulfilled, (state, action) => {
        state.trainers.push(action.payload);
        state.statusAddTrainer = statusRequest.SUCCEEDED;
      })
      .addCase(addTrainer.rejected, (state) => {
        state.statusAddTrainer = statusRequest.FAILED;
      });

    builder
      .addCase(updateTrainer.pending, (state) => {
        state.status = statusRequest.LOADING;
      })
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex(
          (trainer) => trainer.trainerData.id === action.payload.trainerData.id,
        );
        if (index !== -1) {
          state.trainers[index] = action.payload;
        }
        if (
          state.currentTrainer?.trainerData.id === action.payload.trainerData.id
        ) {
          state.currentTrainer = action.payload;
        }
        state.status = statusRequest.SUCCEEDED;
      })
      .addCase(updateTrainer.rejected, (state) => {
        state.status = statusRequest.FAILED;
      });

    builder
      .addCase(deleteTrainer.pending, (state) => {
        state.status = statusRequest.LOADING;
      })
      .addCase(deleteTrainer.fulfilled, (state, action) => {
        state.trainers = state.trainers.filter(
          (trainer) => trainer.trainerData.id !== action.payload,
        );
        state.status = statusRequest.SUCCEEDED;
      })
      .addCase(deleteTrainer.rejected, (state) => {
        state.status = statusRequest.FAILED;
      });
  },
});

export const {
  resetAddTrainerStatus,
  resetUpdateTrainerStatus,
  clearCurrentTrainer,
} = trainerSlice.actions;

export const selectAllTrainers = (state: { trainer: TrainerState }) =>
  state.trainer.trainers;
export const selectCurrentTrainer = (state: { trainer: TrainerState }) =>
  state.trainer.currentTrainer;
export const statusAllTrainers = (state: { trainer: TrainerState }) =>
  state.trainer.status;
export const statusFetchTrainer = (state: { trainer: TrainerState }) =>
  state.trainer.statusFetchTrainer;
export const statusAddTrainer = (state: { trainer: TrainerState }) =>
  state.trainer.statusAddTrainer;
export const selectTrainerTitlePage = (state: { trainer: TrainerState }) =>
  state.trainer.titlePage;

export default trainerSlice.reducer;
