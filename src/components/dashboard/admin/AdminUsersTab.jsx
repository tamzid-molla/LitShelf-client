import React from "react";
import UserTable from "../UserTable";

const AdminUsersTab = ({ allUsers, userData, handleRoleChange }) => {
  return (
    <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user roles and permissions</p>
      </div>
      <UserTable
        users={allUsers}
        currentUserEmail={userData.email}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default AdminUsersTab;