import { ICategoryTypes, IProductTypes, IUser } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  users: IUser[];
  products: IProductTypes[];
  categories: ICategoryTypes[];
  loading: boolean;
  error: string | null;
  userDetail: IUser | null
}

// Initial state
const initialState: DashboardState = {
  users: [],
  products: [],
  userDetail:{} as IUser,
  categories: [],
  loading: false,
  error: null,
};

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboardData/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/dashboard-data"); // Replace with your API endpoint
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const dashboardDataSlice = createSlice({
  name: "dashboardData",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload;
    },
    setProducts(state, action: PayloadAction<IProductTypes[]>) {
      state.products = action.payload;
    },
    setAUserDetail(state, action: PayloadAction<IUser>) {
      state.userDetail = action.payload;
    },
    setCategories(state, action: PayloadAction<ICategoryTypes[]>) {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        const { users, products, categories } = action.payload;
        state.users = users || [];
        state.products = products || [];
        state.categories = categories || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setUsers, setProducts, setCategories, setAUserDetail } = dashboardDataSlice.actions;
export default dashboardDataSlice.reducer;
