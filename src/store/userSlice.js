
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMe = createAsyncThunk('user/fetchMe', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('no token');
  const { data } = await axios.get('http://localhost:5000/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {
    clearUser(state) { state.data = null; state.status = 'idle'; state.error = null; },
    setUser(state, action) { state.data = action.payload; state.status = 'succeeded'; },
  },
  extraReducers: (b) => {
    b.addCase(fetchMe.pending,  (s)=>{s.status='loading';})
     .addCase(fetchMe.fulfilled,(s,a)=>{s.status='succeeded'; s.data=a.payload;})
     .addCase(fetchMe.rejected, (s,a)=>{s.status='failed'; s.data=null; s.error=a.payload || 'error';});
  }
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
