import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isAuthenticated: false,
    user: null,
    loading: true
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
        }
        ,
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
})

export const { loginSuccess, logout } = authSlice.actions;

// Export the reducer function to connect it to the store
export default authSlice.reducer;