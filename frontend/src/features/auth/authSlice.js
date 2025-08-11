import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Sunucudan mevcut kullanıcıyı çek (sayfa yenilenince çalışır)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/current-user",
        {
          withCredentials: true,
        }
      );
      console.log("🎯 getCurrentUser response", res.data); // ← burayı ekle
      return res.data.user;
    } catch (error) {
      console.log("❌ getCurrentUser error", error.response?.data);
      return thunkAPI.rejectWithValue("Kullanıcı doğrulanamadı");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: undefined, // null → login yok, object → login var
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.user = undefined;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
