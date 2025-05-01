import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    d: {
        id: 'd',
        values: [0, 0, 0]
    },
    e: {
        id: 'e',
        values: [0, 0, 0]
    },
    h: {
        id: 'h',
        values: [0, 0, 0]
    },
    hy: {
        id: 'hy',
        values: [0, 0, 0]
    },
    k: {
        id: 'k',
        values: [0, 0, 0]
    },
    m: {
        id: 'm',
        values: [0, 0, 0]
    },
    p: {
        id: 'p',
        values: [0, 0, 0]
    },
    s: {
        id: 's',
        values: [0, 0, 0]
    },
    rez: {
        d: [0,0,0],
        e: [0,0,0],
        h: [0,0,0],
        hy: [0,0,0],
        k: [0,0,0],
        m: [0,0,0],
        p: [0,0,0],
        s: [0,0,0],
    }
}

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        addLiked(state, action) {
            const factor = action.payload;
            if (state[factor]) {
                state[factor].values[0]++;
            }
        },
        addDisliked(state, action) {
            const factor = action.payload;
            if (state[factor]) {
                state[factor].values[1]++;
            }
        },
        addLatent(state, action) {
            const factor = action.payload;
            if (state[factor]) {
                state[factor].values[2]++;
            }
        },
        addWarehouse(state, action) {
            const { factor, choice } = action.payload;

            if (state.rez[factor]) {
                if (choice === 0) {
                    state.rez[factor][0]+=1;
                }
                else if(choice === 1) {
                    state.rez[factor][1]+=1;
                }
                else if(choice === 2) {
                    state.rez[factor][2]+=1;
                }
            }
        }
    }
})

export const {
    addLiked,
    addDisliked,
    addLatent,
    addWarehouse
} = testSlice.actions;

export default testSlice.reducer;
