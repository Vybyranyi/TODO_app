import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000';

const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const fetchAdminData = createAsyncThunk(
  'admin/fetchAdminData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, {
        headers: getAuthHeaders(getState),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || 'Failed to fetch admin data');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/admin/user/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || 'Failed to delete user');
      }
      
      return userId;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.payload;
        state.users = state.users.filter(user => user.id !== deletedUserId);
        state.tasks = state.tasks.filter(task => task.userId !== deletedUserId);
      });
  },
});

export default adminSlice.reducer;