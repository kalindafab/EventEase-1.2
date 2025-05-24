import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface LineGraphProps {
  eventId: string;
}

interface LineGraphData {
  time: string;
  ticketsSold: number;
}

const LineGraph: React.FC<LineGraphProps> = ({ eventId }) => {
  const [data, setData] = useState<LineGraphData[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`http://localhost:5297/api/TicketSale/linegraph/${eventId}`);
        const formattedData = response.data.map((item: LineGraphData) => ({
          ...item,
          time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch graph data:', error);
      }
    };

    fetchGraphData();
  }, [eventId]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50">
      <h2 className="text-lg font-semibold mb-4 text-purple-700 dark:text-purple-400">Ticket Sales Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            strokeOpacity={0.5}
          />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: '#111827'
            }}
            itemStyle={{ color: '#111827' }}
            labelStyle={{ fontWeight: 'bold', color: '#111827' }}
          />
          <Line 
            type="monotone" 
            dataKey="ticketsSold" 
            stroke="#7e22ce" 
            strokeWidth={2} 
            dot={{ fill: '#7e22ce', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#7e22ce', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;