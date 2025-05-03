// src/services/eventService.ts
interface TicketTypeDto {
    name: string;  // Changed from 'Name' to 'name'
    price: number; // Changed from 'Price' to 'price'
  }
  
  interface EventDto {
    name: string;      // Changed from 'Name'
    description: string; // Changed from 'Description'
    date: string;      // Changed from 'Date'
    time: string;      // Added this field
    venue: string;     // Changed from 'Venue'
    category: string;  // Changed from 'Category'
    image?: File;
    organizerId?: string;
    ticketTypes: TicketTypeDto[];
  }
  
  const API_BASE_URL = 'http://localhost:5297/api/Event'; // Updated port to 5297
  
  export const createEvent = async (eventData: Omit<EventDto, 'ticketTypes'>, ticketTypes: TicketTypeDto[]) => {
    const formData = new FormData();
    
    // Append all fields with correct casing
    formData.append('Name', eventData.name);
    formData.append('Description', eventData.description);
    formData.append('Date', eventData.date);
    formData.append('Time', eventData.time);
    formData.append('Venue', eventData.venue);
    formData.append('Category', eventData.category);
    
    // Append image if exists
    if (eventData.image) {
      formData.append('Image', eventData.image);
    }
    
    // Append each ticket type separately
    ticketTypes.forEach(ticket => {
      formData.append('TicketTypes', JSON.stringify(ticket));
    });
  
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'accept': '*/*'
      }
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create event');
    }
  
    return await response.json();
  };