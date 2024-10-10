import React, { useState, useEffect, useRef } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from '../common/auth';
import Select from 'react-select';
import { PiDownloadFill } from "react-icons/pi";
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { BASE_URL, GET_PURCHASE_HEADER, GET_PURCHASE_DATA } from '../utlilities/config';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const customSelectStyles = {
  control: (base) => ({
    ...base,
    minHeight: '40px', // Decrease the height
    height: '40px',
    fontSize: '12px', // Optional: Decrease the font size
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0px 8px', // Adjust padding for better spacing
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: '30px',
  }),
  menu: (base) => ({
    ...base,
    fontSize: '12px', // Optional: Decrease the font size in the dropdown menu
  }),
};

const PurchaseReport = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [reportType, setReportType] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  // Ref for the date picker container
  const datePickerRef = useRef(null);

  useEffect(() => {
    getHeaderData();
    getPurchaseData(); // Initial API call with today's date

    // Event listener to detect clicks outside the date picker
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
  };

  const predefinedRanges = [
    { label: 'This Week', range: { startDate: addDays(new Date(), -7), endDate: new Date() } },
    { label: 'Last Week', range: { startDate: addDays(new Date(), -14), endDate: addDays(new Date(), -7) } },
    { label: 'This Month', range: { startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), endDate: new Date() } },
    { label: 'Last Month', range: { startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0) } },
    // Add more ranges as needed
  ];

  const getHeaderData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_PURCHASE_HEADER}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setItems(response.data.data.itemList);
        setSuppliers(response.data.data.supplierList);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getPurchaseData = async () => {
    setLoading(true);
    setBills([]); // Clear current list before making the API call

    try {
      const formatDate = (date) => {
        return date.toLocaleDateString('en-CA');
      };
    
      const data = {
        FromDate: range ? formatDate(range[0].startDate) : '',  
        ToDate: range ? formatDate(range[0].endDate) : '',
        SupplierID: reportType?.value === 'supplierwise' ? selectedCategory?.value : null,
        ItemNo: reportType?.value === 'itemwise' ? selectedCategory?.value : null,
        PageNo: 1,
        PageSize: 100,
      };

      const response = await axios.post(`${BASE_URL}${GET_PURCHASE_DATA}`, data, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setBills(response.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportTypeChange = (selectedOption) => {
    setReportType(selectedOption);
    setSelectedCategory(null); // Reset the selected category

    if (selectedOption.value === 'itemwise') {
      setCategoryOptions(items.map(item => ({ value: item.Item_No, label: item.Item_Name })));
    } else if (selectedOption.value === 'supplierwise') {
      setCategoryOptions(suppliers.map(supplier => ({ value: supplier.SupplierID, label: supplier.SupplierName })));
    } else {
      setCategoryOptions([]);
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const handleNavigate = (itemId, EditNo, Sequence) => {
    navigate('/purchasedetails', {
      state: { itemId, EditNo, Sequence }
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <LeftMenu isExpanded={isMenuExpanded} toggleMenu={toggleMenu} />
      {loading && (
        <div style={overlayStyles}>
          <FadeLoader
            color={"#123abc"}
            loading={loading}
            cssOverride={spinnerStyles}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-5">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search ..."
              className="border rounded-lg w-full h-10 px-4 placeholder:text-sm"
            />
            <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-white">
              <CiSettings size={19} color='black' />
            </div>
            <div className="p-3 rounded-full bg-white">
              <IoMdNotificationsOutline size={19} color='black' />
            </div>
            <div className="p-3 rounded-full bg-white">
              <FaRegCircleUser size={19} color='black' />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-3">
          <div className="relative">
            <p className='text-xl font-bold'>Purchase Report</p>
          </div>
        </div>

        <div className='w-full flex justify-between gap-5 p-3'>
          <div className="w-1/3 right-20" ref={datePickerRef}>
            <input
              type="text"
              readOnly
              value={range 
                ? `${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}` 
                : 'Choose Date Ranges'}
              onClick={() => setShowPicker(!showPicker)}
              className="border h-10 p-2 rounded w-full cursor-pointer"
            />

            {showPicker && (
              <div className="absolute bg-white border shadow-lg rounded mt-2 p-3 z-50">
                <div className="flex">
                  <div className="flex flex-col space-y-3 w-24">
                    {predefinedRanges.map((predefinedRange, index) => (
                      <button
                        key={index}
                        className="text-left px-1 py-1 rounded hover:bg-gray-200 text-xs"
                        onClick={() => {
                          setRange([{ ...predefinedRange.range, key: 'selection' }]);
                          setShowPicker(false);
                        }}
                      >
                        {predefinedRange.label}
                      </button>
                    ))}
                    <button
                      className="text-left px-1 py-1 rounded text-blue-600 hover:bg-gray-200 text-xs"
                      onClick={() => setRange([{ startDate: new Date(), endDate: new Date(), key: 'selection' }])}
                    >
                      Reset
                    </button>
                  </div>
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={range || [{ startDate: new Date(), endDate: new Date(), key: 'selection' }]}
                    months={1}
                    direction="horizontal"
                    className="rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <div className='flex gap-5 w-2/3 items-center content-center'>
            <div className='flex flex-row w-2/3 gap-3'>
              <Select
                placeholder="Report Type"
                options={[
                  { value: 'Billwise', label: 'Bill Wise' },
                  { value: 'itemwise', label: 'Item Wise' },
                  { value: 'supplierwise', label: 'Supplier Wise' }
                ]}
                className="w-full"
                styles={customSelectStyles}
                onChange={handleReportTypeChange}
              />
              <Select
                placeholder="Category"
                value={selectedCategory}
                options={categoryOptions}
                className="w-full"
                styles={customSelectStyles}
                onChange={handleCategoryChange}
                isDisabled={!reportType || categoryOptions.length === 0}
              />
            </div>
            <div className="relative w-42">
              <input
                type="text"
                placeholder="Search For Bill..."
                className="border rounded-lg w-full h-10 px-3 placeholder:text-xs"
              />
              <AiOutlineSearch size={15} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <span className="flex items-center justify-center w-9 h-9 bg-white rounded-md cursor-pointer">
              <PiDownloadFill size={16} color='black' />
            </span>
          </div>
        </div>

        <div className='flex justify-between gap-5 pr-5 w-full'>
            <button
                className={`w-28 py-1 ${!range || !selectedCategory ? 'bg-gray-400 cursor-not-allowed' : 'bg-btnblue cursor-pointer'} text-white border border-gray-200 rounded-xl ml-auto`}
                onClick={getPurchaseData}
                disabled={!range || !selectedCategory} // Disable the button if date range or category is not selected
            >
                Create
            </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar mt-4 mr-3 ml-3" style={{ height: 'calc(100%)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-gray-500 text-sm text-left">BILL NO</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">SUPPLIER</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">TOTAL</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">TAX</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">DISCOUNT</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">GRAND TOTAL</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">PAYMENT MODE</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((row, index) => (
                <tr key={index}>
                  <td className="border-b p-2 text-gray-500 text-md cursor-pointer" onClick={()=>handleNavigate(row.InvoiceNo, row.EditNo, row.Sequence)}>#{row.InvoiceNo}</td>
                  <td className="border-b p-2 text-sm">{row.SupplierName}</td>
                  <td className="border-b p-2 text-sm">{row.TotalAmount}</td>
                  <td className="border-b p-2 text-sm">0.00</td>
                  <td className="border-b p-2 text-sm">0.00</td>
                  <td className="border-b p-2 text-sm">{row.TotalAmount}</td>
                  <td className="border-b p-2 text-sm">
                    <span className="flex items-center text-xs">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          row.PaymentMode === 'debit'
                            ? 'bg-green-600'
                            : row.PaymentMode === 'credit'
                            ? 'bg-red-600'
                            : 'bg-yellow-600'
                        }`}
                      ></span>
                      <span
                        className={`${
                          row.PaymentMode === 'debit'
                            ? 'text-green-600'
                            : row.PaymentMode === 'credit'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {row.PaymentMode}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PurchaseReport);
