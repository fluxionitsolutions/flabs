import React, { useState } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from '../common/auth';
import LabDetails from '../components/Settings/LabDetails';
import Applicationsettings from '../components/Settings/ApplicationSettings';

const Settings = () => {
  const [filter, setFilter] = useState('labdetails');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };
  return (
    <div className="flex h-screen bg-background">
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
          <div className="">
            <div className=" space-x-6 ">
              <button
                className={`text-sm ${filter === 'labdetails' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 border-gray-400'}`}
                onClick={() => setFilter('labdetails')}
              >
                Lab Settings
              </button>
              <button
                className={`text-sm ${filter === 'application' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 border-gray-400'}`}
                onClick={() => setFilter('application')}
              >
                Application Settinigs
              </button>

              <button
                className={`text-sm ${filter === 'admin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 border-gray-400'}`}
                onClick={() => setFilter('admin')}
              >
                Admin Settings
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
          {filter === 'labdetails' ? (
            <LabDetails />
          ) : (
            <Applicationsettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Settings);
