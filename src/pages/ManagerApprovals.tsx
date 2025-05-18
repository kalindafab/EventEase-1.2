import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PendingManager {
  id: string;
  firstname: string;
  lastname: string;
  organization: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ManagerApprovals = () => {
  const [managers, setManagers] = useState<PendingManager[]>([]);
  const [loading, setLoading] = useState(true);
  useAuth();
  

  useEffect(() => {
    const fetchPendingManagers = async () => {
      try {
        const response = await fetch('http://localhost:5297/api/admin/users', {
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
        const data = await response.json();
        setManagers(data.filter((m: PendingManager) => m.status === 'pending'));
      } catch (error) {
        console.error('Failed to fetch managers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingManagers();
  }, []);

  const handleDecision = async (managerId: string, approved: boolean) => {
    try {
      await fetch(`http://localhost:5297/api/admin/managers/${managerId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: approved ? 'approved' : 'rejected' })
      });
      
      // Remove the processed manager from the list
      setManagers(prev => prev.filter(m => m.id !== managerId));
    } catch (error) {
      console.error('Failed to update manager status:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manager Applications</h2>
      
      {managers.length === 0 ? (
        <p className="text-gray-500">No pending applications</p>
      ) : (
        <div className="space-y-3">
          {managers.map(manager => (
            <div key={manager.id} className="border p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {manager.firstname} {manager.lastname}
                  </h3>
                  <p className="text-sm text-gray-600">{manager.organization}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDecision(manager.id, false)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleDecision(manager.id, true)}
                    className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerApprovals;