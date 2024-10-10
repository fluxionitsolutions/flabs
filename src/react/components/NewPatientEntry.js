import React, { useEffect, useState } from 'react';
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import Select from 'react-select';
import { BASE_URL, GET_PATIENTS, POST_TEST_ENTRY, TEST_ENTRY_LOAD, GET_PATIENT_HISTORY, GET_BILL } from '../utlilities/config';
import { spinnerStyles, overlayStyles } from '../common/style';
import AddDoctorModal from './patiententrymodals/AddDoctorModal';
import AddLabModal from './patiententrymodals/AddLabModal';
import AddPatientModal from './patiententrymodals/AddPatientModal';
import PrivilageEntrymodal from './patiententrymodals/PrivilageEntrymodal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import BillComponent from './Invoice';
import { toPng } from 'html-to-image';
import { useParams } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function NewPatientEntry() {
  const [loading, setLoading] = useState(false);
  const [pageno, setPageno] = useState(1);
  const [pagesize, setPagesize] = useState(1000);
  const token = localStorage.getItem('accessToken');

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [labs, setLabs] = useState([]);
  const [syring, setSyring] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedSyring, setSelectedSyring] = useState("");
  const [testStatus, setTeststatus] = useState("");

  const [mobileInput, setMobileInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentdate, setCurrentDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([{ item: null, amount: "", type: "", id: null, name: "" }]);
  const [discount, setDiscount] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [history, setHistory] = useState([]);

  const [billedDate, setBilledDate] = useState('')

  const [patientModal, setPatientModal] = useState(false);
  const [doctorModal, setDoctorModal] = useState(false);
  const [labModal, setLabModal] = useState(false);
  const [cardModal, setCardModal] = useState(false);

  const [printAfterSave, setPrintAfterSave] = useState(false);

  const { id, edit, sequence } = useParams();

  const [privilegeCardID, setPrivilegeCardID] = useState('');
  const [privilegeCardNumber, setPrivilegeCardNumber] = useState('');

  const handleSavePrivilegeCard = (cardID, cardNumber) => {
    setPrivilegeCardID(cardID);
    setPrivilegeCardNumber(cardNumber);
  };


  useEffect(() => {
    getData();
    getHeaderData();

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);

    const billigDate = new Date();
    const newdate = formatBilledDate(billigDate);
    setBilledDate(newdate);
  }, []);



  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_PATIENTS}`, {
        headers: {
          'PageNo': pageno,
          'PageSize': pagesize,
          'FilterText': '',
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setPatients(response.data.data.masterData);
        if (id && edit && sequence) {
          getTestData();
        }
      }
    } catch (error) {
      toast.error('Failed to fetch patient data.');
    } finally {
      setLoading(false);
    }
  };


  const getTestData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_BILL}`, {
        headers: {
          '_sequence': sequence,
          'invoiceNo': id,
          'editNo': edit,
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status === 200) {
        const headerData = response.data.data.invHeader[0];
        const lineData = response.data.data.invLineDetail;
  
        setSelectedPatient({
          PatientID: headerData.PatientID,
          PatientName: headerData.PatientName,
          Age: headerData.Age,
          Place: headerData.Ref_Lab,
          MobileNo: '',
          DOB: formatDate(headerData.DOB),
          Months: headerData.Month,
          Days: headerData.Days,
          Gender: headerData.Gender
        });

        getPatientHistory(headerData.PatientID);
        setSelectedDoctor({ value: headerData.Ref_DoctorID, label: headerData.Ref_DoctorName });
        setSelectedLab({ value: headerData.Ref_Lab, label: headerData.Ref_Lab });
        setSelectedSyring({ value: headerData.SiringeType, label: headerData.SiringeType });
        setTeststatus(headerData.TestStatus);
        setInvoiceNumber(headerData.InvoiceNo);
        setAdvance(headerData?.GrandTotal - headerData?.BalanceDue);
        setDiscount(headerData.DiscAmount);
        setCurrentDate(formatDateToUS(headerData?.Created_at));
  
        const updatedProducts = lineData.map((item) => ({
          id: item.ID,
          item: { value: item.ID, label: item.Name },
          amount: item.Amount,
          type: item.Type,
          name: item.Name
        }));
        setProducts(updatedProducts);
        setInvoiceNumber(headerData.InvoiceNo);
      }
    } catch (error) {
      toast.error('Failed to fetch patient data.');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setSelectedPatient(null);
    setSelectedDoctor("");
    setSelectedLab("");
    setSelectedSyring("");
    setTeststatus("waiting");
    setMobileInput('');
    setProducts([{ item: null, amount: "", type: "", id: null, name: "" }]);
    setDiscount(0);
    setAdvance(0);
    setInvoiceNumber('');
    setCurrentDate('');
  };


  const formatBilledDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };


  const formatDateToUS = (dateString) => {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
  
    return date.toLocaleDateString('en-US');
  };
  

  const handlePrint = () => {  
    const billDiv = document.getElementById('billDiv');
    if (billDiv) {
        toPng(billDiv, { quality: 1, pixelRatio: 3 })
            .then((dataUrl) => {
                const link = document.createElement('a');

                ipcRenderer.send('print-bill-image', dataUrl);

            })
            .catch((error) => {
                console.error('Error capturing billDiv as image:', error);
            });
    }
  };


  const handleSave = async () => {
    if (id && edit && sequence) {
      console.log('hereee for updateeee')

      const parseDecimal = (value) => parseFloat(parseFloat(value).toFixed(3));
      const entrydate = new Date().toISOString();
    
      const validProducts = products.filter(product => product.id && product.amount);
    
      const testEtryHdr = {
        PatientID: selectedPatient?.PatientID || "",
        PatientName: selectedPatient?.PatientName || "",
        Age: selectedPatient?.Age || "",
        EntryDate: entrydate,
        Ref_Lab: selectedLab?.label || "",
        Ref_DoctorID: selectedDoctor?.value || "",
        Ref_DoctorName: selectedDoctor?.label || "",
        TestStatus: testStatus,
        SiringeType: selectedSyring?.label || "",
        PaymentMode: "",
        PaymentStatus: "Pending",
        CashAmount: 0.00,
        BankAmount: 0.00,
        AdvanceAmount: advance,
        BalanceDue: calculateTotal() - discount - advance,
        TotalAmount: calculateTotal(),
        DiscountAmount: discount,
        GrandTotal: calculateTotal() - discount - advance,
      };
    
      const testEntryLines = validProducts.map((product, index) => ({
        SI_No: index + 1,
        ID: product?.id || '', 
        Name: product?.item?.label || 'Unknown', 
        Type: product?.type || "undefined",
        Amount: parseDecimal(product?.amount || "0.00"), 
      }));
    
      const payload = {
        testEtryHdr: testEtryHdr,
        testEntryLines: testEntryLines
      };

      console.log('updtae dataaaaaaa', payload)
      console.log('hereee', id, sequence, edit)

      try {
        setLoading(true);
        const response = await axios.post(`${BASE_URL}${POST_TEST_ENTRY}`, payload, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
            'InvoiceNo': id,
            'Sequence': sequence,
            'EditNo': edit,
            'DocStatus': 'U',
          },
        });
    
        if (response.status === 200) {
          toast.success('Invoice Created Successfully', { duration: 1000 });

          if (printAfterSave) {
            handlePrint();
          }

          setTimeout(() => {
            resetForm();
          }, 2000);

          
          
        } else {
          toast.error('Something Went Wrong', { duration: 5000 });
        }
      } catch (error) {
        console.error(error);
        toast.error('Something Went Wrong', { duration: 5000 });
      } finally {
        setLoading(false);
      }

    } else {

      const parseDecimal = (value) => parseFloat(parseFloat(value).toFixed(3));
      const entrydate = new Date().toISOString();
    
      const validProducts = products.filter(product => product.id && product.amount);
    
      const testEtryHdr = {
        PatientID: selectedPatient?.PatientID || "",
        PatientName: selectedPatient?.PatientName || "",
        Age: selectedPatient?.Age || 0,
        Month: selectedPatient?.Month || 0,
        Days: selectedPatient?.Days || 0,
        EntryDate: entrydate,
        Ref_Lab: selectedLab?.label || "",
        Ref_DoctorID: selectedDoctor?.value || "",
        Ref_DoctorName: selectedDoctor?.label || "",
        TestStatus: testStatus,
        SiringeType: selectedSyring?.label || "",
        PaymentMode: "",
        PaymentStatus: "Pending",
        CashAmount: 0.00,
        BankAmount: 0.00,
        AdvanceAmount: advance,
        BalanceDue: calculateTotal() - discount - advance,
        TotalAmount: calculateTotal(),
        DiscountAmount: discount,
        GrandTotal: calculateTotal() - discount - advance,
      };
    
      const testEntryLines = validProducts.map((product, index) => ({
        SI_No: index + 1,
        ID: product?.id || '', 
        Name: product?.item?.label || 'Unknown', 
        Type: product?.type || "undefined",
        Amount: parseDecimal(product?.amount || "0.00"), 
      }));
    
      const payload = {
        testEtryHdr: testEtryHdr,
        testEntryLines: testEntryLines
      };

    
      try {
        setLoading(true);
        const response = await axios.post(`${BASE_URL}${POST_TEST_ENTRY}`, payload, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
            'InvoiceNo': invoiceNumber,
            'DocStatus': 'A',
          },
        });
    
        if (response.status === 200) {
          toast.success('Invoice Created Successfully', { duration: 1000 });

          if (printAfterSave) {
            handlePrint();
          }

          setTimeout(() => {
            resetForm();
          }, 2000); // Adjust this delay if needed

          
          
        } else {
          toast.error('Something Went Wrong', { duration: 5000 });
        }
      } catch (error) {
        console.error(error);
        toast.error('Something Went Wrong', { duration: 5000 });
      } finally {
        setLoading(false);
      }
    }
  };
  

  const getHeaderData = async () => {
    setLoading(true);
    try {
      const response1 = await axios.get(`${BASE_URL}${TEST_ENTRY_LOAD}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response1.status === 200) {
        setSyring(response1.data.data.syringe);
        setItems(response1.data.data.itemsList);
        setInvoiceNumber(response1.data.data.nextNum[0].NextNum);
        setDoctors(response1.data.data.doctors);
        setLabs(response1.data.data.labs);
      }
    } catch (error) {
      toast.error('Failed to fetch header data.');
    } finally {
      setLoading(false);
    }
  };

  const getPatientHistory = async (id) => {
    try {
      const response2 = await axios.get(`${BASE_URL}${GET_PATIENT_HISTORY}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          'patientID': id,
        },
      });
      if (response2.status === 200) {
        setHistory(response2.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch patient history.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';  // Return empty string if dateString is null or undefined
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {  // Check if the date is invalid
      console.error('Invalid date:', dateString);
      return '';  // Return empty string if invalid date
    }
  
    return date.toISOString().split('T')[0];  // Return the formatted date if valid
  };
  

  const handleMobileChange = async (inputValue) => {
    setMobileInput(inputValue);

    if (inputValue.length === 3 || inputValue.length === 6 || inputValue.length === 9 || inputValue.length === 10) {
      await getFilterData(inputValue);
    }
  };

  const getFilterData = async (inputValue) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_PATIENTS}`, {
        headers: {
          'PageNo': pageno,
          'PageSize': pagesize,
          'FilterText': inputValue,
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        setPatients(response.data.data.masterData);
      }
    } catch (error) {
      toast.error('Failed to filter patients.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (selectedOption) => {
    if (selectedOption) {
      setSelectedPatient(selectedOption);
      setMobileInput(selectedOption.MobileNo || '');
      getPatientHistory(selectedOption.PatientID);
    } else {
      setSelectedPatient(null);
      setMobileInput('');
    }
  };

  const options = patients.map(patient => ({
    value: patient.PatientID,
    label: `${patient.PatientName} - ${patient.Age} years - ${patient.Place} - ${patient.MobileNo}`,
    ...patient
  }));

  const doctors_options = doctors.map(doctor => ({
    value: doctor.DoctorID,
    label: doctor.DoctorName
  }));

  const lab_options = labs.map(lab => ({
    value: lab.LabID,
    label: lab.LabName
  }));

  const syring_options = syring.map(syr => ({
    value: syr.ItemNo,
    label: syr.ItemName
  }));


  const handleProductChange = (index, selectedOption) => {
    const newProducts = products.map((product, i) => {
      if (i === index) {
        return {
          id: selectedOption.value,
          item: selectedOption,
          amount: selectedOption.amount,
          type: selectedOption.type,
          name: selectedOption.label
        };
      }
      return product;
    });
  
    setProducts(newProducts);
    
    if (selectedOption && index === products.length - 1) {
      addTestRow();
    }
  };
  
  const addTestRow = () => {
    setProducts(prevProducts => [...prevProducts, { item: null, amount: "", id: null, type: "", name: "" }]);
  };
  

  const handleDeleteRow = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const itemOptions = items.map(item => ({
    value: item.ID,
    label: item.Name,
    amount: item.Rate,
    type: item.Type
  }));

  const calculateTotal = () => {
    return products.reduce((total, product) => total + parseFloat(product.amount || 0), 0);
  };

  const customOptionLabel = ({ PatientName, Age, Place, MobileNo }) => {
    return (
      <div className="flex flex-row gap-1 justify-between">
        <div className="text-blue-800 shadow-lg rounded-lg p-1 w-3/12 flex justify-center content-center">
          {PatientName}
        </div>
        <div className="w-1/6 shadow-lg text-pink-800 rounded-lg p-1 flex justify-center content-center">
          {Age}
        </div>
        <div className="shadow-lg text-green-800 rounded-lg flex p-1 w-3/12 justify-center content-center">
          {Place}
        </div>
        <div className="shadow-lg text-green-800 rounded-lg p-1 flex w-3/12 justify-center content-center">
          {MobileNo}
        </div>
      </div>
    );
  };


  const handleAddNewCardClick = () => {
    if (!selectedPatient) {
      toast.error('Please select a patient first.');
    } else {
      setCardModal(true);
    }
  };


  const handleNewPatientSaved = (newPatient) => {
    setSelectedPatient(newPatient);
    setMobileInput(newPatient.MobileNo);
    getPatientHistory(newPatient.PatientID);
  };

  const handleNewDoctorSaved = (newDoctor) => {
    setSelectedDoctor({
      value: newDoctor.ID,
      label: newDoctor.DrName
    });
  };

  const handleNewLabSaved = (newLab) => {
    setSelectedLab({
      value: newLab.ID,
      label: newLab.LabName
    });
  };


  return (
    <div className='w-full flex justify-between gap-5'>
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
      <div className="bg-white p-6 rounded-lg flex-grow h-full overflow-auto hide-scrollbar">
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
        <h2 className="text-xl font-semibold mb-4">New Patient Entry</h2>
        <form className="space-y-4">
          <div className='flex justify-between gap-2 relative'>
            <div className="w-full flex flex-col">
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Mobile Number</p>
                  <p className='text-red-500'>*</p>
                </div>
                <Select
                  placeholder="Mobile Number"
                  value={options.find(option => option.value === selectedPatient?.PatientID)}
                  options={options}
                  formatOptionLabel={customOptionLabel}
                  onInputChange={(value, { action }) => {
                    if (action === 'input-change') {
                      handleMobileChange(value);
                    }
                  }}
                  onChange={(selectedOption) => {
                    handleSuggestionClick(selectedOption);
                  }}
                  isClearable
                  noOptionsMessage={() => "No data found"}
                />
                <div className='flex justify-end items-end content-end'>
                  <span className='text-sm underline text-blue-500 cursor-pointer' onClick={() => setPatientModal(true)}>Add New</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between gap-5'>
            <div className='w-full'>
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Name</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                value={selectedPatient ? selectedPatient.PatientName : ''}
                readOnly
              />
            </div>
            <div className='w-full'>
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Date Of Birth</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="date"
                placeholder="Date of birth"
                className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                value={selectedPatient ? formatDate(selectedPatient.DOB) : ''}
                readOnly
              />
            </div>
          </div>
          <div className='flex justify-between gap-5'>
            <div className='flex justify-between gap-5'>
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Age</p>
                  <p className='text-red-500'>*</p>
                </div>
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  value={selectedPatient ? selectedPatient.Age : ''}
                  readOnly
                />
              </div>
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Months</p>
                  <p className='text-red-500'>*</p>
                </div>
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  value={selectedPatient ? selectedPatient.Month : ''}
                  readOnly
                />
              </div>
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Days</p>
                  <p className='text-red-500'>*</p>
                </div>
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  value={selectedPatient ? selectedPatient.Days : ''}
                  readOnly
                />
              </div>
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Gender</p>
                  <p className='text-red-500'>*</p>
                </div>
                <select
                  className="w-full p-3 border border-gray-100 bg-gray-100 rounded text-sm"
                  value={selectedPatient ? selectedPatient.Gender : ''}
                  readOnly
                >
                  <option>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className='w-full'>
              <div className='flex flex-row gap-1'>
                <p className='text-sm pl-2'>Place</p>
                <p className='text-red-500'>*</p>
              </div>
              <input
                type="text"
                placeholder="Place"
                className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                value={selectedPatient ? selectedPatient.Place : ''}
                readOnly
              />
            </div>
            
          </div>
          <div className='flex justify-between gap-5'>
            <div className="w-full flex flex-col">
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Reffered Doctor</p>
                  <p className='text-red-500'>*</p>
                </div>
                <Select
                  options={doctors_options}
                  placeholder="Select Doctor"
                  className="w-full"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  required
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                />
                <div className='flex justify-end items-end content-end'>
                  <span className='text-sm underline text-blue-500 cursor-pointer' onClick={() => setDoctorModal(true)}>Add New</span>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Reffered Lab</p>
                  <p className='text-red-500'>*</p>
                </div>
                <Select
                  options={lab_options}
                  placeholder="Select Lab"
                  className="w-full"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  required
                  value={selectedLab}
                  onChange={setSelectedLab}
                />
                <div className='flex justify-end items-end content-end'>
                  <span className='text-sm underline text-blue-500 cursor-pointer' onClick={() => setLabModal(true)}>Add New</span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className="flex justify-between gap-5">
              <div className='flex flex-col w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Status</p>
                  <p className='text-red-500'>*</p>
                </div>
                <div className='flex flex-row gap-5'>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="waiting"
                      checked={testStatus === "waiting"}  // Check if the current state is 'waiting'
                      onChange={(e) => setTeststatus(e.target.value)}  // Update the state on change
                      className="mr-2"
                    /> 
                    Waiting
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="urgent"
                      checked={testStatus === "urgent"}  // Check if the current state is 'urgent'
                      onChange={(e) => setTeststatus(e.target.value)}  // Update the state on change
                      className="mr-2"
                    /> 
                    Urgent
                  </label>
                </div>
              </div>
            </div>

            <div className='flex flex-1 justify-between gap-4 ml-7'>
              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Syringe Type</p>
                  <p className='text-red-500'>*</p>
                </div>
                <Select
                  options={syring_options}
                  placeholder="Select Syring"
                  className="w-full"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  required
                  value={selectedSyring}
                  onChange={setSelectedSyring}
                />
              </div>

              <div className='w-full'>
                <div className='flex flex-row gap-1'>
                  <p className='text-sm pl-2'>Privilage Card</p>
                </div>
                <div className='flex justify-between gap-2'>
                  <input
                    type="text"
                    placeholder="Enter Card Number"
                    value={privilegeCardNumber}
                    className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"
                  />
                  
                  <button type="button" className=" bg-gray-200  hover:text-white  text-gray-400 font-medium rounded-lg hover:bg-blue-600 text-sm px-5  ">Validate</button>
                </div>
                <div className='flex justify-end items-end content-end'>
                    <span className='text-sm underline text-blue-500 cursor-pointer' onClick={handleAddNewCardClick}>New Card</span>
                  </div>
                
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">Particulars</h3>
              <div className='p-2 rounded-lg bg-blue-600 cursor-pointer' onClick={addTestRow}>
                <FiPlus size={15} color='white' />
              </div>
            </div>
            <div className="rounded-lg mb-4 overflow-x-auto z-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-gray-500 text-sm font-normal text-left sticky left-0  z-10">Sl</th>
                    <th className="p-2 text-left text-gray-500 font-normal text-sm">Test Name</th>
                    <th className="p-2 text-left text-gray-500 font-normal text-sm">Amount</th>
                    <th className="p-2 text-left text-gray-500 font-normal text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="text-gray-500 font-normal text-sm p-2 left-0">{index + 1}</td>
                      <td className="font-normal text-sm p-2 left-8 z-20" style={{ minWidth: '300px' }}>
                        <Select
                          options={itemOptions}
                          className="w-full"
                          isSearchable
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          value={product.item}
                          onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                          required
                        />
                      </td>
                      <td className="font-normal text-sm p-2" style={{ minWidth: '100px' }}>
                        <input
                          type="number"
                          value={product.amount}
                          className="w-full p-2 border border-gray-100 bg-gray-100 rounded text-sm"
                          required
                          readOnly
                        />
                      </td>
                      <td className='pl-5'>
                        <span className="flex justify-center w-6 h-6 bg-red-200 rounded-lg cursor-pointer items-center content-center" onClick={() => handleDeleteRow(index)}>
                          <MdDelete size={15} color='red' />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className='flex flex-row gap-2 justify-end pr-10'>
            <input 
              type="checkbox" 
              checked={printAfterSave} 
              onChange={(e) => setPrintAfterSave(e.target.checked)} 
            />
            <p>Print After Save</p>
          </div>

          <div className='flex justify-between gap-5 w-full'>
            <button type="button" className="w-64 py-2 bg-white text-btnblue border border-gray-200 rounded-xl ml-auto">Send Invoice</button>
            <button type="button" onClick={handleSave} className="w-64 py-2 bg-btnblue text-white rounded-xl">Create Invoice</button>
          </div>
          
        </form>


        <div style={{ position: 'absolute', opacity: 0, top: '-10000px', left: '-10000px' }}>
          <BillComponent
            invoiceNumber={invoiceNumber}
            selectedPatient={selectedPatient}
            selectedDoctor={selectedDoctor}
            date={billedDate}
            products={products}
            discount={discount}
            advance={advance}
            calculateTotal={calculateTotal}
          />
        </div>
      </div>
      <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 justify-between h-full gap-5 overflow-auto hide-scrollbar">
        <div className="bg-white p-6 rounded-lg shadow-md h-1/2 overflow-auto hide-scrollbar">
          <h2 className="text-xl font-normal mb-4">History</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-black text-sm font-normal text-left">Bill No</th>
                <th className="p-2 text-left text-black font-normal text-sm">Date</th>
                <th className="p-2 text-left text-black font-normal text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 text-gray-500 text-sm">#{row.InvoiceNo}</td>
                  <td className="font-normal text-gray-500 text-sm p-2">{row.EntryDate}</td>
                  <td className="font-normal text-gray-500 text-sm p-2">{row.GrandTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md h-1/2 overflow-hidden hide-scrollbar">
          <div className='flex justify-between pb-2'>
            <span className="text-2xl font-normal text-blue-600">Invoice #{invoiceNumber}</span>
            <span className='font-normal text-gray-500'>{currentdate}</span>
          </div> 
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Name : {selectedPatient?.PatientName || ''}</span>
              <span>{selectedPatient?.Age || ''} years</span>
            </div>
          </div>
          <div className="mt-4">
            <div className='flex justify-between'>
              <div></div>
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Total:</span>
                  <span className='text-gray-500'>{calculateTotal()}</span>
                </div>
                <div className='flex justify-between items-center w-full'>
                  <span className='text-gray-500'>Discount:</span>
                  <input
                    type="text"
                    className='text-gray-500 border-b-2 border-gray-500 p-1 rounded text-right w-1/4'
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
                <div className='flex justify-between font-semibold space-x-24'>
                  <span>Grand Total:</span>
                  <span>{calculateTotal() - discount}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Advance:</span>
                  <span className='text-gray-500'>{advance}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-red-500'>Balance:</span>
                  <span className='text-red-500'>{calculateTotal() - discount - advance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {patientModal &&
        <AddPatientModal setPatientModal={setPatientModal} refreshData={getData} mobileNumber={mobileInput} onPatientSaved={handleNewPatientSaved} />
      }
      {doctorModal &&
        <AddDoctorModal setDoctorModal={setDoctorModal} refreshData={getHeaderData} onDoctorSaved={handleNewDoctorSaved} />
      }
      {labModal &&
        <AddLabModal setLabModal={setLabModal} refreshData={getHeaderData}  onLabSaved={handleNewLabSaved} />
      }
      {cardModal &&
        <PrivilageEntrymodal setCardModal={setCardModal} patientId={selectedPatient?.PatientID} PatientName={selectedPatient?.PatientName} patientMobile={selectedPatient?.MobileNo} onSave={handleSavePrivilegeCard} />
      }
    </div>
  );
}

export default NewPatientEntry;
