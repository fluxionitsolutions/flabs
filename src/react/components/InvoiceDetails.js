import React from 'react';

function InvoiceDetails({headData, items, invoiceNo}) {

  return (
    <div className="pl-10 pr-10 pb-10 rounded-lg flex-grow h-full overflow-auto hide-scrollbar">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">#{invoiceNo}</h2>
      
      <div className="flex gap-6">
        <div className="w-3/4 bg-white rounded-lg p-5">
          <div className='flex justify-between mb-5'>
              <h3 className="text-lg font-sm">Supplier details</h3>
              <span className="flex items-center justify-center text-xs bg-red-200 w-16 h-5 rounded">
                  <span className='w-2 h-2 rounded-full mr-2 bg-red-500'></span>
                  <span className='text-red-500'>{headData?.PaymentMode}</span>
              </span>
          </div>
          <div className='mb-5'>
              <p className='text-xs'>Name :</p>
              <p className='text-sm'>{headData?.SupplierName}</p>
          </div>
          
          <div className='flex justify-between'>
              
              <div className='border-l pl-2'>
                  <p className='text-xs text-gray-500'>Date :</p>
                  <p className='text-sm'>{headData?.InvoiceDate ? headData.InvoiceDate.split('T')[0] : 'N/A'}</p>
              </div>

              <div className='border-l pl-2'>
                  <p className='text-xs text-gray-500'>Purchase No :</p>
                  <p className='text-sm'>{headData?.PurchaseRefNo}</p>
              </div>
              <div className='border-l pl-2'>
                  <p className='text-xs text-gray-500'>Total Tax :</p>
                  <p className='text-sm'>₹{headData?.TaxAmount}.00</p>
              </div>
              <div className='border-l pl-2'>
                  <p className='text-xs text-gray-500'>Total Discount :</p>
                  <p className='text-sm'>₹{headData?.DiscountAmount}.00</p>
              </div>

              <div className='border-l pl-2'>
                  <p className='text-xs text-gray-500'>Total Amount :</p>
                  <p className='text-sm'>₹{headData?.TotalAmount}.00</p>
              </div>

              <div className='border-l pl-2'>
                  <p className='text-xs text-gray-500'>Total Due :</p>
                  <p className='text-sm text-red-500'>₹{headData?.TotalDue}.00</p>
              </div>
          </div>
        </div>
        <div className="w-2/5 bg-white rounded-lg p-5">
            <div className='flex justify-between mb-5'>
                <h3 className="text-lg font-sm">History</h3>
            </div>
            <div className='flex justify-between mb-5'>
                <div className='mr-auto'>
                    <p className='text-xs text-gray-500'>Last Purchase Date :</p>
                    <p className='text-sm'>8 Sep, 2020</p>
                </div>
                <div className='mr-auto'>
                    <p className='text-xs text-gray-500'>Last Payment Date :</p>
                    <p className='text-sm'>8 Sep, 2020</p>
                </div>
            </div>
            

            <div className='flex justify-between mb-5'>
                <div className='mr-auto'>
                    <p className='text-xs text-gray-500'>Last Purchase Amount :</p>
                    <p className='text-sm'>₹5,30,010</p>
                </div>
                <div className='mr-auto'>
                    <p className='text-xs text-gray-500'>Last Payment Amount :</p>
                    <p className='text-sm'>₹5,30,010</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 overflow-auto hide-scrollbar mt-4" style={{ height: 'calc(60%)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-gray-500 text-md font-normal text-left">Sl</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Product</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Batch</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Expiry</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Packing</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Quantity</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Free</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Rate</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Amount</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Tax</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">MRP</th>
              <th className="border-b p-2 text-left text-gray-500 font-normal text-md">Discount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, index) => (
              <tr key={index}>
                <td className="font-normal text-gray-600 text-md p-3">{row.SINo}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.ItemName}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.BatchCode}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row?.ExpiryDate ? row?.ExpiryDate.split('T')[0] : 'N/A'}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.Packing}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.Quantity}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.FOC}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.Price}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.Total}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.MRP}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.DiscountAmount}</td>
                <td className="font-normal text-gray-600 text-md p-3">{row.TaxCode}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className='flex justify-between p-5 mt-5'>
            <div className="flex flex-row items-center gap-2">
                <p className='text-sm text-gray-400'>Showing</p>
                <select className="p-1 border border-gray-200 bg-gray-100 rounded text-sm">
                    <option>01</option>
                </select>
                <p className='text-sm text-gray-400'>of 03</p>
            </div>
            <div className='flex gap-0.5'>
                <span className='bg-gray-200 flex items-center justify-center w-7 h-7 rounded-md'>-</span>
                <span className='bg-btnblue flex items-center justify-center w-7 h-7 rounded-md'>1</span>
                <span className='bg-gray-200 flex items-center justify-center w-7 h-7 rounded-md'>+</span>
            </div>
        </div> */}
      </div>
    </div>
  );
}

export default InvoiceDetails;
