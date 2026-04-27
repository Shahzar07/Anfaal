'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status });
    loadOrders();
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Orders</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white border text-sm font-body border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                  <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {o.customer?.firstName} {o.customer?.lastName}<br/>
                    <span className="text-gray-500 text-xs">{o.customer?.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    {o.items?.map((item: any) => (
                      <div key={item.productId + item.size} className="text-xs">
                        {item.quantity}x {item.name} ({item.size})
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-medium">PKR {o.total?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={o.status || 'pending'} 
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`border px-2 py-1 text-xs uppercase tracking-wider ${o.status === 'delivered' ? 'bg-green-50' : 'bg-yellow-50'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-xs uppercase tracking-wider">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
