import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../libs/axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/products'
import Product from './Products/Product'
import ProductSkeleton from './Products/ProductSkeleton'
import { fetchFields } from '../redux/slices/fields'
import clsx from 'clsx'

export default function Products() {
  const { id } = useParams()
  const currentPage = parseInt(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterValue, setFilterValue] = useState(0)
  const [filterType, setFilterType] = useState('price');
  const [loading, setLoading] = useState(false);
  const { products } = useSelector(state => state.products);
  const { fields } = useSelector(state => state.fields);

  const isProductsLoading = products.status === 'loading';

  useEffect(() => {
     dispatch(fetchFields({ field: 'brand', limit: (currentPage+5)*50 }))
     if(!isFiltered){
      dispatch(fetchProducts({ filter: false, offset: 0, limit: (currentPage+5)*50 }))
     }
     else{
      dispatch(fetchProducts({ filter: true, type: filterType, value: filterValue, offset: 0, limit: (currentPage+5)*50 }))
     }
  }, [currentPage])

  return (
    <div className='flex h-dvh'>
      <div className='w-1/6 fixed flex flex-col justify-between items-center h-full bg-gray-100 border-r-2 left-0 top-0'>
        <div>
          <h2 className='text-center mt-2 text-3xl'>Filter</h2>
          <ul className='mt-5 gap-5 flex flex-col'>
            <li className='flex flex-col w-full px-5'>
              <button disabled={loading} onClick={() => {
                setFilterType('price')
                setFilterValue(0);
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              }} className='flex w-full justify-between'>
                <label className='text-xl mb-2'>Price</label>
                {filterType === 'price' ? '' : '>'}
              </button>
              {filterType === 'price' && (
                <div className='flex w-full border-t-2 border-black pt-2'>
                    <input type='number' value={filterValue} onChange={(e) => setFilterValue(
                        parseInt(e.target.value)
                    )} className='px-2 rounded-full border-black border w-full'/>
                </div>
              )}
            </li>
            <li className='flex flex-col w-full px-5'>
            <button disabled={loading} onClick={() => {
              setFilterType('product')
              setFilterValue('')
              setLoading(true)
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }} className='flex w-full justify-between'>
                <label className='text-xl mb-2'>Name</label>
                {filterType === 'product' ? '' : '>'}
              </button>
              {filterType === 'product' && (
                <div className='flex w-full border-t-2 border-black pt-2'>
                  <input value={filterValue} onChange={(e) => setFilterValue(
                        e.target.value
                    )} className='px-2 rounded-full border-black border w-full'/>
                </div>
              )}
            </li>
            <li className='flex flex-col w-full px-5'>
              <button disabled={loading} onClick={() => {
                setFilterType('brand')
                setFilterValue('');
                setLoading(true)
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              }} className='flex w-full justify-between'>
                <label className='text-xl mb-2'>Brands</label>
                {filterType === 'brand' ? '' : '>'}
              </button>
              
              {filterType === 'brand' && (
                <div className='flex w-full border-t-2 border-black pt-2  gap-5'>
                  <select value={filterValue} onChange={(e) => setFilterValue(
                        e.target.value
                    )} className='px-2 rounded-full border-black border w-full'>
                    <option>Select Brand</option>
                    {fields?.items?.map((field, i) =>
                      <option key={i}>{field}</option>
                    )}
                  </select>
                </div>
              )}
            </li>
          </ul>
        </div>
        <div className='mb-5 flex gap-5'>
          <button disabled={loading} className={clsx('border bg-white border-black rounded-full w-2/4 px-4 py-1',
            isFiltered && 'border-2'
          )} onClick={() => {
            setLoading(true)
            setIsFiltered(true);
            dispatch(fetchProducts({ filter: true, value: filterValue, type: filterType, offset: 0, limit: (currentPage+5)*50 }))
            navigate('/page/0')
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }}>Filter</button>
          <button disabled={loading} className='border bg-white border-black rounded-full w-2/4 px-4 py-1' onClick={() => {
            setIsFiltered(false);
            setLoading(true)
            setFilterType('price');
            setFilterValue(0);
            dispatch(fetchProducts({ filter: false, offset: 0, limit: (currentPage+5)*50 }))
            navigate('/page/0')
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }}>Remove</button>
        </div>
      </div>
      <div className='flex ml-[16.666667%]  h-full flex-col w-5/6 gap-5'>
        <div className='flex z-50 fixed justify-between items-center px-5 bottom-0 py-2 right-0 w-5/6 gap-2'>
              <button className='px-5 py-2 bg-gray-800 text-white shadow-2xl rounded-full' onClick={() => navigate(`/page/${currentPage - 1}`)} disabled={currentPage === 0} >Prev</button>
              <span className='font-bold'>{id} / {products?.maxPage}</span>
              <button className='px-5 py-2 bg-gray-800 text-white shadow-2xl rounded-full' onClick={() => navigate(`/page/${currentPage + 1}`)} disabled={currentPage >= products?.maxPage - 1}>Next</button>
        </div>
        <div className={clsx('grid grid-cols-2 relative md:grid-cols-3 xl:grid-cols-4 gap-2', products?.items?.length === 0 && 'h-dvh')}>
          {!isProductsLoading ? (
            products?.items?.length !== 0
            ? <>
                {products?.items?.[currentPage]?.map((item, i) => 
                    <Product key={i} id={item.id} product={item.product} price={item.price} brand={item.brand}/>
                )}
            </>
            : <h2 className='text-4xl font-bold absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]'>Empty</h2>
          ) : (
            [Array.from({length: 50}).map((_, i) => <ProductSkeleton key={i}/>)]
          )}
        </div>
      </div>
    </div>
  )
}
