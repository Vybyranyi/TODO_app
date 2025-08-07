import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000';

const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// GET /tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: getAuthHeaders(getState),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || 'Failed to fetch tasks');
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// POST /task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`${API_URL}/task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || 'Failed to create task');
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// PUT /task/:id
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/task/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(getState),
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || 'Failed to update task');
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// DELETE /task/:id
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/task/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || 'Failed to delete task');
      }

      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // CREATE
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // DELETE
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;