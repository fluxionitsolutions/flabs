import React, { useState, useEffect } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from '../common/auth';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, INVOICE_TEST_DETAILS, POST_INVOICE_RERSULT } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { useNavigate } from 'react-router-dom';

const ResultEntryPage = () => {
  const { id, edit, sequence } = useParams();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [results, setResults] = useState({});
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  useEffect(() => {
    getData();
  }, []);

  const getItemsWithNewPage = () => {
    let newPageItems = [];
    let currentGroup = null;
  
    testData.forEach((item) => {
      if (item.LableType === 'Group' && item.Action === 'new-page') {
        currentGroup = item;
        newPageItems.push(item);
      }
  
      if (item.LableType === 'Item' && item.SI_No === currentGroup?.SI_No && item.Action !== 'hide') {
        newPageItems.push(item);
      }
  
      if (item.LableType === 'Item' && item.Action === 'new-page') {
        newPageItems.push(item);
      }
    });
  
    return newPageItems;
  };

  const handleNavigatiopn = () => {
    const newPageItems = getItemsWithNewPage();
  
    const remainingTestData = testData.filter(
      (item) => !newPageItems.some((newItem) => newItem.ID === item.ID) && 
      item.Action !== 'hide'
    );
  
    navigate(`/resultview`, {
      state: { newPageItems, remainingTestData, id, edit, sequence, patientData },
    });
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${INVOICE_TEST_DETAILS}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          '_sequence': sequence,
          'invoiceNo': id,
          'editNo': edit,
        },
      });
  
      if (response.status === 200) {
        let fetchedTestData = response.data.data.testData;
        let fetchedPatientData = response.data.data.patientData[0];
  
        const sortedTestData = sortTestData(fetchedTestData);
        setTestData(sortedTestData);
        setPatientData(fetchedPatientData);
      } else {
        console.log('Failed to fetch data.');
      }
    } catch (error) {
      console.log('Failed to fetch data.', error);
    } finally {
      setLoading(false);
    }
  };
  
  


  const sortTestData = (testData) => {
    
    const preferredSections = ["Hematology", "Microbiology", "Urinalysis"];
  
    let sortedTestData = [];
  
    testData.sort((a, b) => {
      const aSectionIndex = preferredSections.indexOf(a.TestSection);
      const bSectionIndex = preferredSections.indexOf(b.TestSection);
  
      if (aSectionIndex !== -1 && bSectionIndex !== -1) {
        return aSectionIndex - bSectionIndex;
      }
  
      if (aSectionIndex !== -1) return -1;
      if (bSectionIndex !== -1) return 1;
  
      return 0;
    });
  
    let groupMap = new Map();
  
    testData.forEach((item) => {
      if (!groupMap.has(item.SI_No)) {
        groupMap.set(item.SI_No, []);
      }
      groupMap.get(item.SI_No).push(item);
    });
  
    groupMap.forEach((items) => {
      const group = items.find(item => item.LableType === 'Group');
      
      if (group) {
        sortedTestData.push(group);
  
        items.forEach((item) => {
          if (item.LableType === 'Item') {
            sortedTestData.push(item);
          }
        });
      } else {
        sortedTestData.push(...items);
      }
    });
  
    return sortedTestData;
  };

  const handleInputChange = (testId, testName, value, action) => {
    console.log(`Input change for Test ID: ${testId}, Action: ${action}, Value: ${value}`);
    setResults(prevState => ({
      ...prevState,
      [testId]: {
        Name: testName,
        Values: value,
        Action: action || prevState[testId]?.Action || 'None',
        Comments: prevState[testId]?.Comments || 'No Comments',
      }
    }));
  };
  

  const handleSave = async () => {
    setLoading(true);
    try {
      const formattedResults = {
        Results: Object.keys(results).map(testId => ({
          ID: testId,
          Name: results[testId].Name,
          Values: results[testId].Values,
          Comments: results[testId].Comments || 'No Comments',
          Action: results[testId].Action || 'None', // Include the action here
        }))
      };
  
      const result_response = await axios.post(`${BASE_URL}${POST_INVOICE_RERSULT}`, formattedResults, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          'InvoiceNo': id,
          'Sequence': sequence,
          'EditNo': edit
        },
      });

      if (result_response.status === 200) {
        setLoading(false);
        getData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('Failed to post data.', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTableRows = () => {
    let rows = [];
    let currentGroup = null;

    testData.forEach((item) => {
      if (item.LableType === 'Group') {
        currentGroup = item;
        rows.push(
          <tr key={`group-${item.SI_No}`} className="bg-green-200">
            <td className="text-black text-sm pl-2">{item.Name}</td>
            <td className="border-b  text-sm"></td>
            <td className="border-b pl-2 text-sm">
              <select className="border border-gray-300 p-1 w-32"
                defaultValue={item?.Action}
                onChange={(e) => handleInputChange(item.ID, item.Name, item?.Value, e.target.value)}>
                <option value="">Select Action</option>
                <option value="bold">Bold</option>
                <option value="new-page">New Page</option>
                <option value="hide">Hide Item</option>
                <option value="add-comment">Add Comment</option>
              </select>
            </td>
            <td className="border-b p-2 text-sm"></td>
            <td className="border-b p-2 text-sm"></td>
            <td className="border-b p-2 text-sm"></td>
          </tr>
        );
      }

      if (item.LableType === 'Item') {
        if (currentGroup && item.SI_No === currentGroup.SI_No) {
          rows.push(
            <tr key={`item-${item.ID}`}>
              <td className="border-b p-2 text-sm pl-7">{item.Name}</td>
              <td className="border-b p-2 text-sm">
                <input
                  type="text"
                  defaultValue={item?.Value}
                  className="w-20 border border-gray-300 p-1"
                  onChange={(e) => handleInputChange(item.ID, item.Name, e.target.value)}
                />
              </td>
              <td className="border-b p-2 text-sm">
                <select className="border border-gray-300 p-1 w-32"
                  defaultValue={item?.Action}
                  onChange={(e) => handleInputChange(item.ID, item.Name, item?.Value, e.target.value)}>
                  <option value="">Select Action</option>
                  <option value="bold">Bold</option>
                  <option value="new-page">New Page</option>
                  <option value="hide">Hide Item</option>
                  <option value="add-comment">Add Comment</option>
                </select>
              </td>
              <td className="border-b p-2 text-sm">mg/dl</td>
              <td className="border-b p-2 text-sm">Adult: 120-140 , Child: 130-150</td>
              <td className="border-b p-2 text-sm">Looks Normal</td>
            </tr>
            
          );
        } else {
          currentGroup = null;
          rows.push(
            <tr key={`single-item-${item.ID}`}>
              <td className="border-b p-2 text-sm">{item.Name}</td>
              <td className="border-b p-2 text-sm">
                <input
                  type="text"
                  defaultValue={item?.Value}
                  className="w-20 border border-gray-300  p-1"
                  onChange={(e) => handleInputChange(item.ID, item.Name, e.target.value)}
                />
              </td>
              <td className="border-b p-2 text-sm">
                <select className="border border-gray-300 p-1 w-32"
                  defaultValue={item?.Action}
                  onChange={(e) => handleInputChange(item.ID, item.Name, item?.Value, e.target.value)}>
                  <option value="">Select Action</option>
                  <option value="bold">Bold</option>
                  <option value="new-page">New Page</option>
                  <option value="hide">Hide Item</option>
                  <option value="add-comment">Add Comment</option>
                </select>
              </td>
              <td className="border-b p-2 text-sm">mg/dl</td>
              <td className="border-b p-2 text-sm">Adult: 120-140 , Child: 130-150</td>
              <td className="border-b p-2 text-sm">Looks Normal</td>
            </tr>
          );
        }
      }
    });

    return rows;
  };
  

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
        <div className='flex justify-between gap-4 w-full' style={{ height: 'calc(100%)' }}>
          <div className="bg-white pb-20 rounded-lg shadow-md p-4 overflow-auto hide-scrollbar w-full" style={{ height: 'calc(100%)' }}>
            <table className="w-full">             
              <thead>
                <tr>
                  <th className="border-b p-2 text-left text-gray-500 text-sm">TEST NAME</th>
                  <th className="border-b p-2 text-left text-gray-500 text-sm">VALUE</th>
                  <th className="border-b p-2 text-left text-gray-500 text-sm">ACTION</th>
                  <th className="border-b p-2 text-left text-gray-500 text-sm">UNIT</th>
                  <th className="border-b p-2 text-left text-gray-500 text-sm">NORMAL RANGE</th>
                  <th className="border-b p-2 text-left text-gray-500 text-sm">COMMENTS</th>
                </tr>
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar w-fit" style={{ height: 'calc(100%)' }}>
            <div className="pl-3 pr-3 flex flex-col gap-5 pt-5">
              <div className="w-full flex justify-between">
                  <div className="w-44 flex flex-col gap-1">
                      <p className="text-sm">Invoice No.</p>
                      <p className="text-sm">Name</p>
                      <p className="text-sm">Age/Gender</p>
                      <p className="text-sm">Referred By</p>
                      <p className="text-sm">Corporate</p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                      <p className="text-sm"> : {id}</p>
                      <p className="text-sm"> : {patientData?.PatientName}</p>
                      <p className="text-sm"> : {patientData?.Age} Years / {patientData?.Gender}</p>
                      <p className="text-sm"> : {patientData?.DoctorName}</p>
                      <p className="text-sm"> : {patientData?.LabName}</p>
                  </div>
              </div>
              <div className="w-full flex justify-between">
                  <div className="w-64 flex flex-col gap-1">
                      <p className="text-sm">Patient ID</p>
                      <p className="text-sm">Sample Received On</p>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                      <p className="text-sm"> : PB-1024</p>
                      <p className="text-sm"> : {patientData?.CreatedDate}</p>
                  </div>
              </div>
            </div>

            <div className='flex mt-10 w-full gap-5 justify-center'>
              <div className='w-32 h-9 rounded-lg bg-btnblue flex justify-center content-center items-center cursor-pointer' onClick={handleSave}>
                  <p className='text-white text-md'>Save</p>
              </div>

              <div className='w-32 h-9 rounded-lg bg-btnblue flex justify-center content-center items-center cursor-pointer'>
                  <p className='text-white text-md'>Verify</p>
              </div>
            </div>
            <div className='flex mt-5 w-full gap-5 justify-center items-center'>
              <div className='w-1/2 h-9 rounded-lg bg-btnblue flex justify-center content-center items-center cursor-pointer' onClick={handleNavigatiopn}>
              <p className='text-white text-md'>View Report</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ResultEntryPage);
