import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';

const PERMISSIONS = {
  admin: ['CanApproveManagers', 'CanManageUsers', 'CanManageSettings', 'CanManageProfile'],
  manager: ['CanCreateEvents', 'CanViewOwnEvents', 'CanViewTicketSales', 'CanManageProfile'],
  client: ['CanBrowseEvents', 'CanViewOwnTickets', 'CanManageProfile','CanViewAllEvents'],
};

const ALL_PERMISSIONS = Array.from(new Set(Object.values(PERMISSIONS).flat()));

const UserManagement = () => {
  useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5297/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

const toggleAccountStatus = async (userId: string, isLocking: boolean) => {
  try {
    const response = await fetch(`http://localhost:5297/api/admin/users/${userId}/lock?isLocked=${isLocking}`, {
      method: 'PUT',
    });

    if (response.ok) {
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status: isLocking ? 'locked' : 'approved' }
          : user
      ));
    } else {
      console.error('Failed to toggle account status');
    }
  } catch (error) {
    console.error('Error toggling account status:', error);
  }
};
const openPermissionModal = (user: User) => {
  setSelectedUser(user);

  const roleDefaults = PERMISSIONS[user.role] || [];
  const manualPermissions = (user.permissions || []).filter(
    (perm) => !roleDefaults.includes(perm)
  );

  setUserPermissions(manualPermissions); // only manual (editable) ones
  setPermissionModalOpen(true);
};

  const savePermissions = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5297/api/admin/users/${selectedUser.id}/addpermissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: userPermissions }),
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user.id === selectedUser.id ? { ...user, permissions: userPermissions } : user
        ));
        setPermissionModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

 const handlePermissionChange = (perm: string) => {
  setUserPermissions(prev =>
    prev.includes(perm)
      ? prev.filter(p => p !== perm)
      : [...prev, perm]
  );
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.firstname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.lastname}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'locked'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs whitespace-nowrap">
                  {user.permissions?.join(', ') || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openPermissionModal(user)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit Permissions
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

      {/* Permission Modal */}
      {permissionModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              Set Permissions for {selectedUser.firstname} {selectedUser.lastname}
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {ALL_PERMISSIONS.map((perm) => (
                <label key={perm} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userPermissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
                    className="accent-blue-600"
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setPermissionModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={savePermissions}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
