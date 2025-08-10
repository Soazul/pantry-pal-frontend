import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Login/reducer";
import pantryItemReducer from "./Pantry/reducer";
const store = configureStore({
    reducer: {
        accountReducer,
        pantryItems: pantryItemReducer,
    }
})
export default store;