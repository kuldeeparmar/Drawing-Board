import { MENU_ITEMS,COLORS } from "@/constant";
import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { socket } from "@/socket";

const initialState = {
    [MENU_ITEMS.PENCIL] : {
        color: COLORS.BLACK,
        size: 3
    },
    [MENU_ITEMS.ERASER]: {
        color: COLORS.WHITE,
        size:3
    },
    [MENU_ITEMS.UNDO]:{},
    [MENU_ITEMS.REDO]:{},
    [MENU_ITEMS.DOWNLOAD]:{}
}

const toolboxSlice = createSlice({
    name:'toolbox',
    initialState,
    reducers: {
        changeColor: (state,action) => {
            state[action.payload.item].color = action.payload.color;
        },
        changeSize: (state,action) => {
            state[action.payload.item].size = action.payload.size;
        }
    }
})

export const {changeColor,changeSize} = toolboxSlice.actions;

export default toolboxSlice.reducer;