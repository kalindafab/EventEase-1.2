
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const sampleAttendees = [
  { name: 'John Doe', email: 'john@example.com', ticketType: 'Regular' },
  { name: 'Jane Smith', email: 'jane@example.com', ticketType: 'VIP' },
  { name: 'Alice Johnson', email: 'alice@example.com', ticketType: 'VVIP' },
  { name: 'Bob Brown', email: 'bob@example.com', ticketType: 'Regular' },
];

const AttendeesPage = () => {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAttendees = filter === 'All'
    ? sampleAttendees
    : sampleAttendees.filter(a => a.ticketType === filter);

  const handleDownload = (type: string) => {
    if (type === 'pdf') {
      try {
        const doc = new jsPDF();

        // App Details
        const appDetails = {
          name: 'EventEase 1.2',
          email: 'eventease39@gmail.com',
          contact: '+250 789 228 628',
          website: 'www.eventEase1.2.com',
          address: 'Area 51, Kigali, Rwanda',
        };

        // Header: App Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(appDetails.name, 20, 20);

        // Add logo (uncomment and replace with PNG/JPEG if available)
        // doc.addImage('src/assets/favicon.png', 'PNG', 150, 10, 40, 20); // Use PNG or JPEG

        // Header: Contact Details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Email: ${appDetails.email}`, 20, 30);
        doc.text(`Contact: ${appDetails.contact}`, 20, 35);
        doc.text(`Website: ${appDetails.website}`, 20, 40);
        doc.text(`Address: ${appDetails.address}`, 20, 45);

        // Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Event Attendees List', 20, 60);

        // Date and Filter Information
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const today = new Date().toLocaleDateString();
        doc.text(`Generated on: ${today}`, 20, 70);
        doc.text(`Filter: ${filter}`, 20, 75);

        // Table Setup: Manual Rendering
        const startX = 20;
        const startY = 85;
        const rowHeight = 10;
        const colWidths = [60, 80, 40]; // Widths for Name, Email, Ticket Type
        let y = startY;

        // Draw Header
        doc.setFont('helvetica', 'bold');
        doc.text('Name', startX, y);
        doc.text('Email', startX + colWidths[0], y);
        doc.text('Ticket Type', startX + colWidths[0] + colWidths[1], y);
        y += rowHeight;

        // Draw Header Border
        doc.setLineWidth(0.2);
        doc.rect(startX - 5, y - rowHeight - 2, colWidths.reduce((a, b) => a + b, 0) + 10, rowHeight, 'S');

        // Draw Attendee Rows
        doc.setFont('helvetica', 'normal');
        filteredAttendees.forEach((attendee) => {
          doc.text(attendee.name, startX, y);
          doc.text(attendee.email, startX + colWidths[0], y);
          doc.text(attendee.ticketType, startX + colWidths[0] + colWidths[1], y);
          // Draw Row Border
          doc.rect(startX - 5, y - rowHeight - 2, colWidths.reduce((a, b) => a + b, 0) + 10, rowHeight, 'S');
          y += rowHeight;
        });

        // Draw Outer Table Border
        doc.rect(
          startX - 5,
          startY - 2,
          colWidths.reduce((a, b) => a + b, 0) + 10,
          y - startY + 2,
          'S'
        );

        // Footer: Page Numbers and App Name
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `${appDetails.name} | Page ${i} of ${pageCount}`,
            20,
            doc.internal.pageSize.height - 10
          );
        }

        doc.save('EventEase_Attendees.pdf');
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    } else if (type === 'excel') {
      try {
        const ws = XLSX.utils.json_to_sheet(filteredAttendees);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendees');
        XLSX.writeFile(wb, 'EventEase_attendees_sheet.xlsx');
      } catch (error) {
        console.error('Excel generation failed:', error);
        alert('Failed to generate Excel file. Please try again.');
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event Attendees</h2>
      
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label htmlFor="filter" className="mr-2">Filter by Ticket Type:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="All">All</option>
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
            <option value="VVIP">VVIP</option>
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Ticket Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendees.map((attendee, index) => (
            <tr key={index}>
              <td className="border p-2">{attendee.name}</td>
              <td className="border p-2">{attendee.email}</td>
              <td className="border p-2">{attendee.ticketType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Select Download Format</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleDownload('pdf')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                PDF
              </button>
              <button
                onClick={() => handleDownload('excel')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Excel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeesPage;