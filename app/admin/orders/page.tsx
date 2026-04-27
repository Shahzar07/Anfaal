'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { X } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Orders</h2>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border shadow-sm rounded-xl overflow-hidden font-body text-sm border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                    <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-black">{o.customer?.firstName} {o.customer?.lastName}</div>
                      <div className="text-gray-500 text-xs">{o.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {o.items?.map((item: any) => (
                        <div key={item.productId + item.size} className="text-xs">
                          {item.quantity}x <span className="truncate max-w-[150px] inline-block align-bottom">{item.name}</span> ({item.size})
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-medium">PKR {o.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={o.status || 'pending'} 
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`border rounded-md px-2 py-1 text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black ${o.status === 'delivered' ? 'bg-green-50 text-green-800' : o.status === 'cancelled' ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="text-blue-600 hover:text-blue-800 text-xs uppercase tracking-wider font-medium font-accent"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 relative">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
              <h3 className="font-display text-xl text-black">Order Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 text-gray-500 hover:text-black rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar font-body text-sm space-y-8 bg-white">
              {/* Top info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg mb-1 text-black">Order #{selectedOrder.id}</h4>
                  <p className="text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {selectedOrder.status || 'pending'}
                  </span>
                </div>
              </div>

              {/* Customer and Shipping grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div>
                  <h5 className="font-bold mb-2 uppercase text-[10px] tracking-widest text-gray-400">Customer Details</h5>
                  <p className="font-medium text-base text-black">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                  <p className="text-gray-600 mt-1">{selectedOrder.customer?.email}</p>
                  <p className="text-gray-600">{selectedOrder.customer?.phone}</p>
                </div>
                <div>
                  <h5 className="font-bold mb-2 uppercase text-[10px] tracking-widest text-gray-400">Shipping Address</h5>
                  <p className="text-gray-800 leading-relaxed">
                    {selectedOrder.customer?.address}<br />
                    {selectedOrder.customer?.apartment && <>{selectedOrder.customer?.apartment}<br /></>}
                    {selectedOrder.customer?.city}{selectedOrder.customer?.postalCode ? `, ${selectedOrder.customer?.postalCode}` : ''}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h5 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-gray-400 border-b border-gray-100 pb-2">Items Ordered</h5>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-bold text-base text-black">{item.name}</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Size: {item.size}</p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <p className="font-medium text-black">PKR {Number(item.price)?.toLocaleString()}</p>
                        <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-6">
                <div className="space-y-3 max-w-xs ml-auto">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>PKR {Number(selectedOrder.total)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100 text-black">
                    <span>Total</span>
                    <span>PKR {Number(selectedOrder.total)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 w-full sticky bottom-0">
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <span className="font-body text-xs uppercase tracking-widest font-medium text-gray-500">Update Status:</span>
                 <select 
                    value={selectedOrder.status || 'pending'} 
                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                    className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black font-medium transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
               </div>
               <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-full sm:w-auto px-8 py-2.5 bg-black text-white rounded-lg font-accent tracking-widest text-xs uppercase hover:bg-gray-800 transition-colors"
               >
                 Close Manifest
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
