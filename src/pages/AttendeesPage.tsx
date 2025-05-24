import { useState } from 'react';

const sampleAttendees = [
  { name: 'John Doe', email: 'john@example.com', ticketType: 'Regular' },
  { name: 'Jane Smith', email: 'jane@example.com', ticketType: 'VIP' },
  { name: 'Alice Johnson', email: 'alice@example.com', ticketType: 'VVIP' },
  { name: 'Bob Brown', email: 'bob@example.com', ticketType: 'Regular' },
];

const AttendeesPage = () => {
  const [filter, setFilter] = useState('All');

  const filteredAttendees = filter === 'All'
    ? sampleAttendees
    : sampleAttendees.filter(a => a.ticketType === filter);

  return (
    <div className="p-6 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Event Attendees</h2>
      
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 text-gray-700 dark:text-gray-300">Filter by Ticket Type:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          <option value="All">All</option>
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
          <option value="VVIP">VVIP</option>
        </select>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border p-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Name</th>
            <th className="border p-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Email</th>
            <th className="border p-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Ticket Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendees.map((attendee, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="border p-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">{attendee.name}</td>
              <td className="border p-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">{attendee.email}</td>
              <td className="border p-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">{attendee.ticketType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendeesPage;