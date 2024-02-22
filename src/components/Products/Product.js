import React from 'react'

export default function Product({ id, product, price, brand}) {
  return (
    <div className="py-4 rounded shadow-md w-60 sm:w-80 dark:bg-gray-900">
        <div className="flex p-4 space-x-4 sm:px-8">
            <div className="flex-1 py-2 space-y-4">
                <div className="w-full rounded ">ID: {id}</div>
                <div className="w-5/6 rounded">Name: {product}</div>
            </div>
        </div>
        <div className="p-4 space-y-4 sm:px-8">
            <div className="w-full h-4 rounded">Price: {price}</div>
            <div className="w-3/4 h-4 rounded ">Brand: {brand || '-'}</div>
        </div>
    </div>
  )
}
