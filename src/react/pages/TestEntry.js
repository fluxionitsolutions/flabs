import React, { useState } from 'react';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import LeftMenu from '../components/LeftMenu';
import { FaRegCircleUser } from "react-icons/fa6";
import NewPatientEntry from '../components/NewPatientEntry';
import withAuth from '../common/auth';


const TestEntry = () => {

  return (
    <div className="flex h-screen bg-background">
      <LeftMenu />
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
          <NewPatientEntry className="flex-grow h-full overflow-auto" />
        </div>
      </div>
    </div>
  );
};

export default withAuth(TestEntry);
