import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarController, BarElement);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });

  const [selectedDays, setSelectedDays] = useState(14);
  const [isCustom, setIsCustom] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://localhost:8080/api/statistic/get-revenue-by-day/${selectedDays}`;
        if (isCustom) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
          // const data = result.data;
          // console.log('data :>> ', data);
        }
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;

        if (Array.isArray(data)) {
          let allLabels = [];
          let allData = [];

          if (selectedDays == 12 || selectedDays == 6) {
            allLabels = Array.from({ length: selectedDays }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - selectedDays + i + 1);
              return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
            });

            allData = allLabels.map(label => {
              const item = data.find(item => item.time.slice(0, 7) === label);
              return item ? Number(item.revenue) * 1000 : 0;
            });
          }
          else if (selectedDays == 7 || selectedDays == 14) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - selectedDays + 1);
            for (let i = 0; i < selectedDays; i++) {
              const date = new Date(startDate);
              date.setDate(date.getDate() + i);
              const label = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
              allLabels.push(label);
              const item = data.find(item => item.time === label);
              allData.push(item ? Number(item.revenue) * 1000 : 0);
            }
            console.log('allData1 :>> ', allData);

            // allLabels = data.map(item => item.time);
            // allData = data.map(item => item.revenue);
          }
          else if (isCustom) {

            // Chuyển đổi startDate và endDate thành đối tượng Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Tính số ngày giữa start và end
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Tạo vòng lặp để tạo ra các nhãn và dữ liệu
            for (let i = 0; i <= diffDays; i++) {
              const date = new Date(start);
              date.setDate(date.getDate() + i);
              const label = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
              allLabels.push(label);
              const item = data.find(item => item.time === label);
              allData.push(item ? Number(item.revenue) * 1000 : 0);
            }
            console.log('allData :>> ', allData);
            // allLabels = data.map(item => item.time);
            // allData = data.map(item => item.revenue);
          }

          setChartData({
            labels: allLabels,
            datasets: [
              {
                label: 'Doanh thu',
                data: allData,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.log('Not Array...');
        }
      } catch (error) {
        console.error('Fail when call API...', error);
      }
    };

    fetchData();
  }, [selectedDays, isCustom, startDate, endDate]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedDays(value);
    setIsCustom(value === 'custom');
  };

  return (
    <div className="m-[20px]">
      <h1 className="h-[75px] w-full flex justify-between items-center text-3xl font-bold px-4 border-b top-0 ">
        <span>Revenue Statistic</span>
      </h1>
      <select value={selectedDays} onChange={handleSelectChange}>
        <option value="7">7 ngày gần đây</option>
        <option value="14">14 ngày gần đây</option>
        <option value="6">6 tháng gần nhất</option>
        <option value="12">12 tháng gần đây</option>
        <option value="custom">Tùy chỉnh</option>
      </select>
      {isCustom && (
        <div className='gap-2 flex mt-4 items-center'>
          <label>Start date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='border p-1 cursor-pointer' />
          <label>End date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='border p-1 cursor-pointer' />
        </div>
      )}
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: Math.round(Math.max(...chartData.datasets[0].data) * 100) / 100 * 1.2,
            },
            x: {
              type: 'category',
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  const formattedValue = value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                  return `Doanh thu: ${formattedValue} (Tháng: ${label})`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Dashboard;