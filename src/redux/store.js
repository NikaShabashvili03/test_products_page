import { configureStore } from '@reduxjs/toolkit'
import { productsReducer } from './slices/products';
import { fieldsReducer } from './slices/fields';

const store = configureStore({
    reducer: {
        products: productsReducer,
        fields: fieldsReducer,
    }
});

export default store;