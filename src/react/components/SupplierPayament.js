import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { BASE_URL, GET_SUPPLIER, GET_SUPPLIER_DUEBILLS, POST_SUPPLIER_PAYMENT } from '../utlilities/config';
import axios from 'axios';
import { IoWalletOutline } from "react-icons/io5";
import { CiCreditCard2 } from "react-icons/ci";


const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: '200px',
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#3b82f6' : '#d9d9d9',
    boxShadow: state.isFocused ? '0 0 0 1px #000000' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#d9d9d9',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(38, 132, 255, 0.1)' : state.isFocused ? 'rgba(38, 132, 255, 0.1)' : '#ffffff',
    color: state.isSelected ? '#000000' : state.isFocused ? '#000000' : 'black',
    '&:hover': {
      backgroundColor: 'rgba(38, 132, 255, 0.1)',
      color: '#000000',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 0,
    position: 'absolute',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};
function SupplierPaymet() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dueBills, setDueBills] = useState([])
  const [checkedBills, setCheckedBills] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [remarks, setremarks] = useState('');
  const [Totalpaid, setTotalpaid] = useState()
  const [bankAmount ,setBankAmount] = useState()
  const [billPayments, setBillPayments] = useState({});
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_SUPPLIER}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        setSuppliers(response.data.data)
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSupplierChange = async (selectedOption) => {
    setSelectedSupplier(selectedOption);
    try {
      const response = await axios.get(`${BASE_URL}${GET_SUPPLIER_DUEBILLS}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          'supplierID': selectedOption.value,
        },
      });
      if (response.status === 200) {
        setDueBills(response.data.data)
        // setChecked(response.data.data)
      }
    } catch (error) {
      toast.error("Failed to load supplier details");
    }
  };
  const handleCheckboxclicked = (label) => {
    setCheckedItems(prevCheckedItems =>
      prevCheckedItems.includes(label)
        ? prevCheckedItems.filter(item => item !== label)
        : [...prevCheckedItems, label]
    );
    
  };
 
  
  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
    
  };
 
  
  const checkedLabels = dueBills
    .filter(item => checkedItems.includes(item.PurchaseRefNo))
    .map(item => item.PurchaseRefNo)
    .join(', ');
  const checkedValues = dueBills
    .filter(item => checkedItems.includes(item.PurchaseRefNo))
    .reduce((acc, item) => acc + (item.TotalAmount || 0), 0);

  const supplierOptions = suppliers.map(item => ({
    value: item.SupplierID,
    label: item.SupplierName,
  }));
  

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      if (!Totalpaid || (!bankAmount && selectedButton === 'credit')) {
        toast.error('Please enter an amount');
        setLoading(false);
        return;
      }
  
      let remainingAmount = parseFloat(selectedButton === 'credit' ? bankAmount : Totalpaid);
      const updatedBills = dueBills
        .filter(item => checkedItems.includes(item.PurchaseRefNo))
        .map((bill, index) => {
          const { TotalAmount, Sequence, InvoiceNo, EditNo, InvoiceDate } = bill;
          let PaidAmount = 0;
  
          if (remainingAmount >= TotalAmount) {
            PaidAmount = TotalAmount;
            remainingAmount -= PaidAmount;
          } else if (remainingAmount > 0) {
            PaidAmount = remainingAmount;
            remainingAmount = 0;
          }
  
          return {
            SINo: index + 1,
            InvoiceSequence: Sequence,
            InvoiceNo: InvoiceNo,
            InvoiceEditNo: EditNo,
            InvoiceDate: InvoiceDate.split('T')[0],
            TotalAmount: TotalAmount,
            PaidAmount: PaidAmount
          };
        });
  
      const payload = {
        SupplierID: selectedSupplier.value,
        SupplierName: selectedSupplier.label,
        PaymentDate: new Date().toISOString().split('T')[0],
        CashAmount: selectedButton === 'debit' ? Totalpaid : 0,
        BankAmount: selectedButton === 'credit' ? bankAmount : 0,
        Remarks: remarks,
        InvoiceDetails: updatedBills
      };
  
      console.log('Payload:', payload);
  
      // const response = await axios.post(`${BASE_URL}${POST_SUPPLIER_PAYMENT}`, payload, {
      //   headers: {
      //     'XApiKey': process.env.REACT_APP_API_KEY,
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
  
      // if (response.status === 200) {
      //   toast.success('Payment Completed.');
      //   getData();
      // }
    } catch (error) {
      console.error('Payment failed:', error.response?.data || error.message);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-lg flex-grow h-full overflow-auto hide-scrollbar flex  flex-col">
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
      <div className='flex flex-row justify-between gap-10 p-5 h-[56%]'>
        <div className='flex bg-white w-2/3 rounded-lg p-5 flex-col'>
          <h2 className="text-xl font-normal mb-4">Payment</h2>
          <div className='flex flex-col gap-5'>
            <div className='flex justify-between gap-3'>
              <Select
                options={supplierOptions}
                placeholder="Select Supplier"
                className="w-1/2"
                isSearchable
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                required
                onChange={handleSupplierChange}
              />
              <input type="date" placeholder="name" className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500" />
            </div>
            <div className='flex justify-between gap-3'>
              <input type="text" value={checkedLabels} placeholder="Supplier Name" readOnly className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm  placeholder:text-gray-500" />
              <input type="text" value={checkedValues} placeholder="Total Amount" readOnly className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500" />
            </div>

            <div className='flex justify-between gap-3'>
  <input
    type="text"
    value={remarks}
    onChange={(e) => setremarks(e.target.value)}
    placeholder="Remarks"
    className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
  />
  {selectedButton === 'credit' ? (
    <input
      type="number"
      value={bankAmount}
      onChange={(e) => setBankAmount(parseFloat(e.target.value))}
      placeholder="Paying Amount"
      className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
    />
  ) : selectedButton === 'debit' ? (
    <input
      type="number"
      value={Totalpaid}
      onChange={(e) => setTotalpaid(parseFloat(e.target.value))}
      placeholder="Paying Amount"
      className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
    />
  ) : (
    <input
      type="text"
      placeholder="Paying Amount"
      className="w-1/2 p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
      disabled
    />
  )}
</div>


            <div className='flex justify-end gap-5'>
              <div className='flex justify-start w-full gap-3'>
                <button
                  type="button"
                  className={`w-44 py-2 flex items-center justify-center text-lg rounded ${selectedButton === 'debit' ? 'bg-btnblue text-white' : 'bg-gray-100 text-black'}`}
                  onClick={() => handleButtonClick('debit')}
                >
                  <IoWalletOutline className="mr-3 " size={16} /> Cash
                </button>
                <button
                  type="button"
                  className={`w-44 py-2 flex items-center text-lg justify-center rounded ${selectedButton === 'credit' ? 'bg-btnblue text-white' : 'bg-gray-100 text-black'}`}
                  onClick={() => handleButtonClick('credit')}
                >
                  <CiCreditCard2 className="mr-2" size={18} /> Bank
                </button>
              </div>
              <button onClick={handleSubmit} className="w-60 py-2 bg-btnblue text-white border border-gray-200 rounded-xl ml-auto cursor-pointer" >Save</button>
            </div>
          </div>
        </div>
        <div className='flex bg-white w-1/3 rounded-lg p-5 overflow-auto hide-scrollbar'>
          <div className="space-y-4 rounded-lg flex-grow h-full bg-white overflow-auto hide-scrollbar p-2">
            <p>History</p>
            <div className='w-full flex flex-col gap-2'>
              <div className='w-full text-sm flex justify-between  '>
                <p className='text-sm text-black'>Last Payment Date </p>
                <p className='text-sm text-black'>Last Payment Amount </p>
              </div>
              <div className='w-full text-sm flex justify-between  '>
                <p className='text-sm text-black font-extralight'>29/06/2024 </p>
                <p className='text-sm font-extralight text-black'>12000/-</p>
              </div>
              <div className='w-full text-sm flex justify-between  '>
                <p className='text-sm text-black font-extralight'>29/06/2024 </p>
                <p className='text-sm font-extralight text-black'>12000/-</p>
              </div>
              <div className='w-full text-sm flex justify-between  '>
                <p className='text-sm text-black font-extralight'>29/06/2024 </p>
                <p className='text-sm font-extralight text-black'>12000/-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-between gap-10 p-5 h-[44%] overflow-auto hide-scrollbar'>
        <div className='flex bg-white w-full rounded-lg p-5 overflow-auto hide-scrollbar'>
          <table className="w-full border-collapse overflow-auto hide-scrollbar">
            <thead>
              <tr>
                <th className="border-b p-2 text-gray-500 text-sm text-left">
                  <input type="checkbox" disabled />
                </th>
                <th className="border-b p-2 text-gray-500 text-sm text-left">BILL NO</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">INV DATE</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">DUE DATE</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">GRAND TOTAL</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">DUE TOTAL</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {dueBills.map((row, index) => (
                <tr key={index}>
                  <td className="border-b p-2">
                    <input
                      type="checkbox"
                      checked={checkedBills.includes(row?.PurchaseRefNo)}
                      onChange={() => handleCheckboxclicked(row?.PurchaseRefNo)}

                    />
                  </td>
                  <td className="border-b p-2 text-gray-500 text-md">{row?.PurchaseRefNo}</td>
                  <td className="border-b p-2 text-sm">{row?.InvoiceDate.split('T')[0]}</td>
                  <td className="border-b p-2 text-sm">{row?.InvoiceDate.split('T')[0]}</td>
                  <td className="border-b p-2 text-sm">{row?.TotalAmount}</td>
                  <td className="border-b p-2 text-sm">   </td>
                  <td className="border-b p-2">
                    <span className="flex items-center text-xs">
                      <span
                        className='w-2 h-2 rounded-full mr-2 bg-red-600'
                      ></span>
                      <span
                        className='text-red-600'
                      >
                        {row?.PayStatus}
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
}
export default SupplierPaymet;
