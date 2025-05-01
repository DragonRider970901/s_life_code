import { combineReducers, configureStore } from "@reduxjs/toolkit";
import setsReducer from './setsSlice';
import testReducer from './testSlice';

export default configureStore({
    reducer: combineReducers(
        {
            sets: setsReducer,
            test: testReducer,
        }
    )
})
