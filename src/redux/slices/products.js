import axios from '../../libs/axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ filter, type, value, limit }) => {
    if(filter){
        const data = await axios.post('/', { action: 'filter', params: { [type]: value  } }).then(async (res) => {
            const uniqueIds = Array.from(new Set(res.data.result));
            const { data } =  await axios.post('/', { action: 'get_items', params: { ids: uniqueIds } });
    
            return {
                items: Array.from({ length: Math.ceil(uniqueIds.length / 50) }, (_, index) => {
                    const start = index * 50;
                    return data.result.slice(start, start + 50);
                }),
                maxPage: Math.ceil(uniqueIds.length / 50)
            }
        });
        return data
    }
    else{
        const data = await axios.post('/', { action: 'get_ids', params: { offset: 0, limit: limit } }).then(async (res) => {
            const uniqueIds = Array.from(new Set(res.data.result));
            const { data } =  await axios.post('/', { action: 'get_items', params: { ids: uniqueIds } });
    
            return {
                items: Array.from({ length: Math.ceil(uniqueIds.length / 50) }, (_, index) => {
                    const start = index * 50;
                    return data.result.slice(start, start + 50);
                }),
                maxPage: Math.ceil(uniqueIds.length / 50)
            }
        });
        return data
    }
})

const initialState = {
    products: {
        items: [],
        maxPage: 0,
        status: 'loading',
    }
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.products.items = action.payload.items;
            state.products.maxPage = action.payload.maxPage;
            state.products.status = 'loaded';
        });
    }
})

export const productsReducer = productsSlice.reducer