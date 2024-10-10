import React from 'react';
import OverviewCard from './OverViewCard';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { FiUsers } from "react-icons/fi";
import { CiClock2 } from "react-icons/ci";

const UserMainContent = () => {

  return (
    <div className="p-4 w-auto space-y-4 overflow-y-auto hide-scrollbar">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard 
          title="Total Patients" 
          value="140" 
          change="1.8% Up from yesterday" 
          icon={<FiUsers size={25} color='blue' />}
          bgColor="bg-white" 
          bgColor1="bg-blue-50" 
        />
        <OverviewCard 
          title="Pending" 
          value="56" 
          additionalInfo="50 Normal, 6 Emergency" 
          icon={<CiClock2 size={25} color='red'/>}
          bgColor="bg-white"
          bgColor1="bg-pink-50"
        />
        <OverviewCard 
          title="Completed" 
          value="84" 
          additionalInfo="75% completed" 
          icon={<FaRegSquareCheck size={25} color='green' />}
          bgColor="bg-white"
          bgColor1="bg-green-50"
        />
      </div>

      {/* Adjusted layout for Expiry List and Shortcuts */}
      <div className="flex flex-row gap-5">

        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar w-2/3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Near Expiry</h2>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-gray-500 text-sm text-left">Batch</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">Reagent</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">Exp</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b p-2 text-gray-500 text-sm cursor-pointer" >#00152</td>
                <td className="border-b p-2 text-sm">Reagent 1</td>
                <td className="border-b p-2 text-sm">18/08/2023</td>
                <td className="border-b p-2 text-sm">150 ml</td>
              </tr>
              <tr>
                <td className="border-b p-2 text-gray-500 text-sm cursor-pointer" >#00152</td>
                <td className="border-b p-2 text-sm">CRP Card</td>
                <td className="border-b p-2 text-sm">18/08/2023</td>
                <td className="border-b p-2 text-sm">25 nos</td>
              </tr>
            </tbody>
          </table>
        </div>


        {/* Favorite Shortcuts */}
        <div className='p-4 rounded-2xl shadow bg-white w-1/3'>
          <div className='flex flex-col gap-2'>
            <p className="text-xl font-semibold text-gray-700">Favorite shortcuts</p>
            <div className='grid grid-cols-2 gap-3'>
              <div className='bg-gray-200 rounded-lg w-auto p-2 text-xs font-normal'>
                New Appointment ctrl+N
              </div>
              <div className='bg-gray-200 rounded-lg w-auto p-2 text-xs font-normal'>
                Patients list F10
              </div>
              <div className='bg-gray-200 rounded-lg w-auto p-2 text-xs font-normal'>
                Create Test ctrl+C
              </div>
              <div className='bg-gray-200 rounded-lg w-auto p-2 text-xs font-normal'>
                Test List F11
              </div>
              <div className='bg-gray-200 rounded-lg w-auto p-2 text-xs font-normal'>
                Print F10
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserMainContent;
