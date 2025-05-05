/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    category: string;
    imagePath: string;
  }
  
  export interface TicketType {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  const API_URL = 'http://localhost:5297/api'; // Adjust to your backend URL
  
  export const getMyEvents = async (token: string): Promise<Event[]> => {
    if (!token) {
      throw new Error('No authentication token provided');
    }
  
    const response = await fetch(`${API_URL}/Event/my-events`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }
  
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    // Select specific fields and ignore ticketTypes
    return data.map((event: any) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.venue,
      category: event.category,
      imagePath: event.imagePath || '/placeholder-image.jpg',
    }));
  };
  
  export const getTicketTypesByEventId = async (token: string, eventId: string): Promise<TicketType[]> => {
    if (!token) {
      throw new Error('No authentication token provided');
    }
  
    const response = await fetch(`${API_URL}/TicketType/event/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }
  
    if (!response.ok) {
      throw new Error(`Failed to fetch ticket types: ${response.status}`);
    }
  
    const data = await response.json();
    return data.map((ticket: any) => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.initialStock,
    }));
  };