import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type TicketType = {
  id: string;
  name: string;
  price: number;
  availableQuantity: number;
};

const BuyTicket: React.FC = () => {
  const { token } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const [tickets, setTickets] = useState<TicketType[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get<TicketType[]>(
          `http://localhost:5297/api/TicketType/event/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTickets(response.data);
      } catch (err) {
        console.error('Error fetching ticket types:', err);
      }
    };

    if (token && eventId) fetchTickets();
  }, [token, eventId]);

  const handleBuy = async (ticketTypeId: string) => {
    try {
      await axios.post(
        `http://localhost:5297/api/Ticket/buy`,
        { ticketTypeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Ticket purchased successfully!');
    } catch (err) {
      console.error('Failed to buy ticket:', err);
      alert('Failed to buy ticket');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">Buy Tickets</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border p-4 rounded-lg shadow-md dark:shadow-gray-700/50 flex justify-between items-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{ticket.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">${ticket.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available: {ticket.availableQuantity}</p>
            </div>
            <button
              onClick={() => handleBuy(ticket.id)}
              className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyTicket;