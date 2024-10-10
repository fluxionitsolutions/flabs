function ReportTable({bills}){
    
  return ( 
  
    <div className="flex flex-row justify-between mt-3 p-5 h-auto overflow-auto hide-scrollbar">
    <div className="flex bg-white w-full rounded-lg p-5 overflow-auto hide-scrollbar">
      <table className="w-full border-collapse overflow-auto hide-scrollbar">
        <thead>
        <tr>
            <th className="border-b p-2 text-gray-500 text-sm text-left">BILL NO</th>
            <th className="border-b p-2 text-left text-gray-500 text-sm">INV DATE</th>
            <th className="border-b p-2 text-left text-gray-500 text-sm">PATIENT NAME</th>
            <th className="border-b p-2 text-left text-gray-500 text-sm">GRAND TOTAL</th>
            <th className="border-b p-2 text-left text-gray-500 text-sm">DUE AMOUNT</th>
            <th className="border-b p-2 text-left text-gray-500 text-sm">RESULT STATUS</th>
            <th className="border-b p-2 text-left text-gray-500 text-sm">PAYMENT STATUS</th>
        </tr>
        </thead>
        <tbody>
        {bills.map((row, index) => (
            <tr key={index}>
                <td className="border-b p-2 text-gray-500 text-md">{row.InvoiceNo}</td>
                <td className="border-b p-2 text-sm">{row?.EntryDate.split('T')[0]}</td>
                <td className="border-b p-2 text-sm">{row.PatientName}</td>
                <td className="border-b p-2 text-sm">{row.GrandTotal}</td>
                <td className="border-b p-2 text-sm">{row.BalanceDue}</td>
                <td className="border-b p-2 text-sm">
                  <span className="flex items-center text-xs">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        row.PaymentStatus === 'Completed'
                          ? 'bg-green-600'
                          : row.PaymentStatus === 'Pending'
                          ? 'bg-red-600'
                          : 'bg-red-600'
                      }`}
                    ></span>
                    <span
                      className={`${
                        row.PaymentStatus === 'Completed'
                          ? 'text-green-600'
                          : row.PaymentStatus === 'Pending'
                          ? 'text-red-600'
                          : 'text-red-600'
                      }`}
                    >
                      {row.PaymentStatus}
                    </span>
                  </span>
                </td>

                <td className="border-b p-2 text-sm">
                  <span className="flex items-center text-xs">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        row.ResultStatus === 'Completed'
                          ? 'bg-green-600'
                          : row.ResultStatus === 'Pending'
                          ? 'bg-red-600'
                          : 'bg-red-600'
                      }`}
                    ></span>
                    <span
                      className={`${
                        row.ResultStatus === 'Completed'
                          ? 'text-green-600'
                          : row.ResultStatus === 'Pending'
                          ? 'text-red-600'
                          : 'text-red-600'
                      }`}
                    >
                      {row.ResultStatus}
                    </span>
                  </span>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
</div>


);
}

export default ReportTable;
