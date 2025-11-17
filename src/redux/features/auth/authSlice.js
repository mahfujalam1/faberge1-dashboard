import { createSlice } from "@reduxjs/toolkit";

// localStorage থেকে token পড়ার function
const getTokenFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? token : null;
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
    return null;
  }
};

// localStorage থেকে user পড়ার function
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

// Initial state localStorage থেকে load করা হচ্ছে
const initialState = {
  token: getTokenFromStorage(),
  // user: getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedUser(state, action) {
      state.token = action.payload.token;
      // state.user = action.payload.user;

      // localStorage এ save করা
      localStorage.setItem("token", action.payload.token);
      // localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    updateUser(state, action) {
      state.user = action.payload.user;

      // localStorage update করা
      // localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logoutUser(state) {
      state.token = null;
      // state.user = null;

      // localStorage থেকে remove করা
      localStorage.removeItem("token");
      // localStorage.removeItem("user");
    },
  },
});

export const { loggedUser, updateUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
