
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type PieData = {
  ticketTypeName: string;
  totalTicketsSold: number;
};

type Props = {
  eventId: string;
};

const COLORS = ['#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF', '#F3E8FF'];

const PieChartDraggable: React.FC<Props> = ({ eventId }) => {
  const [data, setData] = useState<PieData[]>([]);
  const [totalStock, setTotalStock] = useState<number>(1); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<PieData[]>(`http://localhost:5297/api/TicketSale/piechart/${eventId}`);
        const stockRes = await axios.get<number>(`http://localhost:5297/api/TicketSale/total-stock/${eventId}`);
        setData(res.data);
        setTotalStock(stockRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(data);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setData(reordered);
  };

  const formattedData = data.map((d) => ({
    ...d,
    percentage: ((d.totalTicketsSold / totalStock) * 100).toFixed(1),
  }));

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Ticket Type Distribution</h2>
      <PieChart width={350} height={300}>
        <Pie
          data={formattedData}
          dataKey="totalTicketsSold"
          nameKey="ticketTypeName"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {formattedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pie-legend">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="mt-4 space-y-2">
              {formattedData.map((item, index) => (
                <Draggable key={item.ticketTypeName} draggableId={item.ticketTypeName} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex justify-between items-center p-2 border rounded-md bg-purple-100"
                    >
                      <span>{item.ticketTypeName}</span>
                      <span className="text-sm">{item.percentage}%</span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PieChartDraggable;
