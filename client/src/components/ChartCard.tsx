import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartCardProps {
  title: string;
  fetchData: () => Promise<any>;
  chartOptions: any;
}

const ChartCard = ({ title, fetchData, chartOptions }: ChartCardProps) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      setChartData(data);
    };
    getData();
  }, [fetchData]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-center text-blue-400 mb-4">{title}</h3>
      {chartData ? <Bar data={chartData} options={chartOptions} /> : <p>Loading...</p>}
    </div>
  );
};

export default ChartCard;