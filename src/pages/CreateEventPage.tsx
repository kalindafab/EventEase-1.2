// src/pages/CreateEventPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { createEvent } from '../services/eventService';
import { 
  MapPin, Tag, BookOpen,
  Building2, Ticket, Plus, Trash2, ArrowLeft, XCircle

} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, token} = useAuth();
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  

  const categories = [
    'Music', 'Sports', 'Food & Drink', 'Arts',
    'Business', 'Technology', 'Education', 'Other'
  ];

  // Form state (removed organizer)
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    image: null as File | null,
    organizer: user?.lastname|| 'My Organization',

  });

  // Ticket types state with initialStock
  const [ticketTypes, setTicketTypes] = useState([
    { id: 1, name: 'VIP', price: 0, initialStock: 0 }
  ]);

  // Form handlers
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };


  const handleTicketChange = (id: number, field: string, value: string) => {
    setTicketTypes(prev => prev.map(ticket =>
      ticket.id === id
        ? {
            ...ticket,
            [field]: field === 'price' || field === 'initialStock' ? parseInt(value) || 0 : value
          }
        : ticket
    ));
  };

  const addTicketType = () => {
    setTicketTypes(prev => [...prev, {
      id: Date.now(),
      name: '',
      price: 0,
      initialStock: 0
    }]);
  };

  const removeTicketType = (id: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(prev => prev.filter(ticket => ticket.id !== id));
    }
  };

  // Validation
  const validateStep1 = () => {
    return (
      eventData.name.trim() !== '' &&
      eventData.description.trim() !== '' &&
      eventData.date !== '' &&
      eventData.time !== '' &&
      eventData.venue.trim() !== '' &&
      eventData.category !== ''
    );
  };

  const validateStep2 = () => {
    return ticketTypes.every(ticket =>
      ticket.name.trim() !== '' &&
      ticket.price >= 0 &&
      ticket.initialStock >= 0
    );
  };

  // Form submission
  // src/pages/CreateEventPage.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  if (!token) {
    setError('User is not authenticated');
    setIsSubmitting(false);
    return;
  }

  try {
    console.log('Creating event with data:', eventData);
    const createdEvent = await createEvent({
      ...eventData,
      image: eventData.image || undefined,
    }, token);

    console.log('Created event:', createdEvent);

    if (!createdEvent.id) {
      throw new Error('Event was created but no ID was returned');
    }


    if (ticketTypes.length === 0) {
      throw new Error('At least one ticket type is required');

    
    try {
      const tickets = ticketTypes.map(({ name, price }) => ({ name, price }));
      
      
      const createdEvent = await createEvent({
        ...eventData,
         image: eventData.image || undefined
        
      }, tickets,token);
     
      console.log('API Response:', createdEvent);
  
      if (!createdEvent.id) {
        throw new Error('Event was created but no ID was returned');
      }
      setCreatedEventId(createdEvent.id);
      console.log('Submitting event with data:', {
        eventData,
        ticketTypes,
        token,
      });
      alert('Event created successfully! please upload an Image');

    } catch (error) {
      let errorMessage = 'Failed to create event';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Handle specific error cases
        if (error.message.includes('Failed to connect')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('Server responded')) {
          errorMessage = `Server error: ${error.message}`;
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);

    }

    const tickets = ticketTypes.map(({ name, price, initialStock }) => ({
      name: name.trim(),
      price: Math.floor(Number(price)),
      initialStock: Math.floor(Number(initialStock)),
    }));

    console.log('Creating ticket types:', { eventId: createdEvent.id, tickets });

    await createTicketTypes(createdEvent.id, tickets, token);

    alert('Event and ticket types created successfully!');
    navigate(`/event/${createdEvent.id}`);
  } catch (error) {
    let errorMessage = 'Failed to create event or ticket types';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Submission error:', error);
    }
    setError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleImageUpload = async () => {
  if (!eventData.image || !createdEventId || !token) {
    setError("Please select an image.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", eventData.image);

    const res = await fetch(`http://localhost:5297/api/Event/upload-Image/${createdEventId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    alert("Image uploaded successfully!");
    setCreatedEventId(null);
    navigate("/dashboard"); // or wherever you want
  } catch (err: any) {
    setError(err.message || "Upload failed");
  }
};


  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Create New Event</h1>
        <p className="text-gray-600 text-sm mb-6">
          Fill in the details below to create your event. You'll be able to add ticket types and pricing in the next step.
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex mb-6">
          <div
            className={`flex-1 border-b-2 pb-2 ${step === 1 ? 'border-primary-500' : 'border-gray-200'}`}
          >
            <div className={`flex items-center justify-center ${step === 1 ? 'text-primary-500' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 text-sm ${step === 1 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                1
              </span>
              <span className="font-medium text-sm">Event Details</span>
            </div>
          </div>
          <div
            className={`flex-1 border-b-2 pb-2 ${step === 2 ? 'border-primary-500' : 'border-gray-200'}`}
          >
            <div className={`flex items-center justify-center ${step === 2 ? 'text-primary-500' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 text-sm ${step === 2 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                2
              </span>
              <span className="font-medium text-sm">Ticket Types</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Event Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={eventData.name}
                      onChange={handleEventChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter event name"
                      required
                    />
                    <BookOpen className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventData.description}
                    onChange={handleEventChange}
                    rows={3}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell people what your event is about..."
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={eventData.date}
                      onChange={handleEventChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={eventData.time}
                      onChange={handleEventChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue/Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={eventData.venue}
                      onChange={handleEventChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Where is your event taking place?"
                      required
                    />
                    <MapPin className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={eventData.category}
                      onChange={handleEventChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Tag className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>


                {/* Organizer */}
                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="organizer"
                      name="organizer"
                      value={eventData.organizer}
                      onChange={handleEventChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 bg-gray-100"
                      readOnly
                    />
                    <Building2 className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) {
                      setStep(2);
                    } else {
                      setError('Please fill all required fields');
                    }
                  }}
                  className="btn-primary px-4 py-2 text-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Next: Ticket Types
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Ticket Types */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">Ticket Types</h2>
              <p className="text-gray-600 text-sm mb-4">
                Add different ticket types for your event (e.g., Table of 8, VIP, Early Bird, etc.)
              </p>

              <div className="space-y-4">
                {ticketTypes.map(ticket => (
                  <div key={ticket.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor={`ticket-name-${ticket.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Ticket Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={`ticket-name-${ticket.id}`}
                            value={ticket.name}
                            onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., General Admission"
                            required
                          />
                          <Ticket className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`ticket-price-${ticket.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Price (Frw)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id={`ticket-price-${ticket.id}`}
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(ticket.id, 'price', e.target.value)}
                            min="0"
                            step="1" // Enforce integers
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                          <span className="absolute right-3 top-2 text-gray-500 text-sm">Frw</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`ticket-stock-${ticket.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Initial Stock
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id={`ticket-stock-${ticket.id}`}
                            value={ticket.initialStock}
                            onChange={(e) => handleTicketChange(ticket.id, 'initialStock', e.target.value)}
                            min="0"
                            step="1" // Enforce integers
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                          <span className="absolute right-3 top-2 text-gray-500 text-sm">Qty</span>
                        </div>
                      </div>
                    </div>
                    {ticketTypes.length > 1 && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeTicketType(ticket.id)}
                          className="text-red-600 hover:text-red-800 flex items-center text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center">
                  <motion.button
                    type="button"
                    onClick={addTicketType}
                    className="btn-outline flex items-center px-3 py-1.5 text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Ticket Type
                  </motion.button>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline px-4 py-2 text-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  className="btn-primary px-4 py-2 text-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={!validateStep2() || isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>
        {createdEventId && (
  <div className="mt-8 border-t pt-6">
    <h2 className="text-lg font-bold mb-2">Upload Event Image</h2>

    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setEventData((prev) => ({ ...prev, image: e.target.files![0] }));
          }
        }}
      />

      {eventData.image && (
        <img
          src={URL.createObjectURL(eventData.image)}
          alt="Preview"
          className="w-full h-48 object-cover rounded"
        />
      )}

      <button
        onClick={handleImageUpload}
        className="btn-primary px-4 py-2"
        disabled={!eventData.image}
      >
        Upload Image
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default CreateEventPage;