import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    username: string;
    avatarUrl?: string;
    isOnline?: boolean;
    isCreator?: boolean;
    coins?: number;
  };
  token: string | null;
  coinsHidden: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  token: null,
  coinsHidden: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // --- DEBUG LOG ---
      console.log("[Redux Login] Payload received:", action.payload);
      // --- END DEBUG LOG ---

      state.isAuthenticated = true;
      state.user = {
        ...action.payload.user,
        avatarUrl: action.payload.user?.avatarUrl,
        isOnline: action.payload.user?.isOnline ?? false,
        isCreator: action.payload.user?.isCreator ?? false,
        coins: action.payload.user?.coins ?? 0,
      };
      state.token = action.payload.token;

      // --- DEBUG LOG ---
      console.log(
        "[Redux Login] State after update:",
        JSON.parse(JSON.stringify(state))
      ); // Use stringify/parse for cleaner object logging
      // --- END DEBUG LOG ---
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    updateCoins: (state, action) => {
      if (state.user) {
        state.user.coins = action.payload;
      }
    },
    addCoins: (state, action) => {
      if (state.user) {
        state.user.coins = (state.user.coins || 0) + action.payload;
      }
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatarUrl = action.payload;
      }
    },
    toggleCoinsVisibility: (state) => {
      state.coinsHidden = !state.coinsHidden;
    },
  },
});

export const {
  login,
  logout,
  updateCoins,
  addCoins,
  updateAvatar,
  toggleCoinsVisibility,
} = userSlice.actions;
export default userSlice.reducer;
