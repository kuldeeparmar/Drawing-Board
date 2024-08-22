import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from '@/slice/menuSlice'
import ToolbarReducer from "@/slice/toolboxSlice";
export const store = configureStore({
    reducer: {
        menu:MenuReducer,
        toolbar:ToolbarReducer
    }
})