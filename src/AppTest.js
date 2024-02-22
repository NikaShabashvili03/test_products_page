import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5'

const API_URL = 'http://api.valantis.store:40000/';
const PASSWORD = "Valantis"

const generateAuthHeader = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const md5Hash = md5(`${PASSWORD}_${timestamp}`);

  return {
    headers: {
      'X-Auth': md5Hash,
    },
  };
};

const types = [
  'none',
  'brand',
  'price'
]

const TestApp = () => {
  const [filterType, setFilterType] = useState(types[0])

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFields = async (field) => {
    setDisabled(true)
    try {
      const response = await axios.post(
        API_URL,
        {
          action: 'get_fields',
          params: { field, offset: 0, limit: 10 }, // Adjust offset and limit as needed
        },
        generateAuthHeader()
      );
  
        setDisabled(false)
      return response.data.result;
    } catch (error) {
      console.error('Error fetching fields:', error);
      setDisabled(false)
      return [];
    }
  };

  // Fetch Products By Ids
  const fetchProductDetails = async (ids) => {
    setDisabled(true)
    await axios.post(
      API_URL,
      { action: 'get_items', params: { ids: ids } },
      generateAuthHeader()
    ).then((res) => {
      setDisabled(false)
      setProducts(res.data.result);
    }).catch((err) => {
      setDisabled(false)
      console.log(err)
    })
  }

  const fetchMaxTotalPage = async () => {
    await axios.post(
      API_URL,
      {action: 'get_ids'},
      generateAuthHeader()
    ).then((res) => {
      setTotalPages(Math.ceil(res.data.result.length / 50));
    })
  }

  // Fetch Products Ids With offset
  const fetchData = async (filterType) => {
    setDisabled(true)
    if(filterType === 'none'){      
      await axios.post(
        API_URL,
        { action: 'get_ids', params: { offset: 0, offset: currentPage*50, limit: 50 } },
        generateAuthHeader()
      ).then((res) => {
        setDisabled(false)
        const uniqueIds = Array.from(new Set(res.data.result));
        fetchProductDetails(uniqueIds);
      }).catch((err) => {
        setDisabled(false)
        console.log(err)
      })
    }
    else{
      await axios.post(
        API_URL,
        {
          action: 'filter',
          params: { [filterType] : selectedField },
        },
        generateAuthHeader()
      ).then((response) => {
        setDisabled(false)
        fetchProductDetails(response.data.result);
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  // Change Page with pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // First And Change current page render
  useEffect(() => {
    fetchData(filterType);
  }, [selectedField, currentPage])

  useEffect(() => {
    fetchFields(filterType).then(setFields);
  }, [filterType])

  
  useEffect(() => {
    fetchMaxTotalPage();
  }, [])
  return (
    <div className='flex flex-col'>
        {/* Filter */}

        <div className='w-full mt-5 mx-5 flex-col flex justify-start items-start'>
          <div>
            <label className='mr-2'>Select Field:</label>
            <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    setSelectedField('')
                  }}
                >
                  {types?.map((field) => {
                    return (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    )
                  })}
              </select>
          </div>
          {
            fields.length > 0 && (
              <select
                  className='mt-5'
                  value={selectedField}
                  disabled={disabled}
                  onChange={(e) => setSelectedField(e.target.value)}
                  >
                        <option value="">Select Field</option>
                        {fields.map((field) => {
                          if(field == null) return;
                          return (
                            <option key={field} value={field}>
                              {field}
                            </option>
                          )
                        })}
              </select>
            )
          }
        </div>

        {/* Pagination */}
        {!disabled && (
          <div className='w-full my-[50px] flex justify-center items-center'>
            <button className='border mx-2 disabled:opacity-50 w-[150px] py-1 rounded-2xl' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || disabled}>
              Previous Page
            </button>
            {filterType === 'none' && <span className='mx-5'>{`${currentPage}/${totalPages}`}</span>}
            <button className='border mx-2 disabled:opacity-50 w-[150px] py-1 rounded-2xl' onClick={() => handlePageChange(currentPage + 1)} disabled={disabled || totalPages === currentPage}>
              Next Page
            </button>
        </div>
        )}

        {/* Products */}
        {!disabled ? (
          <div className='grid grid-cols-4 mt-[100px] gap-5'>
            {products?.map((product, i) => {
              return (
                <ul className='w-full relative bg-gray-200 flex flex-col justify-between rounded-2xl shadow p-5 ' key={i}>
                  <li className='text-center'>
                    <h2 className='text-center font-bold'>Product</h2>
                    {product?.product}
                  </li>
                  <li className='text-center'>
                    <h2 className='text-center font-bold'>Price</h2>
                    {product?.price}$
                  </li>
                  <li className='text-center'>
                    <h2 className='text-center font-bold'>Brand</h2>
                    {product?.brand || '-'}
                  </li>
                </ul>
              )
            })}
          </div>
        ) : (
          <div className='w-full flex text-4xl justify-center items-center'>
            Loading...
          </div>
        )}
    </div>
  );
};


export default TestApp