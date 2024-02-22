import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Products from './components/Products'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to={'/page/0'}/>}></Route>
      <Route path='/page/:id' element={<Products/>}/>
    </Routes>
  )
}
