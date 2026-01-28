import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiInstance, apiInstanceFetch } from "../../../components/utils/api";

const initialState = {
    product: [],
    isLoading: false,
    isSkeleton: false,
    subCategoryProducts: [],
    // Products returned from filter-wise API (price range, etc.)
    filteredProducts: [],
};
export const suggetionSend = createAsyncThunk(
    "admin/article/get",
    async (payload) => {
        return apiInstance.post(`admin/article/get`, payload);
    }
);

export const subcategoryProducts = createAsyncThunk(
    "client/subCategory/getSubCategoryWiseProducts",
    async (payload) => {
        return apiInstance.get(
            `client/subCategory/getSubCategoryWiseProducts?uniqueName=${payload}`
        );
    }
);

export const getFilter = createAsyncThunk(
    "client/subfeature/getAllFilterSubfeatures",
    async (payload) => {
        return apiInstance.get(
            `client/subfeature/getAllFilterSubfeatures?uniqueName=${payload}`
        );
    }
);

export const getSubCategoryWiseProducts = createAsyncThunk(
    "subCategory/getSubCategoryWiseProducts",
    async (payload) => {
        return apiInstance.get(
            `client/subCategory/getSubCategoryWiseProducts?uniqueName=${payload}`
        );
    }
);

// Filter-wise products (price + subfeature filters)
export const getFilterWiseProducts = createAsyncThunk(
    "client/product/filterWiseProducts",
    async (payload) => {
        // API in Postman example is GET with JSON body; axios doesn't send body with GET,
        // so we use POST here to send the same JSON payload.
        return apiInstance.get(`client/product/filterWiseProducts`, payload);
    }
);

const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // blogGet
        builder.addCase(suggetionSend.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(suggetionSend.fulfilled, (state, action) => {
            state.isSkeleton = false;
        });
        builder.addCase(suggetionSend.rejected, (state, action) => {
            state.isSkeleton = false;
        });

        // blogGet
        builder.addCase(subcategoryProducts.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(subcategoryProducts.fulfilled, (state, action) => {
            state.subCategoryProducts = action.payload.data;
            state.isSkeleton = false;
        });
        builder.addCase(subcategoryProducts.rejected, (state, action) => {
            state.isSkeleton = false;
        });

        builder.addCase(getFilter.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(getFilter.fulfilled, (state, action) => {
            state.isSkeleton = false;
            state.company = action.payload.productCompanies;
            state.priceRange = action.payload.priceRange;
            state.filterSubfeatures = action.payload.filterSubfeatures;
        });
        builder.addCase(getFilter.rejected, (state, action) => {
            state.isSkeleton = false;
        });

        builder.addCase(
            getSubCategoryWiseProducts.fulfilled,
            (state, action) => {
                state.subCategoryProducts = action.payload.data;
                // Reset any previous filtered list when base list changes
                state.filteredProducts = [];
            }
        );

        builder.addCase(getFilterWiseProducts.pending, (state) => {
            state.isSkeleton = true;
        });
        builder.addCase(getFilterWiseProducts.fulfilled, (state, action) => {
            state.isSkeleton = false;
            // Store filtered products separately so UI can decide what to show
            state.filteredProducts = action.payload?.data || [];
        });
        builder.addCase(getFilterWiseProducts.rejected, (state) => {
            state.isSkeleton = false;
        });
    },
});

export default productSlice.reducer;
