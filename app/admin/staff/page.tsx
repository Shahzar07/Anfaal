'use client';

import { Users, Plus, ShieldCheck } from 'lucide-react';

export default function AdminStaff() {
  const staffMembers = [
    { id: 1, name: 'Admin User', email: 'admin@website.com', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Store Manager', email: 'manager@website.com', role: 'Manager', status: 'Active' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl">Team Members</h2>
          <p className="font-body text-gray-500 text-sm">Manage who has access to your store dashboard.</p>
        </div>
        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors flex items-center">
          <Plus size={16} className="mr-2" />
          Add Staff
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffMembers.map(staff => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                      {staff.name.charAt(0)}
                    </div>
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{staff.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${staff.role === 'Administrator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {staff.role === 'Administrator' && <ShieldCheck size={12} className="mr-1" />}
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-black font-medium transition-colors">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
