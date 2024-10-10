import React from 'react';
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";


const data = [
  { id: "828", name: "Syringe 2ml", section: "Hematology", rate:  "50", unit:"ml/L",  normal: "Adult : 16-46, Child: 12-14" },
  { id: "897", name: "Syringe 2ml", section: "Hematology", rate:  "50", unit:"ml/L",  normal: "Adult : 16-46, Child: 12-14" },
  { id: "756", name: "Syringe 2ml", section: "Hematology", rate:  "50", unit:"ml/L",  normal: "Adult : 16-46, Child: 12-14" },
  { id: "354", name: "Syringe 2ml", section: "Hematology", rate:  "50", unit:"ml/L",  normal: "Adult : 16-46, Child: 12-14" },
];

function NewGroupEntry() {

  return (
    <div className="bg-white p-10 rounded-lg flex-grow h-full overflow-auto hide-scrollbar">
      <h2 className="text-xl font-normal mb-4">New Test Group</h2>
      <p className="text-md mb-4">Group Details</p>
      <form className="space-y-4 p-2">
        <div className='flex justify-between gap-2 w-3/5'>
          <input type="text" placeholder="Group Name" className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"/>
          <input type="text" placeholder="Group Code" className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"/>
        </div>
        <div className='flex justify-between gap-2 w-3/5'>
          <input type="text" placeholder="Section" className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"/>
          <input type="text" placeholder="Rate" className="w-full p-2 border border-gray-100 bg-gray-100 rounded placeholder:text-sm placeholder:text-gray-500"/>
        </div>

        <div className='flex flex-col gap-2 pt-10'>
            <div className="flex justify-between items-center">
                <h3 className="text-lg">Tests</h3>
                <div className='p-2 rounded-lg bg-blue-600'>
                    <FiPlus size={15} color='white' />
                </div>
            </div>

            <div className="rounded-lg mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-b text-gray-500 text-sm font-normal text-left">ID</th>
                  <th className="p-2 border-b text-left text-gray-500 font-normal text-sm">Name</th>
                  <th className="p-2 border-b text-left text-gray-500 font-normal text-sm">Section</th>
                  <th className="p-2 border-b text-left text-gray-500 font-normal text-sm">Rate</th>
                  <th className="p-2 border-b text-left text-gray-500 font-normal text-sm">Unit</th>
                  <th className="p-2 border-b text-left text-gray-500 font-normal text-sm">Normal Range</th>
                  <th className="p-2 border-b text-left text-gray-500 font-normal text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className=" text-gray-500 font-normal text-sm p-2">{row.id}</td>
                    <td className="font-normal text-sm p-2">{row.name}</td>
                    <td className="font-normal text-sm p-2">{row.section}</td>
                    <td className="font-normal text-sm p-2">{row.rate}</td>
                    <td className="font-normal text-sm p-2">{row.unit}</td>
                    <td className="font-normal text-sm p-2">{row.normal}</td>
                    <td>
                      <span className="flex items-center justify-center w-6 h-6 bg-rose-100 rounded-lg">
                        <MdDelete size={15} color='red' />
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>

                
            </div>
        </div>


        <div className='flex justify-between gap-5 w-full'>
          <button type="submit" className="w-40 py-2 bg-btnblue text-white border border-gray-200 rounded-xl ml-auto">Save</button>
        </div>
      </form>
    </div>
  );
}

export default NewGroupEntry;
