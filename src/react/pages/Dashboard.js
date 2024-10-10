import React, { useState } from 'react';
import MainContent from '../components/MainContent';
import LeftMenu from '../components/LeftMenu';
import RightSidebar from '../components/RightSidebar';
import BillPayment from '../components/BillPayment';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import withAuth from '../common/auth';

const Dashboard = () => {
  // const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [editNo,  setEditNo]  = useState(null)
  // const toggleMenu = () => {
  //   if(isMenuExpanded==! setIsMenuExpanded){
  //     setIsMenuExpanded(true);  
  //   }else if(isMenuExpanded == setIsMenuExpanded){
  //     setIsMenuExpanded(false)
  //    } else{
  //       setIsMenuExpanded(false)
  //     }
  //   }
  const handleBillClick = (billNumber, sequence, editNumber) => {
    setSelectedBill(billNumber); // Set the selected bill
    setSelectedSequence(sequence); // Set the selected sequence
    setEditNo(editNumber);
  };
  return (
    <div className="flex h-screen bg-background">
      <LeftMenu  />
      <div className={`flex-1 flex flex-col transition-all duration-300 `}>
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
              <CiSettings size={19} color='grey' />
            </div>
            <div className="p-3 rounded-full bg-white">
              <IoMdNotificationsOutline size={19} color='grey' />
            </div>
          </div>
        </div>
        {selectedBill ? <BillPayment billNumber={selectedBill} sequence={selectedSequence} editNumber={editNo} /> : <MainContent />}
      </div>
      <RightSidebar onBillClick={handleBillClick} />
    </div>
  );
};
export default withAuth(Dashboard);
