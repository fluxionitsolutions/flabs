import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = () => {
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Sales',
        data: [7500, 7200, 7100, 7000, 6300, 6500, 7158],
        fill: false,
        backgroundColor: 'red',
        borderColor: 'red',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart takes full height
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const totalSales = data.datasets[0].data.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white w-auto shadow p-4 rounded-2xl h-full flex flex-col">
      <h3 className="text-lg mb-1">Revenue this week</h3>
      <p className="text-2xl font-extrabold text-black mb-4"> ₹ {totalSales}</p>
      <div className="flex-grow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
