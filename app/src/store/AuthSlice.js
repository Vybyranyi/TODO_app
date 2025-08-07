import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getInitialToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
};

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

const initialToken = getInitialToken();
const tokenValid = initialToken && !isTokenExpired(initialToken);

if (initialToken && !tokenValid) {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

const initialState = {
  token: initialToken,
  isAuth: tokenValid,
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle',
  error: null,
  loading: false,
};

export const UserRegister = createAsyncThunk(
  "auth/register",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); 
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user)); 
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const UserLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); 
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user)); 
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuth = false;
      state.token = '';
      state.user = null; 
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user'); 
      sessionStorage.removeItem('user'); 
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.user = action.payload.user; 
        state.error = null;
      })
      .addCase(UserRegister.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.error = action.payload;
      })
      .addCase(UserLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.user = action.payload.user; 
        state.error = null;
      })
      .addCase(UserLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = AuthSlice.actions;
export default AuthSlice.reducer;