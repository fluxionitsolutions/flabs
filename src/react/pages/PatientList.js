import React, { useState, useEffect } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from '../common/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, GET_BILLS_BYDATE } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';



const Patients = () => {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [bills, setBills] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);


  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  const handleClick = (id, edit, sequence) => {
    console.log('iddd', id, edit, sequence);
    navigate(`/resultentry/${id}/${edit}/${sequence}`);
  };
  

  useEffect(() => {
    getData(selectedDate);
  }, [selectedDate]);

  const getData = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_BILLS_BYDATE}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          '_date': date,
        },
      });

      if(response.status === 200){
        setLoading(false);
        setBills(response.data.data);
        console.log('hereee',response.data.data);
      } else {
        setLoading(false);
        setBills([]);
      }
    } catch (error) {
      setLoading(false);
      console.log('Failed to fetch patient data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  const handleNavigatiopn = () =>{
    navigate('/testentry');
  }

  return (
    <div className="flex h-screen bg-background">
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
      <LeftMenu isExpanded={isMenuExpanded} toggleMenu={toggleMenu} />
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
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
        <div className='p-4'>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-6">
              <button
                className={`text-sm ${filter === 'All' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setFilter('All')}
              >
                All Patients
              </button>
              <button
                className={`text-sm ${filter === 'Payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setFilter('Payment')}
              >
                Pending
              </button>
              <button
                className={`text-sm ${filter === 'Complete' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => navigate('/resultview')}
              >
                Completed
              </button>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 text-sm rounded-lg" onClick={handleNavigatiopn}>New Appoinment +</button>
          </div>
          <div className='w-full justify-between flex'>
            <div className="w-96 relative">
              <input
                type="text"
                placeholder="Search By Name"
                className="border rounded-lg w-full h-10 px-4 placeholder:text-sm mb-2"
              />
              <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="w-96">
              <input 
                type="date" 
                className="w-full p-2 border border-gray-100 rounded-lg bg-white placeholder:text-sm placeholder:text-gray-500"
                defaultValue={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-gray-500 text-sm text-left">BILL NO</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">CREATED</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">PATIENT</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">AGE</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">AMOUNT</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">PAYMENT STATUS</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">RESULT STATUS</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((row, index) => (
                <tr key={index}>
                  <td className="border-b p-2 text-gray-500 text-md cursor-pointer" onClick={() => handleClick(row?.InvoiceNo, row?.EditNo, row?.Sequence)}>{row.BillNo}</td>
                  <td className="border-b p-2">{row.Created_at}</td>
                  <td className="border-b p-2">{row.PatientName}</td>
                  <td className="border-b p-2">{row.Age}</td>
                  <td className="border-b p-2">{row.TotalAmount}</td>
                  <td className="border-b p-2">
                    <span className="flex items-center text-xs">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          row.PaymentStatus === 'Completed'
                            ? 'bg-green-600'
                            : row.PaymentStatus === 'Pending'
                            ? 'bg-red-600'
                            : 'bg-red-600'
                        }`}
                      ></span>
                      <span
                        className={`${
                          row.PaymentStatus === 'Completed'
                            ? 'text-green-600'
                            : row.PaymentStatus === 'Pending'
                            ? 'text-red-600'
                            : 'text-red-600'
                        }`}
                      >
                        {row.PaymentStatus}
                      </span>
                    </span>
                  </td>
                  <td className="border-b p-2">
                    <span className="flex items-center text-xs">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          row.ResultStatus === 'Completed'
                            ? 'bg-green-600'
                            : row.ResultStatus === 'Pending'
                            ? 'bg-red-600'
                            : 'bg-red-600'
                        }`}
                      ></span>
                      <span
                        className={`${
                          row.ResultStatus === 'Completed'
                            ? 'text-green-600'
                            : row.ResultStatus === 'Pending'
                            ? 'text-red-600'
                            : 'bg-red-600'
                        }`}
                      >
                        {row.ResultStatus}
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

export default withAuth(Patients);
