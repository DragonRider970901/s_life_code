import { getSets } from '../api';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sets: [],
    isLoading: false,
    error: false
};

const setsSlice = createSlice({
    name: 'sets',
    initialState,
    reducers: {
        setSets(state, action) {
            state.sets = action.payload;
        },
        startGetSets(state) {
            state.isLoading = true;
            state.error = false;
        },
        getSetsSuccess(state) {
            state.isLoading = false;
            state.error = false;
        },
        getSetsFailed(state) {
            state.isLoading = false;
            state.error = true;
        }
    }
});

export const {
    setSets,
    startGetSets,
    getSetsSuccess,
    getSetsFailed
} = setsSlice.actions;

export default setsSlice.reducer;

export const fetchSets = () => async (dispatch) => {
    try {
        dispatch(startGetSets());
        const sets = await getSets();
        dispatch(setSets(sets.sets));
        dispatch(getSetsSuccess());
    } catch(error) {
        dispatch(getSetsFailed());
    }
}

export const selectSets = (state) => state.sets.sets;
