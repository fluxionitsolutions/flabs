import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, GET_BILL_DETAILS, POST_RECIEPTS } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

import { IoWalletOutline } from "react-icons/io5";
import { FaCcAmazonPay } from "react-icons/fa";

function BillPayment({ billNumber, sequence, editNumber }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const [bill, setBill] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [payMode, setPayMode] = useState('Cash'); // State for payment mode
  const [error, setError] = useState(''); // State for error message

  useEffect(() => {
    getData();
  }, [billNumber, sequence, editNumber]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_BILL_DETAILS}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          'invoiceNo': billNumber,
          '_sequence': sequence,
          'editNo': editNumber
        },
      });

      if (response.status === 200) {
        setLoading(false);
        console.log('hereeee',response.data.data)
        setBill(response.data.data.invDetails[0]);
        setHistory(response.data.data.receiptHistory);
        const dueAmount = response.data.data.invDetails[0].TotalDue;
        setBalance(dueAmount);
        setAmount(dueAmount);
      }
    } catch (error) {
      setLoading(false);
      console.log('Failed to fetch bill data.');
    }
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value > bill.TotalDue) {
      setError('Amount cannot exceed the total due.');
    } else {
      setError('');
      console.log('valueeeeeee hereee', value)
      setAmount(value);
      setBalance(bill.TotalDue - value);
    }
  };

  const handlePaymentModeChange = (mode) => {
    setPayMode(mode);
  };

  const handleSubmit = async () => {
    try {

        setLoading(true);

        const data = {
          InvoiceNo : billNumber,
          Sequence: sequence,
          EditNo: editNumber,
          cashAmount: payMode === 'Cash' ? amount : 0,
          bankAmount: payMode === 'UPI' ? amount : 0,
          payMode: payMode,
        };

        console.log('final dataaa hereee', data)


        const response1 = await axios.post(`${BASE_URL}${POST_RECIEPTS}`, data, 
          {
            headers: {
              'XApiKey': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (response1.status === 200) {
            setLoading(false);
            toast.success('Payment Marked.');
            getData();
        }
    } catch (error) {
      setLoading(false);
      console.error('Payment failed:', error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="flex h-screen bg-background">
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
        transition={Slide}
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
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
        <div className="flex p-5 gap-6">
          <div className="w-full bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold">#{billNumber}</h2>
            <div className='flex justify-between mb-5'>
              <h3 className="text-lg font-base">{bill?.PatientName}</h3>
              {bill?.PaymentStatus === "Completed" ?
                
                <span className="flex items-center justify-center text-xs bg-green-100 w-24 h-5 rounded">
                  <span className='w-2 h-2 rounded-full mr-2 bg-green-500'></span>
                  <span className='text-green-500'>Completed</span>
                </span>
                :
                <span className="flex items-center justify-center text-xs bg-red-200 w-16 h-5 rounded">
                  <span className='w-2 h-2 rounded-full mr-2 bg-red-500'></span>
                  <span className='text-red-500'>Due</span>
                </span>
              }

            </div>
            <div className='flex justify-between'>
              <div className='border-l pl-2'>
                <p className='text-xs text-gray-500'>Date :</p>
                <p className='text-sm'>{bill?.InvoiceDate.split('T')[0]}</p>
              </div>

              <div className='border-l pl-2'>
                <p className='text-xs text-gray-500'>Age</p>
                <p className='text-sm'>{bill?.Age}</p>
              </div>
              <div className='border-l pl-2'>
                <p className='text-xs text-gray-500'>Amount :</p>
                <p className='text-sm'>₹{bill?.GrandTotal}</p>
              </div>
              <div className='border-l pl-2'>
                <p className='text-xs text-gray-500'>Total Due :</p>
                <p className='text-sm text-red-500'>₹{bill?.TotalDue}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex px-4'>
          <div className='w-4/6 m-1 h-auto bg-white rounded-lg p-5'>
            <form className="space-y-4">
              <h1>Payment</h1>
              <div className='w-full'>
                <label className='text-sm p-2'>Payable Amount</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-100 bg-gray-100 rounded-lg placeholder:text-sm placeholder:text-gray-500" 
                  value={amount}
                  onChange={handleAmountChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className='w-full mt-4'>
                <label className='text-sm p-2'>Balance</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-100 bg-gray-100 rounded-lg placeholder:text-sm placeholder:text-gray-500" 
                  readOnly 
                  value={balance}
                />
              </div>

              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="paymentMode"
                  value="Cash"
                  checked={payMode === 'Cash'}
                  onChange={() => handlePaymentModeChange('Cash')}
                  className="w-4 h-4 mt-5 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 focus:ring-2" 
                />
                <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium mt-5 text-gray-900 dark:text-gray-300 flex ml-2">
                  <IoWalletOutline size={20} />
                  <span className='ml-1'>Cash Payment</span>
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="paymentMode"
                  value="UPI"
                  checked={payMode === 'UPI'}
                  onChange={() => handlePaymentModeChange('UPI')}
                  className="w-4 h-4 mt-5 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 focus:ring-2" 
                />
                <label htmlFor="inline-2-radio" className="ms-2 text-sm font-medium mt-5 text-gray-900 dark:text-gray-300 flex ml-2">
                  <FaCcAmazonPay size={20} />
                  <span className='ml-1'>UPI Payment</span>
                </label>
              </div>

              <div className='flex justify-between gap-5 w-full'>
                <button 
                  type="button"
                  className="w-40 py-2 bg-btnblue text-white mt-3 border border-gray-200 rounded-xl ml-auto cursor-pointer"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="w-2/5 h-56 bg-white m-1 rounded-lg p-5">
            <div className='flex justify-between mb-2'>
              <h3 className="text-lg font-sm">History</h3>
            </div>
            <div className='w-ful'>
              <div className='flex justify-between'>
                <p className='text-xs text-gray-800 font-bold'>Date</p>
                <p className='text-xs text-gray-800 font-bold'>Amount</p>
              </div>
              {history.map((item, index) => (
                <div key={index} className='flex w-full justify-between'>
                  <p className='text-xs mt-2'>{formatDate(item.ReceiptDate)}</p>
                  <div className='text-xs mt-2'>
                    ₹{item.GrandTotal} ({item.PaymentMode})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillPayment;
