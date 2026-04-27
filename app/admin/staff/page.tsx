'use client';

import { Users, Plus, ShieldCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function AdminStaff() {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Manager' });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const snap = await getDocs(collection(db, 'staffMembers'));
      let staff: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (staff.length === 0) {
        // Mock data if empty to show it's working
        staff = [
          { id: '1', name: 'Admin User', email: 'admin@website.com', role: 'Administrator', status: 'Active' },
          { id: '2', name: 'Store Manager', email: 'manager@website.com', role: 'Manager', status: 'Active' }
        ];
      }
      
      setStaffMembers(staff);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'staffMembers'), {
        ...formData,
        status: 'Active',
        createdAt: Date.now()
      });
      setStaffMembers([...staffMembers, { id: docRef.id, ...formData, status: 'Active' }]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', role: 'Manager' });
    } catch (err) {
      console.error('Error adding staff:', err);
    }
  };

  const removeStaff = async (id: string) => {
    if (id === '1' || id === '2') {
      alert("Cannot delete mock default users.");
      return;
    }
    if (!confirm('Remove this staff member?')) return;
    try {
      await deleteDoc(doc(db, 'staffMembers', id));
      setStaffMembers(staffMembers.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error removing staff:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl">Team Members</h2>
          <p className="font-body text-gray-500 text-sm">Manage who has access to your store dashboard.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors flex items-center"
        >
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : staffMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No staff members found.</td>
                </tr>
              ) : (
                staffMembers.map(staff => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3 uppercase">
                        {staff.name.charAt(0)}
                      </div>
                      <span className="font-medium text-black">{staff.name}</span>
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
                      <button 
                        onClick={() => removeStaff(staff.id)}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden font-body animate-in slide-in-from-bottom-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-display text-lg text-black">Invite Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none" placeholder="jane@company.com" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:outline-none">
                  <option value="Manager">Manager</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Fulfillment">Fulfillment</option>
                </select>
                <p className="text-gray-500 text-xs mt-2">Roles determine what parts of the admin panel they can view and edit.</p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:text-black">Cancel</button>
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
