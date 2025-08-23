// store/Reducers/AuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

// Define the AuthState interface
interface AuthState {
    isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
    isAuthenticated: false,
};

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
        },
        hydrateAuth: (state, action: PayloadAction<AuthState>) => {
            // Handle state hydration directly
            state.isAuthenticated = action.payload.isAuthenticated;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action) => action.type === HYDRATE,
            (state, action) => {
                // Manually handle the HYDRATE action
                if (action.payload.auth) {
                    state.isAuthenticated = action.payload.auth.isAuthenticated;
                }
            }
        );
    },
});

// Export actions and reducer
export const { login, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
