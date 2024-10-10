
import React from 'react';
import { IoTrendingUpOutline } from "react-icons/io5";

const Card = ({ title,head, description }) => {
  return (
    <div className="w-1/3 h-32 bg-white rounded-2xl shadow-lg overflow-hidden ">
      <div className="ml-8 ">
        <h4 className="text-base mt-4">{title}</h4>
        <p className="text-2xl font-bold mt-2">{head}</p>
        <IoTrendingUpOutline className='text-green-500 mt-2 w-6 h-6' />
        <p className="text-base -mt-6 ml-8">
          <span className="text-green-500 font-bold">1.8%</span> {description}
        </p>
      </div>
    </div>
  );
};

export default Card;
