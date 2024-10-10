import React, { useState, useEffect } from 'react';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import LeftMenu from '../components/LeftMenu';
import { FaRegCircleUser } from "react-icons/fa6";
import InvoiceDetails from '../components/InvoiceDetails';
import withAuth from '../common/auth';
import { useLocation } from 'react-router-dom';
import { BASE_URL, GET_PURCHASE_DETAILS } from '../utlilities/config';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';


const PurchaseDetails = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const location = useLocation();
  const { itemId, EditNo, Sequence } = location.state;
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');
  const [headData, setHeadData] = useState([]);
  const [items, setItems] = useState([]);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  useEffect(() => {
    getHeaderData();
  }, []);

  const getHeaderData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${GET_PURCHASE_DETAILS}`, {
        headers: {
          'XApiKey': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${token}`,
          sequence: Sequence,
          invoiceNo: itemId,
          editNo: EditNo,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setHeadData(response.data.data.purchaseHd[0])
        setItems(response.data.data.purchaseLn)
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex justify-between items-center">
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
        
        {/* Content section */}
        <div className="flex flex-grow overflow-hidden p-6 space-x-6">
            <InvoiceDetails className="flex-grow h-full overflow-auto" headData={headData} items={items} invoiceNo={itemId} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(PurchaseDetails);
