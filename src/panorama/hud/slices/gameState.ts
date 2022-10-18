import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { csRequest } from "../communication";
import { decodeFromJson } from "../utils";

export enum GamePhases {
    preGame = 0,
    pick,
    game
}

const initialState = {
    phase: GamePhases.preGame,
    board: 1,
    distribution: []
} as CustomGameState;

export const nextPhase = createAsyncThunk("gameState/nextPhase", async () => {
    const response = await csRequest("nextPhase", {});
    return decodeFromJson(response);
});

export const previousPhase = createAsyncThunk("gameState/previousPhase", async () => {
    const response = await csRequest("previousPhase", {});
    return decodeFromJson(response);
});

export const gameState = createSlice({
    name: "gameState",
    initialState,
    reducers: {
        setPhaseLocally: (state, action) => {
            state.phase = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(nextPhase.fulfilled, (state, action) => {
            state.phase = action.payload.payload.state.phase;
        });
        builder.addCase(previousPhase.fulfilled, (state, action) => {
            state.phase = action.payload.payload.state.phase;
        });
    }
});

export const { setPhaseLocally } = gameState.actions;
export default gameState.reducer;
