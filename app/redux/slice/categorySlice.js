import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "../../../components/utils/api";

const initialState = {
    category: [],
    nav: [],
    isLoading: false,
    isSkeleton: false,
    error: null,
};

export const categoryGet = createAsyncThunk(
    "admin/category/getCategory",
    async (payload) => {
        return apiInstance.get(
            `admin/category/getCategory?start=${payload.start}&limit=${payload?.limit}`
        );
    }
);

export const getCategoriesAndSubCategories = createAsyncThunk(
    "category/fetchCategoriesWithSubAndProd",
    async () => {
        return apiInstance.get("client/category/getCategories");
    }
);

const categorySlice = createSlice({
    name: "categorySlice",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategoriesAndSubCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCategoriesAndSubCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.category = action.payload.data;
                state.error = null;
            })
            .addCase(getCategoriesAndSubCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to fetch categories";
            });
    },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
