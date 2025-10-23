import React from "react";

const UserTable = ({ users, currentUserEmail, onRoleChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    user.role === "admin"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {user.role || "user"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.email !== currentUserEmail ? (
                  <select
                    value={user.role || "user"}
                    onChange={(e) => onRoleChange(user.email, e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bgBtn"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 italic">You</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
