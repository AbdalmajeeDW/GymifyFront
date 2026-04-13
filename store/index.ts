import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./slices/playerSlice";
import trainerReducer from "./slices/trainerSlice";
import productReducer from "./slices/productsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    player: playerReducer,
    trainer: trainerReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
