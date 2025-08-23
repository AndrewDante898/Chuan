import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchFormState {
    isExpanded: boolean;
}

const initialState: SearchFormState = {
    isExpanded: false,
};

const searchFormSlice = createSlice({
    name: 'searchForm',
    initialState,
    reducers: {
        toggleSearchForm(state) {
            state.isExpanded = !state.isExpanded;
        },
    },
});

export const { toggleSearchForm } = searchFormSlice.actions;
export default searchFormSlice.reducer;
