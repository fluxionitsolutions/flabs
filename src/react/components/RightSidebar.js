import React, { useState, useEffect } from 'react';
import { FaGreaterThan, FaLessThan } from "react-icons/fa6";
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, GET_BILLS_BYDATE } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { useNavigate } from 'react-router-dom';

const getDaysInMonth = (year, month) => {
  return new Array(31)
    .fill('')
    .map((_, i) => new Date(year, month, i + 1))
    .filter(date => date.getMonth() === month);
};

const getDaysAroundCurrent = (date) => {
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + i);
    days.push(newDate);
  }
  return days;
};

const getFirstWeek = (year, month) => {
  return new Array(7)
    .fill('')
    .map((_, i) => new Date(year, month, i + 1));
};

const RightSidebar = ({ onBillClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [showAllDays, setShowAllDays] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const daysAroundCurrent = getDaysAroundCurrent(selectedDate);
  const firstWeek = getFirstWeek(currentYear, currentMonth);

  const [bills, setBills] = useState([]);

  useEffect(() => {
    setSelectedDate(new Date(currentYear, currentMonth, selectedDate.getDate()));
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    getData(currentDate);
  }, []);

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
        setBills(response.data.data);
      } else {
        setBills([])
      }
    } catch (error) {
      console.log('Failed to fetch patient data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  
    // Manually format the date to 'YYYY-MM-DD' without time zone offset
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
  
    getData(formattedDate); // Call the API with the selected date
  };

  const handleMonthClick = () => {
    setShowAllDays(!showAllDays);
  };

  const handleBillClick = (bill) => {
    onBillClick(bill.InvoiceNo, bill.Sequence, bill.EditNo); // Pass both InvoiceNo and Sequence
  };
  
  const handleClick = (id, edit, sequence) => {
    navigate(`/testentry/${id}/${edit}/${sequence}`);
  };

  return (
    <div className="bg-white w-1/4 p-4 shadow-md h-screen flex flex-col">
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
      <Link to="/testentry">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
          + Create Appointment
        </button>
      </Link>
      <div className='mt-6 flex-shrink-0'>
        <div className="p-3 py-6 rounded-xl border-gray-100 border-2">
          <div className="flex justify-between items-center mb-4 pl-8 pr-8">
            <button onClick={handlePrevMonth}><FaLessThan size={13} color='blue' /></button>
            <div className="text-lg font-normal cursor-pointer" onClick={handleMonthClick}>
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </div>
            <button onClick={handleNextMonth}><FaGreaterThan size={13} color='blue' /></button>
          </div>
          <div className="grid grid-cols-7 gap-3">
            {(showAllDays ? daysInMonth : (currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) ? daysAroundCurrent : firstWeek).map(date => (
              <div
                key={date.toDateString()}
                onClick={() => handleDateClick(date)}
                className={`flex flex-col items-center justify-center w-10 h-12 rounded-xl cursor-pointer border-blue-500 border ${
                  selectedDate && selectedDate.toDateString() === date.toDateString() ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                }`}
              >
                <span>{date.getDate()}</span>
                <span className="text-xs text-gray-600 font-normal">{date.toLocaleDateString('default', { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-3 hide-scrollbar">
        <h2 className="text-xl mt-4">Appointments</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for patients ..."
            className="border rounded-lg w-full h-10 px-4 placeholder:text-sm mt-2 mb-4"
          />
          <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <div className="mt-2 space-y-2">
          {bills.map((row, index) => (
            <div className="flex justify-between items-center pb-4" key={index}>
              <div>
                <div className="font-bold">{row.PatientName}</div>
                <div className="text-sm text-gray-500 cursor-pointer" onClick={() => handleClick(row?.InvoiceNo, row?.EditNo, row?.Sequence)}>#{row.BillNo}</div>
              </div>

              {row.PaymentStatus ==="Completed" ? 
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-md cursor-pointer" onClick={() => handleBillClick(row)} key={index}>Completed</span>
                 :
                 <span className="bg-red-100 text-red-700 px-4 py-1 rounded-md cursor-pointer" onClick={() => handleBillClick(row)} key={index}>Payment</span>
              } 
            </div>
          ))}
        </div>
      </div>
      <button className="bg-white border-violet-400 border text-blue-700 px-4 py-2 rounded-lg w-full mt-4 flex-shrink-0">
        All Appointment
      </button>
    </div>
  );
};

export default RightSidebar;
