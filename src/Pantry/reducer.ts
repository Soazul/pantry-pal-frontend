import { createSlice } from "@reduxjs/toolkit";

type PantryItem = {
    id: number;
    name: string;
    quantity: number;
    expiration_date: string;
    category: string;
    location?: string;
}
interface PantryState {
    pantryItems: PantryItem[];
}

const initialState: PantryState = {
    pantryItems: []
}

const pantryItemSlice = createSlice({
    name:"pantryItems",
    initialState,
    reducers: {
        setPantry: (state, action) => {
            state.pantryItems = action.payload;
        },
        addPantry: (state, {payload: pantryItem}) => {
            const newPantryItem = {
                id: pantryItem.id,
                name: pantryItem.name,
                quantity: pantryItem.quantity,
                unit: pantryItem.unit,
                expirationDate: pantryItem.expirationDate,
                category: pantryItem.category,
                location: pantryItem.location
            };
            state.pantryItems = [...state.pantryItems, newPantryItem] as any;
        },
        deletePantry: (state, {payload: pantryItemId}) => {
            state.pantryItems = state.pantryItems.filter((pantryItem: any) => pantryItem.id !== pantryItemId);
        },
        updatePantry: (state: any, {payload: pantryItem}) => {
            state.pantryItems = state.pantryItems.map((p: any) => p.id === pantryItem.id ? pantryItem : p);
        }
    }
})

export const {setPantry, addPantry, deletePantry, updatePantry} = pantryItemSlice.actions;
export default pantryItemSlice.reducer;