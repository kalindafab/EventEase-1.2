import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface TicketType {
  id: string;
  name: string;
  price: number;
  initialStock: number;
}

const TicketSelectionPage: React.FC = () => {
  const { id: eventId } = useParams();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const buyerId = "3C11BC2A-A545-4D4E-8117-13C58B2A28FF"; 

  useEffect(() => {
    axios
      .get<TicketType[]>(`http://localhost:5297/api/TicketType/event/${eventId}`)
      .then((response) => {
        setTicketTypes(response.data);
        if (response.data.length > 0) {
          setSelectedTypeId(response.data[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching ticket types:", error);
      });
  }, [eventId]);

  useEffect(() => {
    const qty = parseInt(quantity) || 0;
    const selected = ticketTypes.find((t) => t.id === selectedTypeId);
    if (selected) {
      setTotalPrice(qty * selected.price);
    } else {
      setTotalPrice(0);
    }
  }, [quantity, selectedTypeId, ticketTypes]);

  const handlePurchase = async () => {
    const qty = parseInt(quantity);
    const selected = ticketTypes.find((t) => t.id === selectedTypeId);

    if (!selected || isNaN(qty) || qty <= 0) {
      alert("Enter a valid quantity.");
      return;
    }

    try {
      await axios.post("http://localhost:5297/api/TicketSale/buy", {
        ticketTypeId: selected.id,
        buyerId,
        eventId,
        quantity: qty,
      });
      alert("Purchase successful!");
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-5xl mx-auto">
      {/* Left: Ticket Types */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Available Ticket Types</h2>
        {ticketTypes.map((ticket) => (
          <div key={ticket.id} className="p-4 mb-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{ticket.name}</h3>
            <p className="text-gray-700">
              Price: <span className="text-blue-600">frw {ticket.price}</span>
            </p>
            <p className="text-gray-500">Available: {ticket.initialStock}</p>
          </div>
        ))}
      </div>

      {/* Right: Purchase */}
      <div className="w-full md:w-80 bg-white p-6 border rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Purchase Ticket</h3>

        <label className="block mb-3">
          <span className="text-gray-700">Select Ticket Type:</span>
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          >
            {ticketTypes.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.name} - frw {ticket.price}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Quantity:</span>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter quantity"
          />
        </label>

        <div className="mb-4 text-right font-medium text-gray-800">
          Total: <span className="text-green-600">frw {totalPrice}</span>
        </div>

        <button
          onClick={handlePurchase}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default TicketSelectionPage;
