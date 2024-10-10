import React, { useState, useEffect } from 'react';
import { FiUser } from "react-icons/fi";
import { RiLock2Line } from "react-icons/ri";
import { BASE_URL, LOGIN } from '../utlilities/config';
import axios from 'axios';
import FadeLoader from "react-spinners/FadeLoader";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import { spinnerStyles, overlayStyles } from '../common/style';

import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [firm, setFirm] = useState('Parambil Lab');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  
    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        navigate('/userdashboard');
      }
    }, [navigate]);
  

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}${LOGIN}`, {
                headers: {
                    'TenantName': 'Abcd',
                    'UserName': username,
                    'Password': password,
                    'XApiKey': process.env.REACT_APP_API_KEY,
                },
            });
            if(response.status === 200) {
                console.log(response.status)
                const accessToken = response.data.data._accessToken;
                localStorage.setItem('accessToken', accessToken);
                navigate('/userdashboard');
            } else {
                setLoading(false)
                toast.success('Invalid Credentials', {
                    duration: 5000 // Duration in milliseconds
                });
            }
            
        } catch (error) {
            console.error(error);
            toast.error('Invalid Credentials..!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
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
                transition={Slide} // Corrected prop assignment
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

            <div className="lg:w-1/2 flex flex-col items-center p-4">
                <img src={`${process.env.PUBLIC_URL}/flogo.png`} alt="Logo" className="h-20 lg:h-40 object-fill"/>
                <div className="text-center mb-8 mt-4">
                    <h1 className="text-2xl lg:text-3xl">Welcome Back</h1>
                    <p className="text-black">Login with your account to access dashboard</p>
                </div>
                <div className="w-full max-w-sm mt-10">
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                contentEditable={false}
                                value={firm}
                                onChange={e => setFirm(e.target.value)}
                                className="w-full p-3 border border-gray-200 text-md rounded-2xl text-center"
                                style={{ height: '48px', lineHeight: '48px' }}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full pl-10 p-4 rounded-2xl focus:outline-none text-sm focus:ring-2 focus:ring-purple-600 placeholder-black bg-logintxt"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="relative">
                            <RiLock2Line className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-10 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-logintxt placeholder-black"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={!username || !password || loading}
                            className={`w-full p-3 bg-loginbtn text-white rounded-xl font-bold text-sm hover:bg-purple-600 shadow-xl transition duration-300 ${(!username || !password || loading) && 'opacity-50 cursor-not-allowed'}`}
                            onClick={handleLogin}
                        >
                            {loading ? 'Loading...' : 'Login Now'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/2 flex relative">
                <img src={`${process.env.PUBLIC_URL}/loginimg2.png`} alt="Background" className="absolute w-full h-full object-cover" />
                <div className="relative h-3/5 lg:h-4/6 w-full lg:w-1/2 rounded-3xl border mt-20 lg:mt-40 mx-auto lg:ml-32 p-5 border-white bg-loginbox2 bg-opacity-30 flex flex-col items-center justify-between">
                    <div className="w-full text-left">
                        <h1 className='text-white font-extrabold text-2xl lg:text-4xl'>Redefining <br /> Lab <br /> Excellence</h1>
                    </div>
                    <div className='w-full h-full min-h-fit'>
                        <img src={`${process.env.PUBLIC_URL}/loginimg1.png`} alt="Background" className="w-full h-full object-contain" />
                    </div>
                </div>
                <div className='flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white absolute top-1/2 left-10 lg:left-24'>
                    <img src={`${process.env.PUBLIC_URL}/stars1.jpg`} alt="Background" className="w-5 h-5 lg:w-7 lg:h-7" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
