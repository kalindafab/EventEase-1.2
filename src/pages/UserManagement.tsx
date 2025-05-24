// components/UserManagement.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';
import { toast } from 'react-toastify';

const PERMISSIONS = {
  admin: ['CanApproveManagers', 'CanManageUsers', 'CanManageSettings', 'CanManageProfile'],
  manager: ['CanCreateEvents', 'CanViewOwnEvents', 'CanViewTicketSales', 'CanManageProfile'],
  client: ['CanBrowseEvents', 'CanViewOwnTickets', 'CanManageProfile', 'CanViewAllEvents'],
};

const ALL_PERMISSIONS = Array.from(new Set(Object.values(PERMISSIONS).flat()));

interface AuditLogEntry {
  id: string;
  action: string;
  status: string;
  timestamp: string;
  details: string | null;
}

interface AuditLogResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  logsByDate: { [date: string]: AuditLogEntry[] };
}

const UserManagement = () => {
  useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) {
        throw new Error('No authentication data available');
      }
      const { token } = JSON.parse(storedAuth);

      const response = await fetch('http://localhost:5297/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) {
        throw new Error('No authentication data available');
      }
      const { token } = JSON.parse(storedAuth);

      const response = await fetch('http://localhost:5297/api/admin/audit-logs', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data);
      toast.success('Audit logs loaded successfully');
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    }
  };

  const toggleAccountStatus = async (userId: string, isLocking: boolean) => {
    try {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) {
        throw new Error('No authentication data available');
      }
      const { token } = JSON.parse(storedAuth);

      const response = await fetch(
        `http://localhost:5297/api/admin/users/${userId}/lock?isLocked=${isLocking}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId
              ? { ...user, status: isLocking ? 'locked' : 'approved' }
              : user
          )
        );
        toast.success(`User ${isLocking ? 'locked' : 'unlocked'} successfully`);
      } else {
        throw new Error('Failed to toggle account status');
      }
    } catch (error) {
      console.error('Error toggling account status:', error);
      toast.error('Failed to toggle account status');
    }
  };

  const openPermissionModal = (user: User) => {
    setSelectedUser(user);
    const roleDefaults = PERMISSIONS[user.role] || [];
    const manualPermissions = (user.permissions || []).filter(
      (perm) => !roleDefaults.includes(perm)
    );
    setUserPermissions(manualPermissions);
    setPermissionModalOpen(true);
  };

  const savePermissions = async () => {
    if (!selectedUser) return;

    try {
      const storedAuth = localStorage.getItem('auth');
      if (!storedAuth) {
        throw new Error('No authentication data available');
      }
      const { token } = JSON.parse(storedAuth);

      const response = await fetch(
        `http://localhost:5297/api/admin/users/${selectedUser.id}/addpermissions`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ permissions: userPermissions }),
        }
      );

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? { ...user, permissions: userPermissions } : user
          )
        );
        setPermissionModalOpen(false);
        setSelectedUser(null);
        toast.success('Permissions updated successfully');
      } else {
        throw new Error('Failed to save permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    }
  };

  const handlePermissionChange = (perm: string) => {
    setUserPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  FirstName
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  LastName
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.firstname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.lastname}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'locked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
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

      {/* Audit Logs Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Audit Logs</h2>
        <button
          onClick={fetchAuditLogs}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load Audit Logs
        </button>
        {auditLogs.length === 0 ? (
          <p className="text-gray-500">No audit logs available.</p>
        ) : (
          <div className="space-y-6">
            {auditLogs.map((log) => (
              <div key={log.userId} className="overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {log.firstName} {log.lastName} ({log.email})
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(log.logsByDate).flatMap(([date, entries]) =>
                      entries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.action.toLowerCase().includes('login') ? (
                              <span className="inline-block w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                              </span>
                            ) : entry.action.toLowerCase().includes('logout') ? (
                              <span className="inline-block w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                              </span>
                            ) : (
                              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.details || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;