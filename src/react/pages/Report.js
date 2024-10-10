import React, { useState, useEffect, useRef } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import Select from 'react-select';
import { PiDownloadFill } from "react-icons/pi";
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { BASE_URL, GET_REPORT_HEADER, GET_SALES_REPORT } from '../utlilities/config';
import axios from 'axios';
import Card from '../components/Card';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import ReportTable from '../components/ReportTable';

const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '40px',
      height: '40px',
      fontSize: '14px',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0px 8px',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '30px',
    }),
    menu: (base) => ({
      ...base,
      fontSize: '14px',
    }),
  };
  
  function Report() {
    const [isMenuExpanded, setIsMenuExpanded] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('accessToken');
  
    const [reportType, setReportType] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [doctors, setDocotrs] = useState([]);
    const [lab, setLab] = useState([])
    const [tests, setTests] = useState([])
    const [groups, setGroups] = useState([])
  
    const [bills, setBills] = useState([]);
  
    const datePickerRef = useRef(null);
  
    useEffect(() => {
      getData();

      const handleClickOutside = (event) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
          setShowPicker(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);


    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}${GET_REPORT_HEADER}`, {
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (response.status === 200) {
          setDocotrs(response.data.data?.doctorMaster);
          setLab(response.data.data?.labMaster);
          setTests(response.data.data?.testMaster);
          setGroups(response.data.data?.testGroupMaster);

        } else {
          console.log('Failed to fetch data.');
        }
      } catch (error) {
        console.log('Failed to fetch data.', error);
      } finally {
        setLoading(false);
      }
    };
  
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
      
    ];
  
  
    const handleReportTypeChange = (selectedOption) => {
      setReportType(selectedOption);
      setSelectedCategory(null);
      setCategoryOptions([]);

      if (selectedOption.value === 'Bill Wise'){
      } else if(selectedOption.value === 'Test Wise'){
        setCategoryOptions(tests.map(item => ({ value: item.TestID, label: item.TestName })));
      } else if(selectedOption.value === 'Group Wise'){
        setCategoryOptions(groups.map(item => ({ value: item.GroupID, label: item.GroupName })));
      } else if(selectedOption.value === 'Lab Wise'){
        setCategoryOptions(lab.map(item => ({ value: item.LabID, label: item.LabName })));
      } else if(selectedOption.value === 'Doctor Wise'){
        setCategoryOptions(doctors.map(item => ({ value: item.DoctorID, label: item.DoctorName })));
      } else {
        setCategoryOptions([]);
      }
    };
  
    const handleCategoryChange = (selectedOption) => {
      setSelectedCategory(selectedOption);
    };


    const getReportData = async () => {
      setLoading(true);
      setBills([]);
  
      try {
        const formatDate = (date) => {
          return date.toLocaleDateString('en-CA');
        };
      
        const data = {
          fromDate: range ? formatDate(range[0].startDate) : '',  
          toDate: range ? formatDate(range[0].endDate) : '',
          pageNo: 1,
          pageSize: 1000,
          groupby: reportType?.value,
          searchKey: selectedCategory?.value || null
        };

        console.log('final data hereee', data)

        const response1 = await axios.post(`${BASE_URL}${GET_SALES_REPORT}`, data,{
          headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        });
        console.log(response1)
  
        if (response1.status === 200) {
          setLoading(false);
          console.log(response1.data)
          setBills(response1.data.data);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
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
      <div className="flex-1 flex flex-col overflow-hidden p-4 ">
        <div className="p-4  flex justify-between items-center">
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
        <div className="flex justify-between items-center ">
          
            <p className='text-xl font-bold ml-5'>Report</p>
          
        </div>
     <div>
        <div className="flex flex-row pl-4 overflow-hidden p-6 space-x-6">
          
            <Card
              title="Sales"
              head="235"
              description=" Up from yesterday"
            />
          
          
            <Card
              title="Revenue"
              head="₹ 4,56089"
              description=" Up from yesterday"
            />
         
          
            <Card
              title="Profit"
              head=" ₹ 1,25210"
              description=" Up from yesterday"
            />
          
         
            <Card
              title="Profit"
              head=" ₹ 1,25210"
              description=" Up from yesterday"
            />
          
        </div>

        <div>
       <div className='flex w-full items-center content-center'>
      
        <div className="flex justify-start  items-center p-3 ml-2 ">
          <div className="relative w-60" ref={datePickerRef}>
            <input
              type="text"
              readOnly
              value={range
                ? `${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`
                : 'Choose Date Range'}
              onClick={() => setShowPicker(!showPicker)}
              className="border h-10 p-2 rounded w-full cursor-pointer"
            />
            {showPicker && (
              <div className="absolute left bg-white border shadow-lg rounded mt-2 p-3 ">
                <div className="flex">
                  <div className="flex flex-col space-y-3 w-20">
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
                    ranges={range}
                    months={1}
                    direction="horizontal"
                    className="rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

            <div className='flex flex-row w-1/2 ml-0'>
              <Select
                placeholder="Report Type"
                options={[
                  { value: '', label: 'Choose Report Type' },
                  { value: 'Bill Wise', label: 'Bill Wise' },
                  { value: 'Test Wise', label: 'Test Wise' },
                  { value: 'Group Wise', label: 'Group Wise' },
                  { value: 'Doctor Wise', label: 'Doctor Wise' },
                  { value: 'Lab Wise', label: 'Lab Wise' }
                ]}
                className="w-full"
                styles={customSelectStyles}
                onChange={handleReportTypeChange}
              />
              <Select
                placeholder="Category"
                value={selectedCategory}
                options={categoryOptions}
                className="w-full ml-2"
                styles={customSelectStyles}
                onChange={handleCategoryChange}
                isDisabled={!reportType || categoryOptions.length === 0}
              />
            </div>
          
        </div>

        </div>
        
        <div className='flex justify-between gap-5 pr-1 '>
        <button
          className={`w-24 mr-4 -mt-12 h-10 ${(!range || (!selectedCategory && reportType?.value !== 'Bill Wise')) ? 'bg-gray-400 cursor-not-allowed' : 'bg-btnblue cursor-pointer'} text-white border border-gray-200 rounded-xl ml-auto`}
          disabled={!range || (!selectedCategory && reportType?.value !== 'Bill Wise')}
          onClick={getReportData}
        >
          Create
        </button>

        </div>
      </div>
      <div className='h-full overflow-auto hide-scrollbar'>
        <ReportTable bills={bills} />
      </div>
  
   </div>
  
  </div>
   
    
  );
}

export default Report;
