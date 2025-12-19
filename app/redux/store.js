import { configureStore } from "@reduxjs/toolkit";
import categorySlice from './slice/categorySlice';
import blogSlice from './slice/blogSlice';
import settingSlice from './slice/settingSlice';
import productSlice from './slice/productSlice';
import glosarrySlice from './slice/glosarrySlice';

export const store = configureStore({
  reducer:{
    category:categorySlice,
    blog:blogSlice,
    setting:settingSlice,
    product:productSlice,
    glosarry:glosarrySlice,
  }
});
