import React, { useState, useEffect } from 'react';
import LeftMenu from '../components/LeftMenu';
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineSearch } from 'react-icons/ai';
import { FaRegCircleUser } from "react-icons/fa6";
import withAuth from '../common/auth';
import axios from 'axios';
import { BASE_URL, GET_USER, PUT_USER } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import AddUserModal from '../components/users/UserAdd';



const Patients = () => {
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [users, setUsers] = useState([])

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    getData()
  },[]);


  const getData = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${BASE_URL}${GET_USER}`, {
            headers: {
                'XApiKey': process.env.REACT_APP_API_KEY,
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200 ) {
            setLoading(false);
            console.log(response.data.data)   
            setUsers(response.data.data)    
        }
    } catch (error) {
        setLoading(false);
        console.error(error);
    } finally {
        setLoading(false);
    }
  };


  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }


  const handleBlockClick = (row, action) => {
    console.log('hereee', row, action)
    updateData(row, action)
  };


  const updateData = async (row, action) => {
    setLoading(true)
    const data = {
      UserCode: row.UserCode,
      UserName: row.UserName,
      Designation: row.Designation,
      JoiningDate: row.JoiningDate,
      SinatureUrl: row.SinatureUrl,
      IsActive: action,
    };

    console.log('hereee final dataaa', data)

    try {
        const response = await axios.put(`${BASE_URL}${PUT_USER}`, data, {
        headers: {
            'XApiKey': process.env.REACT_APP_API_KEY,
            'Authorization': `Bearer ${token}`,
            'UserID': row.UserID
        },
        });
        console.log(response.data)
        if (response.status === 200) {
            getData();
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

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
      <LeftMenu/>
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
                className={`text-sm ${filter === 'All' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setFilter('All')}
              >
                Users
              </button>
              <button
                className={`text-sm ${filter === 'Payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setFilter('Payment')}
              >
                User Role
              </button>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 text-sm rounded-lg" onClick={() => setUserModal(true)}>New User</button>
          </div>
          <div className='w-full justify-between flex'>
            <div className="w-96 relative">
              <input
                type="text"
                placeholder="Search By Name"
                className="border rounded-lg w-full h-10 px-4 placeholder:text-sm mb-2"
              />
              <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-gray-500 text-sm text-left">USER CODE</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">USER NAME</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">DESIGNATION</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">JOIN DATE</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">SIGNATURE</th>
                <th className="border-b p-2 text-left text-gray-500 text-sm">ACTION</th>
              </tr>
            </thead>

            <tbody>
                {users.map((row, index) => (
                    <tr key={index}>
                        <td className="border-b p-2 text-gray-500 text-md cursor-pointer">{row?.UserCode}</td>
                        <td className="border-b p-2">{row?.UserName}</td>
                        <td className="border-b p-2">{row?.Designation}</td>
                        <td className="border-b p-2">{formatDate(row?.JoiningDate)}</td>
                        <td className="border-b p-2"><img src={row?.SinatureUrl} alt="Not Available" className="h-10 object-fill"/></td>
                        <td className="border-b p-2">
                          <div className='flex flex-row gap-2'>
                            {row.IsActive ? 
                              <p className="text-red-500 hover:underline cursor-pointer" onClick={() => handleBlockClick(row, false)}>Block </p>
                              :
                              <p className="text-green-500 hover:underline cursor-pointer" onClick={() => handleBlockClick(row, true)}> UnBlock</p>
                            }
                            <p> , </p>
                            <p className="text-blue-500 hover:underline">Privilege</p>
                          </div>
                          
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {userModal &&
        <AddUserModal setUserModal={setUserModal} getData={getData} />
      }
    </div>
  );
};

export default withAuth(Patients);
