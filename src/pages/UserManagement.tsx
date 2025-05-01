import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const toggleAccountStatus = async (userId: string, shouldLock: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locked: shouldLock })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: shouldLock ? 'locked' : 'active' }
            : user
        ));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FirstName</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LastName</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button 
                    onClick={() => {/* Open permission modal */}}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Permissions
                  </button>
                  <button 
                    onClick={() => toggleAccountStatus(user.id, user.status !== 'locked')}
                    className={`text-sm ${
                      user.status === 'locked' 
                        ? 'text-green-600 hover:text-green-800' 
                        : 'text-red-600 hover:text-red-800'
                    }`}
                  >
                    {user.status === 'locked' ? 'Unlock' : 'Lock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;