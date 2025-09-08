import { getTypes } from "../api";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    types: [],
    isLoading: false,
    error: false
};

const typesSlice = createSlice({
    name: 'types',
    initialState,
    reducers: {
        setTypes(state, action) {
            state.types = action.payload;
        },
        startGetTypes(state) {
            state.isLoading = true;
            state.error = false;
        },
        getTypesSuccess(state) {
            state.isLoading = false;
            state.error = false;
        },
        getTypesFailed(state) {
            state.isLoading = false;
            state.error = true;
        }
    }
});

export const {
    setTypes,
    startGetTypes,
    getTypesSuccess,
    getTypesFailed
} = typesSlice.actions;

export default typesSlice.reducer;

export const fetchTypes = () => async (dispatch) => {
    try {
        dispatch(startGetTypes());
        const data = await getTypes();
        const list = Array.isArray(data) ? data : (data?.types ?? []);
        dispatch(setTypes(list));
        dispatch(getTypesSuccess());
    } catch(error) {
        dispatch(getTypesFailed());
    }
}

const selectTypes = (state) => state.types.types;