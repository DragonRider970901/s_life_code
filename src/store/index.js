import { combineReducers, configureStore } from "@reduxjs/toolkit";
import setsReducer from './setsSlice';
import testReducer from './testSlice';
import userReducer from './userSlice';
import typesReducer from './typesSlice';

export default configureStore({
    reducer: combineReducers(
        {
            sets: setsReducer,
            test: testReducer,
            user: userReducer,
            types: typesReducer
        }
    )
})
