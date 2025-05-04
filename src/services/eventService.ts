interface TicketTypeDto {
  name: string;
  price: number;
  initialStock: number;
}

interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image?: File;
}

const API_BASE_URL = 'http://localhost:5297/api/Event';

const API_TiCKET_URL = 'http://localhost:5297/api/TicketType';

// Create Event (assuming this now works)
export const createEvent = async (eventData: EventFormData, token: string) => {
  const formData = new FormData();
  formData.append('Name', eventData.name);
  formData.append('Description', eventData.description);
  formData.append('Date', eventData.date);
  formData.append('Time', eventData.time);
  formData.append('Venue', eventData.venue);
  formData.append('Category', eventData.category);
  if (eventData.image) {
    formData.append('Image', eventData.image);
  }

  console.log('Sending FormData:', Object.fromEntries(formData));

  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to create event: ${response.status}`);
    }

    const result = await response.json();
    console.log('CreateEvent response:', result);
    return result;
  } catch (error) {
    console.error('API Error (Create Event):', error);
    throw error;
  }
};

// Create Ticket Types
export const createTicketTypes = async (
  eventId: string,
  ticketTypes: TicketTypeDto[],
  token: string
) => {
  if (!eventId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
    console.error('Invalid eventId:', eventId);
    throw new Error('Invalid event ID');
  }

  if (!ticketTypes || ticketTypes.length === 0) {
    console.error('No ticket types provided');
    throw new Error('At least one ticket type is required');
  }

  const payload = {
    eventId,
    ticketTypes: ticketTypes.map(ticket => ({
      Name: ticket.name,
      Price: Math.floor(ticket.price),
      InitialStock: Math.floor(ticket.initialStock),
    })),
  };

  console.log('Ticket Types Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_TiCKET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Ticket Types Response Status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Ticket Types Error Response:', error);
      throw new Error(error.error || `Failed to create ticket types: ${response.status}`);
    }

    const result = await response.json();
    console.log('Ticket Types Response:', result);
    return result;
  } catch (error) {
    console.error('API Error (Create Ticket Types):', error);
    throw error;
  }
};