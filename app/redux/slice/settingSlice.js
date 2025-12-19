import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "../../../components/utils/api";

const initialState = {
    setting: {},
    isLoading: false,
    isSkeleton: false,
};
export const settingGet = createAsyncThunk(
    "admin/setting/getSetting",
    async () => {
        return apiInstance.get(`admin/setting/getSetting`);
    }
);

const settingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // settingGet
        builder.addCase(settingGet.pending, (state, action) => {
            state.isSkeleton = true;
        });
        builder.addCase(settingGet.fulfilled, (state, action) => {
            state.setting = action.payload.data;
            state.isSkeleton = false;
        });
        builder.addCase(settingGet.rejected, (state, action) => {
            state.isSkeleton = false;
        });
    },
});
export default settingSlice.reducer;
