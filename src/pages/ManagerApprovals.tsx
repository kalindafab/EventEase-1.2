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
  const { token } = useAuth();

  useEffect(() => {
    const fetchPendingManagers = async () => {
      try {
        const response = await fetch('http://localhost:5297/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
  }, [token]);

  const handleDecision = async (managerId: string, approved: boolean) => {
    try {
      const response = await fetch(`http://localhost:5297/api/admin/managers/${managerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: approved ? 'approved' : 'rejected' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update manager status');
      }
      
      // Remove the processed manager from the list
      setManagers(prev => prev.filter(m => m.id !== managerId));
    } catch (error) {
      console.error('Failed to update manager status:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center bg-white dark:bg-gray-900">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Manager Applications</h2>
      
      {managers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No pending applications</p>
      ) : (
        <div className="space-y-3">
          {managers.map(manager => (
            <div 
              key={manager.id} 
              className="border p-3 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {manager.firstname} {manager.lastname}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{manager.organization}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDecision(manager.id, false)}
                    className="px-3 py-1 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleDecision(manager.id, true)}
                    className="px-3 py-1 text-sm bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
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