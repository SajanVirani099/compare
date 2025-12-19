import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiInstance, apiInstanceFetch } from "../../../components/utils/api";

const initialState = {
    glosarry: [],
    isLoading: false,
    isSkeleton: false,
};

export const getTitleWise = createAsyncThunk(
    "client/article/getGroupedArticles",
    async () => {
        return apiInstance.get(`client/article/getGroupedArticles`);
    }
);

const glosarrySlice = createSlice({
    name: "glosarrySlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // blogGet
        builder.addCase(getTitleWise.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(getTitleWise.fulfilled, (state, action) => {
            state.isSkeleton = false;
            state.glosarry = action.payload.data;
        });
        builder.addCase(getTitleWise.rejected, (state, action) => {
            state.isSkeleton = false;
        });
    },
});
export default glosarrySlice.reducer;
