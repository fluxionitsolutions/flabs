import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white p-4 shadow-md">
      <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
        + Create Appointment
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Appointments</h2>
        <div className="mt-2 space-y-2">
          {/* Repeat this block for each appointment */}
          <div className="p-2 bg-gray-100 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">Aasha Choudhry</div>
              <div className="text-sm text-gray-500">#526520</div>
            </div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
