import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../libs/axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/products'
import ProductSkeleton from './Products/ProductSkeleton'
import Product from './Products/Product'
import { fetchFields } from '../redux/slices/fields'

export default function Products() {
  const { id } = useParams()
  const currentPage = parseInt(id)
  const navigate = useNavigate();
 
  const [filterValue, setFilterValue] = useState('');
  const [filterType, setFilterType] = useState('brand');

  const dispatch = useDispatch();

  const { products } = useSelector(state => state.products);
  const { fields } = useSelector(state => state.fields);
  
  const isProductLoading = products.status === 'loading';

  useEffect(() => {
    dispatch(fetchProducts({isFiltered: false, type: '', value: ''}))
  }, [])

  useEffect(() => {
    dispatch(fetchFields({field: 'brand'}));
  }, [])

  return (
    <div className='flex h-dvh flex-col gap-5'>
      <h2 className='text-center mt-5 text-4xl'>Filter By</h2>
      <div className='flex justify-around items-center mt-5'>
        <button className='px-12 rounded-full py-2 bg-gray-200' onClick={() => {
            dispatch(fetchFields({field: 'brand'}))
            setFilterType('brand')
            setFilterValue('');
        }}>Brand</button>
        <button className='px-12 rounded-full py-2 bg-gray-200' onClick={() => {
            dispatch(fetchFields({field: 'product'}));
            setFilterType('product')
            setFilterValue('');
        }}>Name</button>
        <button className='px-12 rounded-full py-2 bg-gray-200' onClick={() => {
            dispatch(fetchFields({field: 'price'}));
            setFilterType('price')
            setFilterValue('');
        }}>Price</button>
      </div>

      {/* Filter */}
      {fields?.status === 'loaded' && (
        <select onChange={(e) => {
            setFilterValue(e.target.value)
          }} value={filterValue}>
            <option>
                Select Brand
            </option>
            {fields?.items?.map((itm, i) => (
                <option key={i}>
                    {itm}
                </option>
            ))}
          </select>
      )}

        <div className='flex gap-5 justify-center items-center'>
            <button disabled={!filterType && !filterValue} onClick={() => {
                dispatch(fetchProducts({isFiltered: true, type: filterType, value: filterValue}))
            }} className='bg-gray-300 disabled:bg-gray-100 px-12 py-2 rounded-full mt-5'>Filter +</button>
            <button onClick={() => {
                dispatch(fetchProducts({isFiltered: false, type: '', value: ''}))
                setFilterType('brand');
                setFilterValue('');
            }} className='bg-gray-300 px-12 py-2 rounded-full mt-5'>Remove Filter</button>
        </div>
      {/* Pagination */}
      <div className='flex z-50 fixed justify-between items-center px-5 bottom-0 py-2 left-0 w-full gap-2'>
            <button className='px-5 py-2 bg-gray-800 text-white shadow-2xl rounded-full' onClick={() => navigate(`/page/${currentPage - 1}`)} disabled={currentPage === 0} >Prev</button>
            <span className='font-bold'>{id} / {products.maxPage}</span>
            <button className='px-5 py-2 bg-gray-800 text-white shadow-2xl rounded-full' onClick={() => navigate(`/page/${currentPage + 1}`)} disabled={currentPage === products.maxPage}>Next</button>
        </div>
      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2'>
        {!isProductLoading ? (
            products?.items[currentPage] ? (
                products?.items[currentPage]?.map((item, i) => 
                    <Product key={i} id={item.id} product={item.product} price={item.price} brand={item.brand}/>
                )):(
                    <div className='flex absolute w-full h-dvh font-bold text-4xl justify-center items-center'>
                        This page is empty
                    </div>
                )
        ) : (
            [Array.from({length: 50}).map((_, i) => <ProductSkeleton key={i}/>)]
        )}
      </div>
    </div>
  )
}
