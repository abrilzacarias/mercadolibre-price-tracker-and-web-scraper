// PriceHistoryChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { BASE_URL } from '../App';
import { Text,  } from '@chakra-ui/react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

function PriceHistoryChart({ productId }) {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch( BASE_URL + `/chart_price_history/${productId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setPriceHistory(data);
      } catch (error) {
        console.error("Error fetching price history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchPriceHistory();
    }
  }, [productId]);

  const data = {
    labels: priceHistory.map(ph => new Date(ph.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: priceHistory.map(ph => ph.price),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Price: $${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <>
      <Text fontSize="lg" fontWeight="bold">Price History</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Line data={data} options={options} />
      )}
    </>
  );
}

export default PriceHistoryChart;
