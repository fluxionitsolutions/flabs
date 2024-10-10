import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { CiCreditCard2 } from "react-icons/ci";
import { BASE_URL, GET_BASE_DATA, POST_PURCHASE } from '../utlilities/config';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { TiPrinter } from "react-icons/ti";
import NewSupplierEntry from './NewSupplierEntry';
import NewItemEntry from './NewItemEntry'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';


function NewPurchaseEntry() {
 
  const [loading, setLoading] = useState(false);
  const [showModal1, setShowmodal1] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('accessToken');
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseRefNo, setPurchaseRefNo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([{ slno: "", name: "", batch: "", exp: "", qty: 0,packagesize:0,pkgunit:"", packing: 0, free: 0, rate: 0, amount: 0, mrp: 0, discount: 0, tax: 0.00 }]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [roundOff, setRoundOff] = useState(0);
  const [old_gtotal, setOldGtotal] = useState(0)


  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  
 
  const maxCharacters = 225;

  useEffect(() => {
    const handleKeyDown = (event) => {
     
      if (event.ctrlKey && event.key === 'i') {
        
       setShowModal(true)
      }else if (event.ctrlKey && event.key === 'z'){
        setShowmodal1(true)
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const [isChecked, setIsChecked] = useState(false);
  
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    if (checked) {
      const total = totals.grandTotal
      setOldGtotal(total)
      const new_total = roundAmount(total);
      setTotals({
        totalValue: totals.totalValue,
        totalTax: totals.totalTax,
        totalDiscount: totals.totalDiscount,
        grandTotal: new_total
      });
    } else{
      setTotals({
        totalValue: totals.totalValue,
        totalTax: totals.totalTax,
        totalDiscount: totals.totalDiscount,
        grandTotal: old_gtotal
      });
    }
  };


  const roundAmount=(total)=>{
    if ( (total - Math.floor(total) < 0.5)) {
     return Math.floor(total);
    } else {
      return Math.ceil(total)
    }
  }
  const [totals, setTotals] = useState({ totalValue: 0, totalTax: 0, totalDiscount: 0, grandTotal: 0 });

  useEffect(() => {
    getData();
  }, []);

  const handleClick = () => {

    setShowModal(true)
    getData();

  }
  const handleshow = () => {
    setShowmodal1(true)
    getData();
  }

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_BASE_DATA}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setItems(response.data.data.itemList);
        console.log(response.data.data.itemList);
        setSuppliers(response.data.data.supplierList);
        setInvoiceNumber(response.data.data.nextNum[0]?.NextNum);
      }

    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;

    if (field === 'packing' || field === 'qty' || field === 'rate') {
      const packing = parseFloat(updatedProducts[index].packing) || 0;
      const qty = parseFloat(updatedProducts[index].qty) || 0;
      const rate = parseFloat(updatedProducts[index].rate) || 0;
      updatedProducts[index].amount = (packing * qty * rate);
    }

    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const addProductRow = () => {
    setProducts([...products, { slno: "", name: "", batch: "", exp: "", qty: 0,packagesize: 0,pkgunit:"", packing: 0, free: 0, rate: 0, amount: 0, mrp: 0, discount: 0, tax: "" }]);
  };

  const removeProductRow = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const handleSave = async () => {
    if (!selectedSupplier || !invoiceNumber || !purchaseRefNo || !purchaseDate) {
      toast.error('Please Fill All Data !', {
          duration: 5000, // Duration in milliseconds
        });
      return;
    }
  
    const parseDecimal = (value) => parseFloat(parseFloat(value).toFixed(3));
  
    const convertExpiryDate = (expiry) => {
      const [month, year] = expiry.split('/').map(Number);
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      return `${year + 2000}-${String(month).padStart(2, '0')}-${day}`;
    };
  
    const purchaseHeader = {
      SupplierID: selectedSupplier.value,
      SupplierName: selectedSupplier.label,
      InvoiceDate: new Date().toISOString().split('T')[0],
      PurchaseRefNo: purchaseRefNo,
      PurchaseDate: purchaseDate,
      Total: parseDecimal(totals.totalValue),
      TaxAmount: parseDecimal(totals.totalTax),
      DiscountAmount: parseDecimal(totals.totalDiscount),
      NetAmount: parseDecimal(totals.grandTotal),
      RoudingAmount: parseDecimal(roundOff),
      CashAmount: parseDecimal(totals.grandTotal),
      PaymentMode: selectedButton,
      Remarks: remarks
    };
  
    const purchaseDetails = products.map((product, index) => ({
      SINo: parseDecimal(index + 1),
      ItemNo: product.name,
      ItemName: items.find(item => item.Item_No === product.name)?.Item_Name,
      BatchCode: product.batch,
      Quantity: parseDecimal(product.qty),
      FOC: parseDecimal(product.free),
      Unit: product.pkgunit, // Updated to use pkgunit
      PackageSize: parseDecimal(product.packagesize), // Added mapping for PackageSize
      Packing: parseDecimal(product.packing), // Added mapping for Packing
      Price: parseDecimal(product.rate),
      MRP: parseDecimal(product.mrp),
      Total: parseDecimal(product.amount),
      DiscountAmount: parseDecimal(product.discount),
      DiscountPercentage: parseDecimal((parseFloat(product.discount) / parseFloat(product.amount)) * 100),
      TaxCode: "A",
      TaxAmount: parseDecimal(product.tax),
      NetTotal: parseDecimal(parseFloat(product.amount) + parseFloat(product.tax) - parseFloat(product.discount))
    }));
  
    const purchaseBatches = products.map(product => ({
      ItemNo: product.name,
      BatchCode: product.batch,
      PurchaseDate: purchaseDate,
      ExpiryDate: convertExpiryDate(product.exp),
      Quantity: parseDecimal(product.qty)
    }));
  
    const payload = {
      PurchaseHeader: purchaseHeader,
      PurchaseDetails: purchaseDetails,
      PurchaseBatches: purchaseBatches
    };
  
    try {

      console.log('hereeeee', JSON.stringify(payload))
      setLoading(true);
      const response = await axios.post(`${BASE_URL}${POST_PURCHASE}`, payload, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status === 200) {
        setLoading(false);
        toast.success('Purchase Saved Successfully', {
          duration: 5000, // Duration in milliseconds
        });
        resetForm();
      }
    } catch (error) {
      setLoading(false);
      toast.success('Something Went Wrong', {
        duration: 5000, // Duration in milliseconds
      });
      console.error(error);
    }
  };
  
  const resetForm = () => {
    setSelectedSupplier(null);
    setPurchaseRefNo('');
    setPurchaseDate('');
    setSelectedButton(null);
    setRemarks('');
    setRoundOff(0);
    setProducts([{ slno: "", name: "", batch: "", exp: "", qty: 0,packagesize: 0, packing: 0, free: 0, rate: 0, amount: 0, mrp: 0, discount: 0, tax: 0.00 }]);
    setTotals({ totalValue: 0, totalTax: 0, totalDiscount: 0, grandTotal: 0 });
    getData();
  };

  const calculateTotals = (products) => {
    let totalValue = 0;
    let totalTax = 0;
    let totalDiscount = 0;
  
    products.forEach(product => {
      const amount = parseFloat(product.amount) || 0;
      const discount = parseFloat(product.discount) || 0;
      const tax = parseFloat(product.tax) || 0;
      
      totalValue += amount;
      totalDiscount += (amount * discount / 100);
      totalTax += (amount * tax / 100);
      
    });
  
    const grandTotal = totalValue - totalDiscount + totalTax ;
    
    setTotals({
      totalValue: totalValue.toFixed(2),
      totalTax: totalTax.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    });
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  const handleRemarksChange = (event) => {
    if (event.target.value.length <= maxCharacters) {
      setRemarks(event.target.value);
    }
  };

  const itemOptions = items.map(item => ({
    value: item.Item_No,
    label: item.Item_Name
  }));

  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.SupplierID,
    label: supplier.SupplierName
  }));

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minWidth: '200px',
      backgroundColor: '#fffff',
      borderColor: state.isFocused ? '#000000' : '#d9d9d9',
      boxShadow: state.isFocused ? '0 0 0 1px #000000' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#000000' : '#d9d9d9',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(38, 132, 255, 0.1)' : state.isFocused ? 'rgba(38, 132, 255, 0.1)' : '#fffff',
      color: state.isSelected ? '#000000' : state.isFocused ? '#000000' : 'black',
      '&:hover': {
        backgroundColor: 'rgba(38, 132, 255, 0.1)',
        color: '#000000',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 999,
      position: 'absolute',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleExpiryChange = (index, value) => {
    const formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    const month = formattedValue.slice(0, 2);
    const year = formattedValue.slice(2, 4);
    const finalValue = month + (year ? '/' + year : '');
    handleInputChange(index, 'exp', finalValue);
  };
 
  
  return (
    <div className="rounded-lg flex-grow h-full overflow-auto hide-scrollbar">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide} // Corrected prop assignment
      />
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
      <div className="space-y-4 p-2">
        <div className='flex justify-between gap-3'>
          <div className="bg-white space-y-4 p-8 rounded-lg w-4/6 h-full overflow-auto hide-scrollbar">
            <h2 className="text-xl font-normal mb-4">New Purchase Entry</h2>
            <div className='flex justify-between gap-2 w-full'>
              <Select
                options={supplierOptions}
                placeholder="Select Supplier"
                className="w-full"
                isSearchable
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                value={selectedSupplier}
                onChange={setSelectedSupplier}
                required
              />
              <input type="text" placeholder="Invoice Number" value={invoiceNumber} className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500" disabled />
              <input type="text" placeholder="Purchase Number" className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500" value={purchaseRefNo} onChange={(e) => setPurchaseRefNo(e.target.value)} required />
            </div>
            <div className='flex justify-between w-full gap-2'>
              <div className='flex justify-between w-8/12 gap-2'>
                <input type="date" placeholder="Purchase Date" className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />

                <div className='flex justify-between w-full gap-2'>
                  <button
                    type="button"
                    className={`w-1/2 py-2 flex items-center justify-center rounded ${selectedButton === 'debit' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
                    onClick={() => handleButtonClick('debit')}
                  >
                    <IoWalletOutline className="mr-2" /> Cash
                  </button>
                  <button
                    type="button"
                    className={`w-1/2 py-2 flex items-center justify-center rounded ${selectedButton === 'credit' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
                    onClick={() => handleButtonClick('credit')}
                  >
                    <CiCreditCard2 className="mr-2" /> Credit
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-8/12 pr-2">
              <textarea
                rows="5"
                value={remarks}
                onChange={handleRemarksChange}
                placeholder="Remarks"
                className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
              />
              <div className="text-right text-sm text-gray-500">
                {maxCharacters - remarks.length} characters remaining
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2 w-2/6'>
            <div className="bg-white space-y-4 p-8 rounded-lg flex-grow h-1/2 overflow-auto hide-scrollbar">
              <p>History</p>
              <div className='w-full flex'>
                <div className=' w-full text-sm   '>
                  <p className='text-sm text-gray-400'>Last Purchase Date: </p>
                  <p className='text-md font-semibold'>8 July, 2020</p> </div>
                <div className='w-full text-sm'>  
                  <p className='text-sm font-extralight'>Last Payment Date:</p>
                  <p className='text-md font-semibold'>30 July, 2020</p>
                </div>
              </div>
              <div className='w-full flex'>
                <div className='w-full'>
                  <p className='text-sm font-extralight'>Last Purchase Amount: </p>
                  <p className='text-md font-semibold'>₹5,20,000</p>
                </div>
                <div className=' w-full text-sm'>
                  <p className='text-sm font-extralight'>Last Payment Amount:</p>
                  <p className='text-md font-semibold'>₹5,00,000</p>

                </div>
              </div>


            </div>
            <div className='flex flex-row gap-2 h-1/2 w-full'>
              <div className="bg-white p-3 rounded-lg flex-grow h-full overflow-auto hide-scrollbar">
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                    <p>Total Value :</p>
                    <p>{totals.totalValue}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Total Tax :</p>
                    <p>{totals.totalTax}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Discount :</p>
                    <p>{totals.totalDiscount}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p>Round Off: </p>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                  </div>
                  <div className='flex justify-between'>
                    <p>Grand Total :</p>
                    <p>{totals.grandTotal}</p>
                  
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-row gap-2'>

                  <div className="bg-white rounded-lg flex-grow p-3 text-sm  h-20 overflow-auto hide-scrollbar">
                    <button onClick={handleClick}>
                      <TiPrinter size={20} />
                      <p>Add </p>
                      <p>  Item</p>
                    </button>
                  </div>
                  {showModal ? <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'> <div className='bg-white w-4/6 px-2 pb-10 pt-2 rounded-lg shadow-lg transform transition-transform duration-300 ease-out animate-zoom-in'><div className='flex'> <NewItemEntry /><button type="button" onClick={() => setShowModal(false)} className="text-gray-400 justify-center items-center   bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex    " >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>

                  </button></div>
                  </div></div> : ""}

                  <div className="bg-white rounded-lg flex-grow text-sm p-3 m h-20 overflow-auto hide-scrollbar">
                    <button onClick={handleshow} >
                      <TiPrinter size={20} />
                      <p>Add </p>
                      <p>Supplier</p>
                    </button>
                  </div>
                </div>

                <div className="bg-white space-y-2.5 p-3 rounded-lg flex-grow h-full overflow-auto hide-scrollbar">
                  <div className='text-sm '>
                    <p>short-keys</p>
                    <p className='bg-background rounded-lg text-xs'>New Supplier   ctrl + z</p>
                    <p className='bg-background text-xs rounded-lg mt-2'>New item  ctrl + i</p>
                  </div>
                </div>

              </div>
              </div>
            </div>
          </div>

          <div className="bg-white space-y-4 p-8 rounded-lg flex-grow h-screen overflow-auto hide-scrollbar">
            <div className='flex flex-col gap-2'>
              <div className="flex justify-between items-center">
                <h3 className="text-lg">Products</h3>
                <div className="p-2 rounded-lg bg-blue-600 cursor-pointer" onClick={addProductRow}>
                  <FiPlus size={15} color="white" />
                </div>
              </div>

              <div className="rounded-lg mb-4 overflow-x-auto pb-4 z-0">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-gray-500 text-sm font-normal text-left  sticky left-0 z-[9999] bg-white">Sl</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm sticky left-8 z-[9999] bg-white">Product</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Batch</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Expiry</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Unit Size</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Size Unit</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Packing</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Quantity</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Free</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Rate</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Amount</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">MRP</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">Discount</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm">GST</th>
                      <th className="p-2 text-left text-gray-500 font-normal text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td
                          className="p-2 text-gray-500 text-sm font-normal sticky left-0 z-[9999] bg-white"
                        >
                          {index + 1}
                        </td>
                        <td
                          className="p-2 font-normal text-sm sticky left-8 z-[9999] bg-white"
                          style={{ minWidth: '300px' }}
                        >

                          <Select
                            options={itemOptions}
                            onChange={(option) => handleInputChange(index, 'name', option.value)}
                            className="w-full"
                            isSearchable
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            defaultValue={itemOptions.find((option) => option.value === product.name)}
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '200px' }}>
                          <input
                            type="text"
                            value={product.batch}
                            onChange={(e) => handleInputChange(index, 'batch', e.target.value)}
                            className={`w-full p-2 border 'border-gray-100'} bg-gray-100 rounded text-sm`}
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '150px' }}>
                          <input
                            type="text"
                            value={product.exp}
                            onChange={(e) => handleExpiryChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            placeholder="MM/YY"
                            required
                          />
                        </td>

                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.packagesize}
                            onChange={(e) => handleInputChange(index, 'packagesize', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>

                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <select
                            value={product.pkgunit}
                            onChange={(e) => handleInputChange(index, 'pkgunit', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          >
                            <option value='nos'>Nos</option>
                            <option value='ml'>ml</option>
                            <option value='littre'>littre</option>
                          </select>
                        </td>


                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.packing}
                            onChange={(e) => handleInputChange(index, 'packing', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.qty}
                            onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.free}
                            onChange={(e) => handleInputChange(index, 'free', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.rate}
                            onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.amount}
                            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            readOnly
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="number"
                            value={product.mrp}
                            onChange={(e) => handleInputChange(index, 'mrp', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <input
                            type="text"
                            value={product.discount}
                            onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          />
                        </td>
                        <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                          <select
                            value={product.tax}
                            onChange={(e) => handleInputChange(index, 'tax', e.target.value)}
                            className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                            required
                          >
                            <option value='0'>Exempt</option>
                            <option value='5'>5%</option>
                            <option value='12'>12%</option>
                            <option value='18'>18%</option>
                            <option value='28'>28%</option>
                          </select>
                        </td>
                        <td>
                          <span className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-lg cursor-pointer" onClick={() => removeProductRow(index)}>
                            <MdDelete size={15} color='red' />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='flex justify-between gap-5 w-full'>
              <button className="w-40 py-2 bg-btnblue text-white border border-gray-200 rounded-xl ml-auto cursor-pointer" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>

        {showModal1 && 
            <NewSupplierEntry setShowModal1={setShowmodal1} id={selectedSupplierId} setSelectedSupplierId={setSelectedSupplierId} />
        }
      </div>

      );
}

export default NewPurchaseEntry;
