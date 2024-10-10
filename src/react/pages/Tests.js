// Tests.js
import React, { useState, useEffect } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosArrowDropright, IoIosArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import withAuth from '../common/auth';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import 'react-toastify/dist/ReactToastify.css';
import { spinnerStyles, overlayStyles } from '../common/style';
import { BASE_URL, GET_TEST, GET_GROUP, GET_ITEM } from '../utlilities/config';
import AddTestModal from '../components/testmodal/AddTestModal';
import AddGroupModal from '../components/testmodal/AddGroupModal';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const Tests = () => {
  const [filter, setFilter] = useState('Tests');
  const [expandedRows, setExpandedRows] = useState([]);
  const token = localStorage.getItem('accessToken');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageno, setPageno] = useState(1);
  const [pagesize, setPagesize] = useState(1000);
  const [tests, setTests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState(null);

  const [testhasNextpage, setTestHasNextPage] = useState(false)
  const [grouphasNextpage,  setGroupHasNextPage] = useState(false)

  const [testhasPrevpage, setTestHasPrevPage] = useState(false)
  const [grouphasPrevpage,  setGroupHasPrevPage] = useState(false)
  

  useEffect(() => {
    getData();
    getGroupData();
  }, []);


  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_TEST}`, {
        headers: {
          'TenantName': 'Abcd',
          'PageNo': pageno,
          'PageSize': pagesize,
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200 ) {
        setLoading(false);
        console.log(response.data.data.masterData)
        setTests(response.data.data.masterData);

        if(response.data.data.pageContex[0].HasNext){
          setTestHasNextPage(true)
        } else {
          setTestHasNextPage(false)
        }
        if(response.data.data.pageContex[0].HasPrevious){
          console.log('Prev test page have')
          setTestHasPrevPage(true)
        } else{
          setTestHasPrevPage(false)
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getGroupData = async () => {
    setLoading(true);
    try {
      const response1 = await axios.get(`${BASE_URL}${GET_GROUP}`, {
        headers: {
          'TenantName': 'Abcd',
          'PageNo': pageno,
          'PageSize': pagesize,
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response1.status === 200) {
        setLoading(false);
        setGroups(response1.data.data.groups);

        if(response1.data.data.pageContex[0].HasNext){
          setGroupHasNextPage(true)
        } else {
          setGroupHasNextPage(false)
        }
        if(response1.data.data.pageContex[0].HasPrevious){
          setGroupHasPrevPage(true)
        } else {
          setGroupHasPrevPage(false)
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getTestData = async () => {
    setLoading(true);
    try {
      const new_response = await axios.get(`${BASE_URL}${GET_TEST}`, {
        headers: {
          'TenantName': 'Abcd',
          'PageNo': pageno+1,
          'PageSize': pagesize,
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (new_response.status === 200) {
        setLoading(false);
        console.log('newww',new_response.data.data)
        setTests(new_response.data.data.masterData);

        if(new_response.data.data.pageContex[0].HasNext){
          console.log('next test page have')
          setTestHasNextPage(true)
        } else{
          setTestHasNextPage(false)
        }

        if(new_response.data.data.pageContex[0].HasPrevious){
          console.log('Prev test page have')
          setTestHasPrevPage(true)
        } else{
          setTestHasPrevPage(false)
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  const handleTestPrev = () => {
    if(testhasPrevpage){
      console.log('call in Test Prev')
    }
  }

  const handleTestNext = () => {
    if(testhasNextpage){
      console.log('call in Test Next')
      getTestData();
    }
  }

  const handleRowClick = (grpid) => {
    console.log('hereee', grpid)
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(grpid)
        ? prevExpandedRows.filter(id => id !== grpid)
        : [...prevExpandedRows, grpid]
    );
  };


  const handleClick = () => {
    if (filter === 'Tests') {
      setShowModal(true);
    } else {
      setShowModal1(true);
    }
  };


  const handleEditClick = (id) => {
    setSelectedTestId(id);
    setShowModal(true);
  };

  const handleEdit = (groupsID) => {
    console.log('heree',groupsID);
    setSelectedGroups(groupsID);
    setShowModal1(true);
  };

  const renderRowDetails = (tests) => {
    return tests.map((testid, index) => (
      <tr key={index}>
        <td className="pl-20 text-black text-sm"></td>
        <td className="p-2 text-black text-sm">{testid.testName}</td>
        <td className="p-2 text-black text-sm">{testid.section}</td>
        <td className="p-2 text-black text-sm">{testid.rate}</td>
        <td className="p-2 text-black text-sm">{testid.unit}</td>
        <td className="p-2 text-black text-sm flex w-52">{testid.normalRange}</td>
      </tr>
    ));
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
                className={`text-sm ${filter === 'Tests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setFilter('Tests')}
              >
                Tests
              </button>
              <button
                className={`text-sm ${filter === 'Groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setFilter('Groups')}
              >
                Groups
              </button>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 text-sm rounded-lg" onClick={handleClick}>Add new +</button>
          </div>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search By Name"
              className="border rounded-lg w-full h-10 px-4 placeholder:text-sm mb-2"
            />
            <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        <div className="bg-white pb-44 rounded-xl shadow-lg w-full h-full flex flex-col hide-scrollbar">
          {filter === 'Tests' ? (
            <div className="flex-grow overflow-auto">
            <div style={{ overflowX: 'auto' }}>
              <table className="w-full border-collapse table-fixed">
                <thead className="bg-gray-300 sticky top-0">
                  <tr>
                    {/* Apply 12% width to all table headers */}
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '20%' }}>Name</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '15%' }}>Section</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Rate</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>T.Code</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Unit</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '20%' }}>Normal Value</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Method</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '8%' }}>L.Val</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '8%' }}>H.Val</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Specimen</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Reagent</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Usage</th>
                    <th className="border-b pl-3 p-2 text-left text-black font-normal text-sm" style={{ width: '12%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((row, index) => (
                    <tr key={index}>
                      <td className="border font-normal text-xs p-1" style={{ width: '20%' }}>{row?.TestName}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '15%' }}>{row?.SectionName}</td>
                      <td className="border font-normal p-1 text-xs" style={{ width: '12%' }}>{row?.Rate}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.TestCode}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.Unit}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '20%' }}>{row?.NormalRange}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.Methord}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.LowValue}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.HighValue}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.Speciman}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.ItemName}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>{row?.Min_ReAgentValue}{row.MinReagentUnit}</td>
                      <td className="border font-normal text-xs p-1" style={{ width: '12%' }}>
                        <div className="flex flex-row gap-3">
                          <span className="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-lg cursor-pointer">
                            <CiEdit size={10} color="orange" onClick={() => handleEditClick(row?.ID)} />
                          </span>
                          <span className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-lg cursor-pointer">
                            <MdDelete size={10} color="red" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          ) : (
            <div className="flex-grow overflow-auto">
              <table className="w-full border-collapse">
                <thead className='bg-gray-300 sticky top-0'>
                  <tr>
                    <th className="border-b text-black text-sm font-normal text-left"></th>
                    <th className="border-b p-2 text-black text-sm font-normal text-left">Sl No</th>
                    <th className="border-b p-2 text-left text-black font-normal text-sm">NAME</th>
                    <th className="border-b p-2 text-left text-black font-normal text-sm">CODE</th>
                    <th className="border-b p-2 text-left text-black font-normal text-sm">SECTION</th>
                    <th className="border-b p-2 text-left text-black font-normal text-sm">RATE</th>
                    <th className="border-b p-2 text-left text-black font-normal text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((row, index) => (
                    <React.Fragment key={row.groupID}>
                      <tr>
                        <td className="border-b font-normal text-sm p-2">
                          {expandedRows.includes(row.groupID) ? (
                            <IoIosArrowDropdown size={20} color='gray' onClick={() => handleRowClick(row.groupID)} />
                          ) : (
                            <IoIosArrowDropright size={20} color='gray' onClick={() => handleRowClick(row.groupID)} />
                          )}
                        </td>
                        <td className="border-b p-2 text-black text-md">{index + 1}</td>
                        <td className="border-b font-normal text-sm p-2">{row.groupName}</td>
                        <td className="border-b font-normal text-sm p-2">{row.groupCode}</td>
                        <td className="border-b font-normal text-sm p-2">{row.section}</td>
                        <td className="border-b font-normal text-sm p-2">{row.rate}</td>
                        <td className="border-b font-normal text-sm p-2 flex flex-raw gap-3">
                          <span className="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-lg">
                            <CiEdit size={15} onClick={() => handleEdit(row?.groupID)} color='orange' />
                          </span>
                          <span className="flex items-center justify-center w-6 h-6 bg-red-200 rounded-lg">
                            <MdDelete size={15} color='red' />
                          </span>
                        </td>
                      </tr>
                      {expandedRows.includes(row.groupID) && (
                        <tr>
                          <td colSpan="7">
                            <table className="w-full overflow-hidden border-collapse">
                              <thead className='w-full sticky top-0'>
                                <tr>
                                <td className="font-normal text-sm p-2"></td>
                                  <td className="border-b font-semibold text-sm p-2">Test Name</td>
                                  <td className="border-b font-semibold text-sm p-2">Section</td>
                                  <td className="border-b font-semibold text-sm p-2">Rate</td>
                                  <td className="border-b font-semibold text-sm p-2">Unit</td>
                                  <td className="border-b font-semibold text-sm p-2">Normal Value</td>
                                </tr>
                              </thead>
                              <tbody>
                                {renderRowDetails(row.tests)}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        <div className='flex justify-end p-4 bg-transparent'>
          <div className='flex gap-1'>
            <span className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-md cursor-pointer" >
              <GrFormPrevious size={15} color='black' />
            </span>
            <span className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-md">{pageno}</span>
            <span className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-md cursor-pointer" >
              <MdNavigateNext size={15} color='black' />
            </span>
          </div>
        </div>
      </div>
      </div>
      {showModal && 
        <AddTestModal setShowModal={setShowModal} refreshData={getData} iD={selectedTestId} />
      }
      {showModal1 && 
        <AddGroupModal setShowModal1={setShowModal1} tests={tests} getGroupData={getGroupData} groupsID={selectedGroups} />
      }
    </div>
  );
};
export default withAuth(Tests);
