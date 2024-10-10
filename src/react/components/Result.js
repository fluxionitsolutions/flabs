import React, { useState, useEffect, useRef } from 'react';
import LeftMenu from './LeftMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Barcode from 'react-barcode';

const { ipcRenderer } = window.require('electron');

const ResultView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pdfRef = useRef();

    const [showHeaderFooter, setShowHeaderFooter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [rowsPerPage, setRowsPerPage] = useState(15); // Customize rows per page

    //const { testData, id, edit, sequence, patientData } = location.state || {};
    const { newPageItems, remainingTestData, id, edit, sequence, patientData } = location.state || {};

    console.log(remainingTestData)
    
    const [dateTime, setDateTime] = useState('');

    useEffect(() => {
        setDateTime(getFormattedDateTime());

        const interval = setInterval(() => {
            setDateTime(getFormattedDateTime());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Pagination control: Calculate total pages
    // const totalPages = Math.ceil(remainingTestData.length / rowsPerPage);
    // console.log('test dataa', remainingTestData)

    const getFormattedDateTime = () => {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        let hours = today.getHours();
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        return `${formattedDate} ${formattedTime}`;
    };

    // const renderTableRows = () => {
    //     let rows = [];
    //     let currentGroup = null;

    //     const startRow = (currentPage - 1) * rowsPerPage;
    //     const endRow = startRow + rowsPerPage;

    //     remainingTestData.slice(startRow, endRow).forEach((item) => {
    //         if (item.LableType === 'Group') {
    //             currentGroup = item;
    //             rows.push(
    //                 <div className="flex pl-3 pr-3" key={`group-${item.ID}`}>
    //                     <p className="text-black pl-3 font-bold text-sm" style={{ width: '40%' }}>{item.Name}</p>
    //                 </div>
    //             );
    //         }

    //         if (item.LableType === 'Item') {
    //             const paddingClass = currentGroup && item.SI_No === currentGroup.SI_No ? 'pl-7' : 'pl-3';
    //             rows.push(
    //                 <div className="flex pt-3 pb-3 pl-3 pr-3" key={`item-${item.ID}`}>
    //                     <p className={`text-black font-normal text-xs ${paddingClass}`} style={{ width: '40%' }}>{item.Name}</p>
    //                     <p className="text-black font-normal text-xs text-center" style={{ width: '15%' }}>{item.Value}</p>
    //                     <p className="text-black text-center font-normal text-xs" style={{ width: '10%' }}>mg/DL</p>
    //                     <p className="text-black text-center font-normal text-xs" style={{ width: '25%' }}>
    //                         {item.LowValue ? `${item.LowValue}-${item.HighValue}` : 'null-null'}
    //                     </p>
    //                     <p className="text-black text-center font-normal text-xs" style={{ width: '10%' }}>GDPD</p>
    //                 </div>
    //             );
    //         }
    //     });

    //     return rows;
    // };


    // Pagination control: Calculate pages separately for remainingTestData and newPageItems
    
    const totalPagesRemainingData = Math.ceil(remainingTestData.length / rowsPerPage);
    const totalPagesNewItems = Math.ceil(newPageItems.length / rowsPerPage);
    const totalPages = totalPagesRemainingData + totalPagesNewItems;

    const renderTableRows = () => {
        let rows = [];
        let currentGroup = null;

        const isShowingRemainingData = currentPage <= totalPagesRemainingData;
        const dataToRender = isShowingRemainingData
            ? remainingTestData
            : newPageItems;

        // Calculate start and end row based on the current page
        const adjustedPage = isShowingRemainingData
            ? currentPage
            : currentPage - totalPagesRemainingData;

        const startRow = (adjustedPage - 1) * rowsPerPage;
        const endRow = startRow + rowsPerPage;

        dataToRender.slice(startRow, endRow).forEach((item) => {
            if (item.LableType === 'Group') {
                currentGroup = item;
                rows.push(
                    <div className="flex pl-3 pr-3" key={`group-${item.ID}`}>
                        <p className="text-black pl-3 font-bold text-sm" style={{ width: '40%' }}>{item.Name}</p>
                    </div>
                );
            }

            if (item.LableType === 'Item') {
                const paddingClass = currentGroup && item.SI_No === currentGroup.SI_No ? 'pl-7' : 'pl-3';

                const BoldClass = item?.Action === 'bold' ? 'font-bold' : 'font-normal'
                rows.push(
                    <div className="flex pt-3 pb-3 pl-3 pr-3" key={`item-${item.ID}`}>
                        <p className={`text-black text-xs ${paddingClass} ${BoldClass}`} style={{ width: '40%' }}>{item.Name}</p>
                        <p className="text-black font-normal text-xs text-center" style={{ width: '15%' }}>{item.Value}</p>
                        <p className="text-black text-center font-normal text-xs" style={{ width: '10%' }}>mg/DL</p>
                        <p className="text-black text-center font-normal text-xs" style={{ width: '25%' }}>
                            {item.LowValue ? `${item.LowValue}-${item.HighValue}` : 'null-null'}
                        </p>
                        <p className="text-black text-center font-normal text-xs" style={{ width: '10%' }}>GDPD</p>
                    </div>
                );
            }
        });

        return rows;
    };


    const handlePrint = (printAll = false) => {
        const billDiv = document.getElementById('billDiv');
        if (billDiv) {
            if (printAll) {
                // Print all pages
                setTimeout(() => {
                    let allPages = "";
                    totalPages.forEach((_, pageIndex) => {
                        setCurrentPage(pageIndex + 1); // Load each page
                        const page = document.getElementById('billDiv');
                        if (page) {
                            toPng(page, { quality: 1, pixelRatio: 3 }).then((dataUrl) => {
                                allPages += `<img src="${dataUrl}" style="page-break-after: always;" />`;
                            });
                        }
                    });

                    ipcRenderer.send('print-result-image', allPages);
                }, 100);
            } else {
                // Print only current page
                toPng(billDiv, { quality: 1, pixelRatio: 3 })
                    .then((dataUrl) => {
                        ipcRenderer.send('print-result-image', dataUrl);
                    })
                    .catch((error) => {
                        console.error('Error capturing billDiv as image:', error);
                    });
            }
        }
    };

    const handleClick = (id, edit, sequence) => {
        navigate(`/resultentry/${id}/${edit}/${sequence}`);
    };

    const downloadPDF = async () => {
        setShowHeaderFooter(true);
    
        const input = pdfRef.current;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        for (let page = 1; page <= totalPages; page++) {
            // Set the current page and wait for the component to re-render
            await new Promise((resolve) => {
                setCurrentPage(page);
                setTimeout(resolve, 500); // Delay to allow re-rendering, adjust as needed
            });
    
            // Capture the page content
            const canvas = await html2canvas(input, { scale: 1.75 });
            const imgData = canvas.toDataURL('image/jpeg', 0.85);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
            // Add a new page in the PDF for pages after the first one
            if (page > 1) {
                pdf.addPage();
            }
    
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
    
        // Save the final PDF
        pdf.save('report.pdf');
        setShowHeaderFooter(false);
    };
    
    

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };    

    return (
        <div className="flex bg-background h-screen">
            <LeftMenu />
            <div className='flex flex-row w-full p-5 overflow-auto hide-scrollbar'>
                <div className="w-full h-[1118px] flex justify-center">
                    <div id="billDiv" style={{ page: "A5" }} className="h-[1118px] w-[793px] bg-white flex flex-col justify-between" ref={pdfRef}>
                        <div className="flex-grow">
                            {showHeaderFooter ? (
                                <div className="flex">
                                    <img src={`${process.env.PUBLIC_URL}/header.jpg`} alt="Logo" className="h-full w-full" />
                                </div>
                            ) : (
                                <div className="h-40 w-full"></div>
                            )}

                            <div className="flex flex-row w-full p-4 gap-3">
                                {/* Patient details */}
                                <div className="w-1/2 flex">
                                    <div className="w-44 flex flex-col gap-1 items-start">
                                        <p className="text-xs">Invoice No.</p>
                                        <p className="text-xs">Name</p>
                                        <p className="text-xs">Age/Gender</p>
                                        <p className="text-xs">Referred By</p>
                                        <p className="text-xs">Corporate</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-1 items-start">
                                        <p className="text-xs"> : {id}</p>
                                        <p className="text-xs"> : {patientData?.PatientName}</p>
                                        <p className="text-xs"> : {patientData?.Age} Years / {patientData?.Gender}</p>
                                        <p className="text-xs"> : {patientData?.DoctorName}</p>
                                        <p className="text-xs"> : {patientData?.LabName}</p>
                                    </div>
                                </div>
                                <div className="w-1/2 flex">
                                    <div className="w-64 flex flex-col gap-1 items-start">
                                        <p className="text-xs">Patient ID</p>
                                        <p className="text-xs">Sample Collected On</p>
                                        <p className="text-xs">Report Printed On</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-1 items-start">
                                        <p className="text-xs"> : PB-1024</p>
                                        <p className="text-xs"> : {patientData?.CreatedDate}</p>
                                        <p className="text-xs"> : {dateTime}</p>
                                        <Barcode
                                            value={id || 'InvoiceID'}
                                            displayValue={false}
                                            height={20}
                                            width={1.5}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-0.5 bg-black justify-center flex" style={{ width: 'calc(96%)', margin: '0 auto' }}></div>

                            <p className="text-center text-black text-md font-semibold">BIOCHEMISTRY</p>

                            <div className="mt-4">
                                <div className="flex mb-2 pl-3 pr-3">
                                    <p className="text-black pl-3 font-normal text-sm" style={{ width: '40%' }}>Investigation</p>
                                    <p className="text-black font-normal text-sm" style={{ width: '15%' }}>Observed Value</p>
                                    <p className="text-black text-center font-normal text-sm" style={{ width: '10%' }}>Unit</p>
                                    <p className="text-black text-center font-normal text-sm" style={{ width: '25%' }}>Biological Ref. Interval</p>
                                    <p className="text-black text-center font-normal text-sm" style={{ width: '10%' }}>Method</p>
                                </div>
                                <div className="h-0.5 bg-black justify-center flex mb-5" style={{ width: 'calc(96%)', margin: '0 auto' }}></div>
                                {renderTableRows()}
                            </div>
                        </div>

                        <div className='w-full pl-2 pr-2'>
                            <div className='w-full border mt-auto border-black h-13 p-1 pl-2'>
                                <p className='text-sm text-black italic'>Note:-</p>
                                <p className='pl-5' style={{ fontSize: '0.55rem' }}>
                                Laboratory findings should not be considered as final diagnosis, hence should be clinically correlate with other findings. In case of unexpected results, referring doctors can request for recheck with fresh sample.
                                </p>
                            </div>
                        </div>

                        
                        {/* Footer */}
                        {showHeaderFooter ? (
                            <div>
                                <img src={`${process.env.PUBLIC_URL}/footer.jpg`} alt="footer" className="h-full w-full" />
                            </div>
                        ) : (
                            <div className="h-24 w-full"></div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-80 bg-white h-full shadow-lg rounded-lg p-5 flex flex-col gap-6">
                    <div className="flex flex-row gap-1">
                        <input
                            type="checkbox"
                            checked={showHeaderFooter}
                            onChange={(e) => setShowHeaderFooter(e.target.checked)} 
                        />
                        <p>Add Header</p>
                    </div>


                    <div className="flex w-full  justify-between gap-5">
                        <button type="button" className="w-full py-2 bg-btnblue text-white rounded-lg text-xs" onClick={() => handlePrint(true)}>
                            Print
                        </button>
                        <button type="button" className="w-full py-2 bg-btnblue text-white rounded-lg text-xs" onClick={downloadPDF}>
                            Export PDF
                        </button>
                    </div>



                    <div className="flex">
                        <button
                            type="button"
                            className="w-full p-2 bg-btnblue text-white rounded-lg text-sm"
                            onClick={() => handlePrint(false)}
                        >
                            Print This Page
                        </button>
                    </div>
                    <div className="flex">
                        <button type="button" className="w-full p-2 bg-btnblue text-white rounded-lg text-sm">
                            Share WhatsApp
                        </button>
                    </div>
                    <div className="flex">
                        <button
                            type="button"
                            className="w-full p-2 bg-btnblue text-white rounded-lg text-sm"
                            onClick={() => handleClick(id, edit, sequence)}
                        >
                            Close
                        </button>
                    </div>


                    <div className="flex w-full justify-between items-center gap-5">
                        <button className="w-full py-2 bg-gray-300 text-black rounded-lg text-xs" onClick={handlePrevPage} disabled={currentPage === 1}>
                            Prev
                        </button>
                        <span className="text-black text-sm">{currentPage} of {totalPages}</span>
                        <button className="w-full py-2 bg-gray-300 text-black rounded-lg text-xs" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>

            </div>
        </div>
    );
};

export default ResultView;
