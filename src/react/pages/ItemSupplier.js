import React from "react"
import { useState, useEffect } from 'react';
import { CiSettings, CiEdit } from "react-icons/ci";
import { AiOutlineSearch } from 'react-icons/ai';
import LeftMenu from '../components/LeftMenu';
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { BASE_URL, GET_SUPPLIER, GET_ITEM } from '../utlilities/config';
import FadeLoader from "react-spinners/FadeLoader";
import { spinnerStyles, overlayStyles } from '../common/style';
import 'react-toastify/dist/ReactToastify.css';
import NewItemEntry from "../components/NewItemEntry";
import axios from 'axios';
import NewSupplierEntry from "../components/NewSupplierEntry";
import { useNavigate, useParams } from 'react-router-dom';


const ItemSupplier = () => {

    const [isMenuExpanded, setIsMenuExpanded] = useState(true);
    const token = localStorage.getItem('accessToken');
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowmodal1] = useState(false);
    const [pageno, setPageno] = useState(1);
    const [pagesize, setPagesize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('items');
    const [items, setItems] = useState([])
    const [supplier, setSupplier] = useState([])
    const {string}= useParams();
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);


    const navigate = useNavigate();


    useEffect(() => {
        getData()
        getSupplierData();
    }, []);
    
    useEffect (()=>{
        if(string){
            setFilter('supplier')
        }else{
            setFilter('items')
        }
    }, [])
    
    const getData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}${GET_ITEM}`, {
                headers: {
                    'TenantName': 'Abcd',
                    'PageNo': pageno,
                    'PageSize': pagesize,
                    'XApiKey': process.env.REACT_APP_API_KEY,
                    'Authorization': `Bearer ${token}`
                },
            })
            if (response.status === 200) {
                setLoading(false);
                console.log(response?.data?.data?.masterData)
                setItems(response?.data?.data?.masterData)
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getSupplierData = async () => {
        setLoading(true);
        try {
            const response1 = await axios.get(`${BASE_URL}${GET_SUPPLIER}`, {
                headers: {
                    'TenantName': 'Abcd',
                    'PageNo': pageno,
                    'PageSize': pagesize,
                    'XApiKey': process.env.REACT_APP_API_KEY,
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response1.status === 200) {
                setLoading(false);
                setSupplier(response1?.data?.data)
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };

    const handleClick = () => {
        if (filter === 'items') {
            setShowModal(true);
        } else {
            setShowmodal1(true);
        }
    };


    const handleNavigate = (itemId) => {
        setSelectedItemId(itemId);
        setShowModal(true);
    };

    const handleGetto = (SupplierID) => {
        setSelectedSupplierId(SupplierID);
        setShowmodal1(true);
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
            <div className="p-4 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center">
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
                                className={`text-sm ${filter === 'items' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                                onClick={() => setFilter('items')}
                            >
                                Items
                            </button>
                            <button
                                className={`text-sm ${filter === 'supplier' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                                onClick={() => setFilter('supplier')}
                            >
                                Suppliers
                            </button>
                        </div>

                        <button className="bg-blue-600 text-white px-5 py-2 text-sm rounded-lg" onClick={handleClick}>Add new +</button>
                    </div>
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search By Name"
                            className="border rounded-lg w-full h-10 px-4 placeholder:text-sm mb-2"
                        />
                        <AiOutlineSearch size={19} color='grey' className="absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg w-full overflow-auto hide-scrollbar" style={{ height: 'calc(100%)' }}>
                    {filter === 'items' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse table-fixed">
                                <thead className='bg-gray-300 sticky'>
                                    <tr>
                                        {['Sl No', 'Name', 'Category', 'Company', 'CostPer Test', 'Package', 'Reorder Level','Total Stock', 'Action'].map((header, index) => (
                                            <th key={index} className="border-b pl-5 p-2 text-left text-black font-normal text-sm w-1/11">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((row, index) => (
                                        <tr key={index}>
                                            <td className="border font-normal text-sm p-3">{index + 1}</td>
                                            <td className="border font-normal text-sm p-3">{row?.ItemName}</td>
                                            <td className="border font-normal text-sm p-3">{row?.Category}</td>
                                            <td className="border font-normal text-sm p-3 ">{row?.Company}</td>
                                            <td className="border font-normal text-sm p-3 ">{row?.CostPerTest}/{row?.CostPerTestUnit}</td>
                                            <td className="border font-normal text-sm p-3 overflow-hidden">{row?.Package}/{row?.Unit}</td>
                                            <td className="border font-normal text-sm p-3 ">{row?.ReorderLevel}/{row?.ReorderLevelUnit}</td>
                                            <td className="border font-normal text-sm p-3 ">{row?.Onhand}</td>
                                            <td className="border font-normal text-sm p-3 flex flex-row gap-5">
                                                <span  className="flex items-center justify-center w-6 h-6 cursor-pointer bg-amber-100 rounded-lg">
                                              
                                                    <CiEdit onClick={()=>handleNavigate(row.Item_No)} size={15} color='orange' />
                                                </span>
                                                <span className="flex items-center justify-center w-6 h-6 bg-red-200 cursor-pointer rounded-lg">
                                                    <MdDelete size={15} color='red' />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <table className="w-full border-collapse table-fixed">
                            <thead className='bg-gray-300 sticky'>
                                <tr>
                                    {['Sl No', 'Name', 'Code', 'Address', 'Place', 'Mobile No', 'Gst No', 'Action'].map((header, index) => (
                                        <th key={index} className="border-b pl-5 p-2 text-left text-black font-normal text-sm w-1/11">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {supplier.map((row, index) => (
                                    <tr key={index}>
                                        <td className="border font-normal text-sm p-3">{index + 1}</td>
                                        <td className="border font-normal text-sm p-3">{row?.SupplierName}</td>
                                        <td className="border font-normal text-sm p-3">{row?.SupplierCode}</td>
                                        <td className="border font-normal text-sm p-3 ">{row?.Address}</td>
                                        <td className="border font-normal text-sm p-3 ">{row?.Place}</td>
                                        <td className="border font-normal text-sm p-3 ">{row?.MobileNo}</td>
                                        <td className="border font-normal text-sm p-3 ">{row?.GstNo}</td>
                                        <td className="border font-normal text-sm p-3 flex flex-row gap-5">
                                            <span className="flex items-center justify-center w-6 h-6 bg-amber-100 cursor-pointer rounded-lg">
                                                <CiEdit onClick={()=>handleGetto(row.SupplierID)} size={15} color='orange' />
                                            </span>
                                            <span className="flex items-center justify-center w-6 h-6 bg-red-200 cursor-pointer rounded-lg">
                                                <MdDelete size={15} color='red' />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && 
                <NewItemEntry setShowModal={setShowModal} id={selectedItemId} setSelectedItemId={setSelectedItemId} getItemData={getData} />
            }
            {showModal1 && 
                <NewSupplierEntry setShowModal1={setShowmodal1} id={selectedSupplierId} setSelectedSupplierId={setSelectedSupplierId} getSupplierData={getSupplierData} />
            }
        </div>
    )
}
export default ItemSupplier