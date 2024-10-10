import React, { useState }  from 'react';
import { toPng } from 'html-to-image';

const BillComponent = ({invoiceNumber, selectedPatient, selectedDoctor, date, products, discount, advance, calculateTotal} ) => {

    const { ipcRenderer } = window.require('electron');

    const handlePrint = () => {  
        const billDiv = document.getElementById('billDiv');
        if (billDiv) {
            toPng(billDiv, { quality: 1, pixelRatio: 3 })
                .then((dataUrl) => {
                    const link = document.createElement('a');
    
                    ipcRenderer.send('print-bill-image', dataUrl);
    
                })
                .catch((error) => {
                    console.error('Error capturing billDiv as image:', error);
                });
        }
      };
    

  return (
    <div className="flex h-screen bg-background">
        <div className='p-10 bg-gray-500'>
        <div id="billDiv" style={{ page: "A5" }} className='h-[559px] w-[793px] bg-white flex flex-col justify-between'>
            <div className='p-2'>
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <p className='text-lg font-bold'>FAMILY</p>
                    <p className='text-xs'>Health Care Clinic </p>
                    <p className='text-xs'>+91 7034444622 , +91 7034444633 </p>
                </div>

                <div className='border-l-4 border-black p-1'>
                    <p className='text-xs'>PM Arcade </p>
                    <p className='text-xs'>Parambil Bazar , Kuruvattoor </p>
                    <p className='text-xs'>Malappuram</p>
                    <p className='text-xs'>Working Time : 7:00 AM to 10:00 PM</p>
                </div>
            </div>
            <p className='text-center text-black  text-lg font-bold '>RECEIPT</p>

            <div className='flex mt-1 bg-white'>
                <div className=' w-full'>
                    <div className='flex justify-between '>
                        <div className='flex flex-row gap-5 justify-center content-center items-center'>
                            <p className='text-sm'>Receipt No:</p>
                            <p className='text-black font-semibold'>{invoiceNumber}</p>
                        </div>
                        <div>
                            <p className='text-black text-xs font-semibold'>{date}</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 mt-3'>
                        <div className='flex justify-between '>
                            <div className='flex flex-row gap-5 justify-center content-center items-center'>
                                <p className='text-xs'>Name :</p>
                                <p className='text-black text-xs'>{selectedPatient?.PatientName}</p>
                            </div>
                            <div className='flex flex-row gap-5 justify-center content-center items-center'>
                                <p className='text-xs'>Age/Sex :</p>
                                <p className='text-black text-xs'>{selectedPatient?.Age}/{selectedPatient?.Gender}</p>
                            </div>
                        </div>

                        <div className='flex justify-between '>
                            <div className='flex flex-row gap-5 justify-center content-center items-center'>
                                <p className='text-xs'>Mobile Number :</p>
                                <p className='text-black text-xs'>+91-{selectedPatient?.MobileNo}</p>
                            </div>
                            <div className='flex flex-row gap-5 justify-center content-center items-center'>
                                <p className='text-xs'>Referred By :</p>
                                <p className='text-black text-xs'>{selectedDoctor?.label}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <div className='flex justify-between mb-2'>
                            <p className='text-black font-semibold text-sm'>Sr.</p>
                            <p className='text-black font-semibold text-sm'>Test Name</p>
                            <p className='text-black font-semibold text-sm'>Test Price</p>
                        </div>
                        <div className='w-full h-0.5 bg-black'></div> 

                        <div className='flex flex-col gap-3 mt-3 mb-2'>

                            {products.map((product, index) => {
                                if (!product?.name) return null;

                                return (
                                    <div key={index} className='flex justify-between'>
                                    <p className='text-black font-semibold text-xs'>{index + 1}</p>
                                    <p className='text-black font-semibold text-xs'>{product?.name}</p>
                                    <p className='text-black font-semibold text-xs'>{product?.amount}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='w-full h-0.5 bg-black'></div> 
                    </div>
                </div>
            </div>
            </div>

            <div className='flex flex-row gap-10 p-2 justify-end'>
                <div className='flex flex-col gap-1 text-right'>
                    <p className='text-xs font-semibold text-black'>Total</p>
                    <p className='text-xs font-semibold text-black'>Advance</p>
                    <p className='text-xs font-semibold text-black'>Balance</p>
                </div>
                <div className='flex flex-col gap-1 text-right'>
                    <p className='text-xs font-semibold text-black'>{calculateTotal()}.00</p>
                    <p className='text-xs font-semibold text-black'>0.00</p>
                    <p className='text-xs font-semibold text-black'>{calculateTotal()}.00</p>
                </div> 
            </div>

            <div className='w-full h-0.5 bg-black'></div> 
            <div className='w-full flex justify-center content-center items-center'>
                <p className='text-xs'>Bill Generated Using Fluxion Lab Management Software 2.0</p>
            </div>
        </div>

        <button onClick={handlePrint}>Send Bill as PDF</button>
        </div>
    </div>
  );
};

export default BillComponent;
