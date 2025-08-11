import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Sunucudan mevcut kullanıcıyı çek (sayfa yenilenince çalışır)

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/current-user",
        {
          withCredentials: true,
        }
      );
      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue("Giriş yapılmamış");
    }
  }
);

const initialState = {
  user: null,
  isLoading: true, // İlk başta true, kontrol yapılana kadar ProtectedRoute bekleyecek
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Logout durumunda user sıfırlanır
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
