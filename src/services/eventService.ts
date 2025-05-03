// src/services/eventService.ts

import { useAuth } from "../contexts/AuthContext";

interface TicketTypeDto {
    name: string;
    price: number;
  }
  
  interface EventFormData {
    name: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    image?: File;
    organizer: string;
  }
  
  const API_BASE_URL = 'http://localhost:5297/api/Event';

  
  
  export const createEvent = async (
eventData: EventFormData, ticketTypes: TicketTypeDto[], token: string,
   
  ) => {
    
    const formData = new FormData();
  
    // Append all event fields
    formData.append('Name', eventData.name);
    formData.append('Description', eventData.description);
    formData.append('Date', eventData.date);
    formData.append('Time', eventData.time);
    formData.append('Venue', eventData.venue);
    formData.append('Category', eventData.category);
    formData.append('Organizer', eventData.organizer);
  
    // Append image if exists
    if (eventData.image) {
      formData.append('Image', eventData.image);
    }
  
    // Append each ticket type separately
    ticketTypes.forEach(ticket => {
      formData.append('TicketTypes', JSON.stringify(ticket));
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          
        }
      });
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create event');
      }
  
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };