import React, { useState, useEffect } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from '../common/auth';
import NewCard from '../components/previlagecard/NewCard';
import axios from 'axios';
import { GET_PRIVILAGE_CARD, BASE_URL, GET_PRIVILAGE_HEAD, POST_PRIVILAGE_CARD_PRICING } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const PrivilageCard = () => {
  const [loading, setLoading] = useState(false);
  const [cardHeaders, setCardHeaders] = useState([]);
  const [testData, setTestData] = useState([]);
  const [discountData, setDiscountData] = useState({});
  const [cardModal, setCardModal] = useState(false);
  const [initialDiscountData, setInitialDiscountData] = useState({});


  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchHeaderData();
    fetchPrivilegeCard();
  }, []);


  useEffect(() => {
    if (cardHeaders.length > 0 && testData.length > 0) {
      initializeDiscountData(testData);
    }
  }, [cardHeaders, testData]);

  const fetchHeaderData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${GET_PRIVILAGE_HEAD}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        setCardHeaders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching header data:', error);
    }
  };

  const fetchPrivilegeCard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${GET_PRIVILAGE_CARD}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        setTestData(response.data.data || []);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching privilege card data:', error);
    }
  };

  const initializeDiscountData = (testData) => {
    const initialData = {};
    
    testData.forEach(test => {
      cardHeaders.forEach(card => {
        const cardName = card.CardName;
        const key = `${card.CardID}_${test['Test ID']}`;
        initialData[key] = {
          CardID: card.CardID,
          TestID: test['Test ID'],
          Discount: test[cardName] !== null ? test[cardName] : 0
        };
      });
    });
  
    // Set both initial data and discount data
    setDiscountData(initialData);
    setInitialDiscountData(initialData);
  };
  
  
  
  
  const handleDiscountChange = (cardID, testID, value) => {
    const key = `${cardID}_${testID}`;
    console.log('Updating data for:', key); // Debug log
    setDiscountData(prevData => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        Discount: parseFloat(value)
      }
    }));
  };
  
  const handleSave = async () => {
    // Create a new object with only the changed data
    const changedData = Object.keys(discountData).filter(key => {
      // Compare the current discount with the initial value
      return discountData[key].Discount !== initialDiscountData[key].Discount;
    }).map(key => {
      const [cardID, testID] = key.split('_');
      return {
        CardID: parseInt(cardID, 10),
        TestID: parseInt(testID, 10),
        Discount: discountData[key].Discount,
      };
    });
  
    // Only send the changed data
    const postData = {
      PrivilegeCardsRates: changedData
    };
  
    console.log('Changed Data to post:', JSON.stringify(postData)); 
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}${POST_PRIVILAGE_CARD_PRICING}`, postData, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status === 200) {
        setLoading(false);
        toast.success('Updated Successfully', {
          duration: 3000,
        });
        fetchHeaderData();
        fetchPrivilegeCard();
      }
    } catch (error) {
      setLoading(false);
      toast.error('Something Went Wrong', {
        duration: 3000,
      });
      console.error(error);
    }
  };
  
  

  return (
    <div className="flex h-screen bg-background">
      <LeftMenu/>
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

        <div className='pl-5 pr-5 pb-3'>
          <h2 className="text-md font-semibold mb-4">Privilage Card Management</h2>
          <div className="flex justify-between items-center mb-4">
            <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg" onClick={() => setCardModal(true)}>Add new Card</button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-md font-normal">Teir Pricing</p>
            <button className="bg-white border-blue-600 border-2 text-black px-5 py-1 text-sm rounded-lg" onClick={handleSave}>Save</button>
          </div>
        </div>
        <div className="relative w-96 ml-5">
          <input
            type="text"
            placeholder="Search By Name"
            className="border rounded-lg w-full h-10 px-4 placeholder:text-sm mb-2"
          />
          <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <div className="pl-5 pr-5 pb-5 overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
  <div className="bg-white rounded-lg shadow-md p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
    <table className="w-full border-collapse min-w-full">
      <thead>
        <tr>
          <th className="border-b p-2 text-gray-500 text-sm text-left">TEST ID</th>
          <th className="border-b p-2 text-left text-gray-500 text-sm" style={{ width: '250px' }}>TEST NAME</th>
          <th className="border-b p-2 text-left text-gray-500 text-sm" style={{ width: '150px' }}>SECTION</th>
          <th className="border-b p-2 text-left text-gray-500 text-sm">RATE</th>
          {cardHeaders.map(card => (
            <th key={card.CardID} className="border-b p-2 text-left text-gray-500 text-sm">
              {card.CardName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {testData.map(test => (
          <tr key={test['Test ID']}>
            <td className="border-b p-2 text-gray-500 text-md">{test['Test ID']}</td>
            <td className="border-b p-2 text-sm" style={{ width: '250px' }}>{test['Test Name']}</td>
            <td className="border-b p-2 text-sm" style={{ width: '150px' }}>{test.Section}</td>
            <td className="border-b p-2 text-sm pr-10">{test.Rate}</td>
            {cardHeaders.map(card => (
              <td key={`${card.CardID}_${test['Test ID']}`} className="border-b p-2 text-sm">
                <input
                  type="number"
                  className="border rounded-lg w-full h-10 px-4 placeholder:text-sm"
                  value={discountData[`${card.CardID}_${test['Test ID']}`]?.Discount || ''}
                  onChange={(e) => handleDiscountChange(card.CardID, test['Test ID'], e.target.value)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
      {cardModal &&
        <NewCard setCardModal={setCardModal} fetchData={fetchHeaderData} fetchData1={fetchPrivilegeCard} />
      }
    </div>
    
  );
};

export default withAuth(PrivilageCard);
