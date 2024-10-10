import React from 'react';

const OverviewCard = ({ title, value, change, additionalInfo, icon, bgColor, bgColor1 }) => {
  return (
    <div className={`p-4 rounded-2xl shadow ${bgColor}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-gray-700 font-semibold">{title}</h2>
          <div className={`p-4 rounded-full ${bgColor1}`}>
            {icon}
          </div>
        </div>
        <p className="text-2xl font-semibold">{value}</p>
        {change && <p className="text-sm text-green-500 mt-1">{change}</p>}
        {additionalInfo && <p className="text-sm text-gray-500 mt-1">{additionalInfo}</p>}
      </div>
    </div>
  );
};

export default OverviewCard;
