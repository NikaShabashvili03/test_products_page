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
  'brand',
  'price',
]

const App = () => {
  const [filterType, setFilterType] = useState(types[0])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [disabled, setDisabled] = useState(false);

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

  const filterProducts = async (field, value) => {
    try {
      await axios.post(
        API_URL,
        {
          action: 'filter',
          params: { [field] : value },
        },
        generateAuthHeader()
      ).then((response) => {
        setFilteredProducts([]);
        fetchProductDetails(response.data.result);
      })
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        API_URL,
        { action: 'get_ids', params: { offset: 0, limit: 50 } },
        generateAuthHeader(),
      );

      const uniqueIds = Array.from(new Set(response.data.result));
      setFilteredProducts([])
      fetchProductDetails(uniqueIds);
      setTotalPages(Math.ceil(filteredProducts.length / 50));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProductDetails = async (ids) => {
    ids?.map(async (id) => {
      try {
        await axios.post(
          API_URL,
          {
            action: 'get_items',
            params: { ids: [id] },
          },
          generateAuthHeader(),
        ).then((response) => {
          response.data.result[0] && setFilteredProducts((prev) => [...prev, response.data.result[0]]);
        });

      } catch (error) {
        console.error(`Error fetching product details for ID ${id}:`, error);
      }
    });

  };

  useEffect(() => {
    fetchFields(filterType).then(setFields);
  }, [filterType]);

  const handleFilter = async () => {
    if (selectedField && filterType) {
      filterProducts(filterType, selectedField);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  return (
    <div>
      <h1>Product List</h1>

      <div>
        <label>Select Field:</label>
        <select
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
      </div>
      <div>
        <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
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
      <button onClick={handleFilter}>Filter</button>
      <button onClick={fetchData}>Reset</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts?.map((product, i) => (
            <tr key={product?.id}>
              <td>{i}</td>
              <td>{product?.id}</td>
              <td>{product?.product}</td>
              <td>{product?.price}</td>
              <td>{product?.brand || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next Page
        </button>
      </div>
    </div>
  );
};


export default App