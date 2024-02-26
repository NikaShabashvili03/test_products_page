import axios from '../../libs/axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFields = createAsyncThunk('fields/fetchFields', async ({ field }) => {
    const { data } = await axios.post('/', { action: 'get_fields', params: { field: field } });

    return data.result.filter((item) => item !== null)
})

const initialState = {
    fields: {
        items: [],
        status: 'loading',
    }
}

const fieldsSlice = createSlice({
    name: 'fields',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchFields.pending, (state) => {
            state.fields.items = [];
            state.fields.status = 'loading';
        });
        builder.addCase(fetchFields.fulfilled, (state, action) => {
            state.fields.items = action.payload;
            state.fields.status = 'loaded';
        });
        builder.addCase(fetchFields.rejected, (state) => {
            state.fields.items = [];
            state.fields.status = 'error';
        })
    }
})

export const fieldsReducer = fieldsSlice.reducer