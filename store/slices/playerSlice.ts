import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Player, playerState } from "../types/player.types";
import { userApi } from "../services/playerApi";
import { statusRequest } from "@/common/enums";
import { User, UserState } from "../types/user.types";

const initialState: playerState = {
  players: [],
  status: statusRequest.IDLE,
  statusFetchUser: statusRequest.IDLE,
  currentUser: null,
  statusAddUser: statusRequest.IDLE,
  titlePage: {
    title: "Players Management",
    description: "Manage all gym players",
  },
};

export const fetchUsers = createAsyncThunk<any, void, { rejectValue: string }>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "فشل في جلب المستخدمين",
      );
    }
  },
);
export const addUser = createAsyncThunk<any, any, { rejectValue: string }>(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      console.log(userData);

      const response = await userApi.create(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "فشل في جلب المستخدمين",
      );
    }
  },
);
export const deleteUser = createAsyncThunk<any, any, { rejectValue: string }>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userApi.delete(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "faild delete user",
      );
    }
  },
);
export const fetchUser = createAsyncThunk<any, any, { rejectValue: string }>(
  "users/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.getById(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "فشل في جلب المستخدمين",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    resetAddUserStatus: (state) => {
      state.statusAddUser = statusRequest.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = state.players && statusRequest.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.players = action.payload;
        state.status = state.players && statusRequest.SUCCEEDED;
        console.log(state.players);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = state.players && statusRequest.FAILED;
      });
    builder
      .addCase(addUser.pending, (state) => {
        state.statusAddUser = statusRequest.LOADING;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.players.push(action.payload);
        state.statusAddUser = statusRequest.SUCCEEDED;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.statusAddUser = statusRequest.FAILED;
      });
    builder
      .addCase(fetchUser.pending, (state) => {
        state.statusFetchUser = statusRequest.LOADING;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.statusFetchUser = statusRequest.SUCCEEDED;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.statusFetchUser = statusRequest.FAILED;
      });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.statusFetchUser = statusRequest.LOADING;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.players = state.players.filter(
          (player) => player.id !== action.meta.arg,
        );

        state.statusFetchUser = statusRequest.SUCCEEDED;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.statusFetchUser = statusRequest.FAILED;
      });
  },
});

export const { selectUser } = userSlice.actions;
export const { resetAddUserStatus } = userSlice.actions;
export const selectAllUsers = (state: { player: playerState }) =>
  state.player.players;
export const selectedUser = (state: { user: UserState }) =>
  state.user.currentUser;
export const addOneUser = (state: { player: playerState }) =>
  state.player.players;
export const statusAllUsers = (state: { player: playerState }) =>
  state.player.status;
export const titlePage = (state: { player: playerState }) =>
  state.player.titlePage;
export const addUserStatusSelector = (state: { player: playerState }) =>
  state.player.statusAddUser;
export default userSlice.reducer;
