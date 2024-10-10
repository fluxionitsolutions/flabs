import react from 'react'
import { TfiAgenda , TfiRulerPencil } from "react-icons/tfi";

const UserRoles = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="overflow-x-hidden overflow-y-hidden hide-scrollbar" style={{ height: '100%' }}>
                <div className="h-3/5">
                    <div className="bg-white  flex pt-2 m-4 mr-12 rounded-lg shadow-md  overflow-auto hide-scrollbar" style={{ height: 'calc(100% - 2rem)' }}>
                        <div className="w-full  border-collapse" style={{ height: '100%' }}>


                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border-b p-2 text-gray-500 text-sm text-left">ACTIONS</th>
                                        <th className="border-b p-2 text-gray-500 text-sm text-center">ADMIN</th>
                                        <th className="border-b p-2 text-gray-500 text-sm text-center">STAFF</th>
                                        <th className="border-b p-2 text-gray-500 text-sm text-center">MANAGER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='bg-background w-full'>
                                      <td colSpan="4">
                                           <div className=' flex bg-background py-2.5  pl-4 w-full'> 
                                           <TfiAgenda color={'blue'} size={20} /><h3 className='ml-7 font-bold flex bg-background h-5 w-full'>Appoinments</h3>
                                      </div> </td>
                                    </tr>
                                    <tr className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50">

                                        <td className="flex items-center px-6 py-4 text-gray-900 ">
                                            Create Appoinments
                                        </td>
                                        <td>
                                            <div className="flex justify-center  h-5">
                                                <input   id="red-checkbox" type="checkbox" className="  w-5 h-7 border border-gray-300 rounded cursor-pointer text-blue-600 focus:ring-blue-500
                                                  "   />
                                             
                                            </div>
                                        </td>
                                        <td >
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounded cursor-pointer " required />
                                            </div>
                                        </td  >
                                        <td  >
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounded cursor-pointer  " required />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b  hover:bg-gray-50 ">
                                        <td className="flex items-center px-6 py-4 text-gray-900  ">
                                            Edit Appoinments
                                        </td>
                                        <td >
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7 border  rounded cursor-pointer  " required />
                                            </div>
                                        </td>
                                        <td >
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7 border cursor-pointer  rounded  " required />
                                            </div>
                                        </td  >
                                        <div className="flex justify-center  h-5">
                                            <input id="remember" type="checkbox" className="w-5 h-7 border rounded cursor-pointer  " required />
                                        </div>
                                    </tr>
                                    <tr className="bg-white border-b  hover:bg-gray-50 ">
                                        <td className="flex items-center px-6 py-4 text-gray-900 ">
                                            Delete Appoinments
                                        </td>
                                        <td>
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounded cursor-pointer  " required />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7  border  rounded cursor-pointer  " required />
                                            </div>
                                        </td  >
                                        <td >
                                            <div className="flex justify-center  h-5">
                                                <input id="remember" type="checkbox" className="w-5 h-7 border cursor-pointer  rounded  " required />
                                            </div>
                                        </td>
                                    </tr>                            
                                    <tr className= 'bg-background   w-full' >
                               <td colSpan="4">
                                   <div className='flex w-full py-2.5  pl-4  '>
                                     <TfiRulerPencil color={'blue'} size={24} />
                                    <h3 className=' font-bold ml-7 flex bg-background h-5 w-full'>Billing</h3>
                                   </div>                                        
                               </td>
                                    </tr>
                            <tr className='  border-b  hover:bg-gray-50'>
                                <td className="flex items-center  hover:bg-gray-50 px-6 py-4 text-gray-900 bg-white ">
                                    Create bill
                                </td>
                                <td >
                                    <div className="flex justify-center    h-5">
                                        <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounde cursor-pointer  "  />
                                    </div>
                                </td>
                                <td >
                                    <div className="flex justify-center  h-5">
                                        <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 cursor-pointer " required />
                                    </div>
                                </td>
                                <td >
                                    <div className="flex justify-center  h-5">
                                        <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounded cursor-pointer  " required />
                                    </div>
                                </td>
                            </tr>
                            <tr className='  border-b  hover:bg-gray-50'>
                                <td className="flex items-center px-6 py-4 hover:bg-gray-50 text-gray-900 bg-white ">
                                  Send bill
                                </td>
                                <td >
                                    <div className="flex justify-center  h-5">
                                        <input id="remember" type="checkbox" className="w-5 h-7 border  border-gray-300 rounded cursor-pointer " required />
                                    </div>
                                </td>
                                <td >
                                    <div className="flex justify-center  h-5">
                                        <input id="remember" type="checkbox" className="w-5 h-7 border border-gray-300 rounded  cursor-pointer" required />
                                    </div>
                                </td>
                                <td >
                                    <div className="flex justify-center  h-5 ">
                                        <input id="remember" type="checkbox" className="w-5 h-7 border  rounded cursor-pointer " required />
                                    </div>
                                </td>
                            </tr>                           
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
                </div >
            </div >    
    )
}
export default UserRoles