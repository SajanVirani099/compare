import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiInstance, apiInstanceFetch } from "../../../components/utils/api";

const initialState = {
    blog: [],
    isLoading: false,
    isSkeleton: false,
};
export const blogGet = createAsyncThunk("admin/article/get", async () => {
    return apiInstance.get(`admin/article/get?start=1&limit=50`);
});

export const getSearchProducts = createAsyncThunk(
    "client/product/searchData",
    async (payload) => {
        return apiInstance.get(
            `client/product/searchData?searchString=${payload}`
        );
    }
);

export const getResultProduct = createAsyncThunk(
    "client/product/compareProduct",
    async (payload) => {
        return apiInstance.get(
            `client/product/compareProduct?uniqueTitle=${payload}`
        );
    }
);

export const getPopularComparison = createAsyncThunk(
    "client/subCategory/getPopularComparison",
    async (payload) => {
        return apiInstance.get(
            `client/subCategory/getPopularComparison?uniqueName=${payload}`
        );
    }
);

const blogSlice = createSlice({
    name: "blogSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // blogGet
        builder.addCase(blogGet.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(blogGet.fulfilled, (state, action) => {
            state.isSkeleton = false;
            state.blog = action.payload.data;
        });
        builder.addCase(blogGet.rejected, (state, action) => {
            state.isSkeleton = false;
        });

        builder.addCase(getSearchProducts.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(getSearchProducts.fulfilled, (state, action) => {
            state.isSkeleton = false;
            state.search = action.payload.data;
        });
        builder.addCase(getSearchProducts.rejected, (state, action) => {
            state.isSkeleton = false;
        });

        builder.addCase(getResultProduct.pending, (state, action) => {
            state.isSkeleton = true;
        });

        builder.addCase(getResultProduct.fulfilled, (state, action) => {
            state.isSkeleton = false;
            state.resultProduct = action.payload.data;
        });
        builder.addCase(getResultProduct.rejected, (state, action) => {
            state.isSkeleton = false;
        });

        builder.addCase(getPopularComparison.pending, (state, action) => {
            state.isSkeleton = true;
        });

        builder.addCase(getPopularComparison.fulfilled, (state, action) => {
            state.isSkeleton = false;
            state.popularComparison = action.payload.data;
        });

        builder.addCase(getPopularComparison.rejected, (state, action) => {
            state.isSkeleton = false;
        });
    },
});
export default blogSlice.reducer;
