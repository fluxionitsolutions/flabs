import React, {useState} from 'react';
import OverviewCard from './OverViewCard';
import Chart from './Chart';
import { FaRegSquareCheck } from 'react-icons/fa6';
import { FiUsers,FiPieChart } from "react-icons/fi";
import { CiClock2 } from "react-icons/ci";
import { IoBarChartOutline } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";
import { RiMoneyRupeeCircleLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { PiNote } from "react-icons/pi";

const MainContent = () => {
  const [showAll, setShowAll] = useState(false);

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
        {/* Add more OverviewCard components as needed */}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => setShowAll(!showAll)} 
          className="p-2 rounded-full bg-blue-500 text-white">
          {showAll ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
        </button>
      </div>

      <div className={`transition-all duration-500 ${showAll ? 'blur-none' : 'blur-sm opacity-20 pointer-events-none'}`}>

        <div className='flex justify-between h-72'>
          <div className="w-3/5 mr-3 h-full">
            <Chart />
          </div>
          <div className='flex flex-col h-full space-y-4 flex-grow'>
            <div className='flex gap-3 flex-1 h-1/2 justify-between w-full'>
              <div className='p-4 w-1/2 rounded-2xl shadow bg-blue-600 h-full'>
                <div>
                  <div className="flex justify-between items-center mb-4 gap-3">
                    <div className={`px-3 py-3 rounded-xl bg-white`}>
                      <FiPieChart size={25} color='blue' />
                    </div>
                    <h2 className="text-white font-semibold">Profit 30%</h2>
                  </div>
                  <p className="text-lg font-semibold text-white">₹ 200K</p>
                  <p className="text-sm text-white mt-1">This month</p>
                </div>
              </div>
              <div className='p-4 w-1/2 rounded-2xl shadow bg-black'>
                <div>
                  <div className="flex justify-between items-center mb-4 gap-3">
                    <div className={`px-3 py-3 rounded-xl bg-white`}>
                      <IoBarChartOutline size={25} color='black' />
                    </div>
                    <h2 className="text-white font-semibold">Loss 2%</h2>
                  </div>
                  <p className="text-lg font-semibold text-white">₹ 989K</p>
                  <p className="text-sm text-white mt-1">Last month</p>
                </div>
              </div>
            </div>
            <div className='p-3 rounded-2xl h-1/2 shadow bg-white flex-1'>
              <div>
                <div className="flex justify-between items-center mb-4 gap-3">
                  <h2 className="text-black text-lg font-normal">Total Tests</h2>
                  <GiProgression size={32} color='green' />
                </div>
                <p className="text-md font-semibold text-black">7,850</p>
                <p className="text-sm text-black mt-1">This month</p>
              </div>
            </div>
          </div>  
        </div>

      </div>

      <div className={`transition-all duration-500 ${showAll ? 'blur-none' : 'blur-sm opacity-20 pointer-events-none'}`}>

        <div className='flex justify-between gap-3'>
          <div className='flex flex-col gap-3'>
            <div className='p-4 rounded-2xl shadow bg-white flex-1'>
              <div>
                <p className="text-black mt-1">Purchase This month</p>
                <p className="text-xl font-semibold text-black">7,850</p>
              </div>
            </div>
            <div className='p-4 rounded-2xl shadow bg-white flex-1'>
              <div>
                <p className="text-black mt-1">Purchase Last month</p>
                <p className="text-xl font-semibold text-black">7,850</p>
              </div>
            </div>
          </div>
          
          <div className='p-2 rounded-2xl shadow bg-white flex-1'>
            <div className='mb-2 p-2'>
              <div className="flex justify-between items-center">
                <h2 className="text-black">Today Sale</h2>
                <RiMoneyRupeeCircleLine size={30} color='black' />
              </div>
              <p className="text-2xl font-semibold">₹ 17,350</p>
            </div>
            
            <div className='bg-color1 rounded-xl p-4'>
              <div className="flex justify-between items-center">
                <h2 className="text-white">Todays Appoinments</h2>
                <PiNote size={30} color='white' />
              </div>
              <p className="text-lg font-semibold text-white">480</p>
            </div>
            
          </div>
          <div className='p-4 rounded-2xl shadow bg-white flex-1'>
            <div className='flex flex-col gap-2'>
              <p className="text-xl text-gray-700">Favorite shortcuts</p>
              <div>
                <div className='bg-neutral-200 mb-3 rounded-lg w-fit p-2 text-xs font-normal'>
                  New Appoinment  ctrl+N
                </div>
                <div className='bg-neutral-200 mb-3 rounded-lg w-fit p-2 text-xs font-normal'>
                  Patients list F10
                </div>
                <div className='bg-neutral-200 mb-3 rounded-lg w-fit p-2 text-xs font-normal'>
                  Create Test  ctrl+C
                </div>
                <div className='bg-neutral-200 rounded-lg w-fit p-2 text-xs font-normal'>
                  Test List F11
                </div>
                
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MainContent;
