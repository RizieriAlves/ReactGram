import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import photoReducer from "./slices/photoSlice";
//Neste local todos os contextos serão salvos
export const store = configureStore({
  reducer: { auth: authReducer, user: userReducer, photo: photoReducer },
});
