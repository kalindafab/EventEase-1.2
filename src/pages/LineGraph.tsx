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
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-purple-700">Ticket Sales Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ticketsSold" stroke="#7e22ce" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
