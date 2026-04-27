'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { DollarSign, Package, ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ productsCount: 0, ordersCount: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        const productsCount = prodSnap.size;

        const ordQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const ordSnap = await getDocs(ordQuery);
        const ordersCount = ordSnap.size;
        
        let totalRevenue = 0;
        const orders: any[] = [];
        
        // Prepare graph data (last 7 days logic)
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
          const d = subDays(new Date(), 6 - i);
          return {
            date: d,
            display: format(d, 'MMM dd'),
            revenue: 0,
            orders: 0
          };
        });

        ordSnap.forEach(doc => {
          const data = doc.data();
          totalRevenue += data.total || 0;
          if (orders.length < 5) {
            orders.push({ id: doc.id, ...data });
          }
          
          if (data.createdAt) {
            const orderDate = new Date(data.createdAt);
            const dayData = last7Days.find(day => isSameDay(day.date, orderDate));
            if (dayData) {
              dayData.revenue += data.total || 0;
              dayData.orders += 1;
            }
          }
        });

        setStats({ productsCount, ordersCount, totalRevenue });
        setRecentOrders(orders);
        setSalesData(last7Days);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl">Overview</h2>
          <p className="font-body text-gray-500 text-sm">Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-accent tracking-widest text-xs text-gray-500 uppercase">Total Revenue</h3>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
          </div>
          <p className="font-display text-4xl">PKR {stats.totalRevenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
            <ArrowUpRight size={14} className="mr-1" /> All time
          </div>
        </div>
        
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-accent tracking-widest text-xs text-gray-500 uppercase">Total Orders</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={20} /></div>
          </div>
          <p className="font-display text-4xl">{stats.ordersCount}</p>
           <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
            <ArrowUpRight size={14} className="mr-1" /> All time
          </div>
        </div>
        
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-accent tracking-widest text-xs text-gray-500 uppercase">Active Products</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Package size={20} /></div>
          </div>
          <p className="font-display text-4xl">{stats.productsCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-lg">Revenue Over Time</h3>
            <span className="font-body text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">Last 7 Days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="display" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `Rs.${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111', fontFamily: 'inherit' }}
                  itemStyle={{ color: '#111', fontFamily: 'inherit' }}
                  formatter={(value: any) => [`PKR ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#111" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-display text-lg">Recent Orders</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {recentOrders.length === 0 ? (
              <div className="text-center p-6 text-gray-500 font-body text-sm">No orders yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 flex items-center justify-between transition-colors rounded-lg">
                    <div className="min-w-0 pr-4">
                      <p className="font-body font-medium text-sm text-black truncate">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="font-body text-xs text-gray-500 truncate">{order.id}</p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-medium text-sm">Rs. {order.total?.toLocaleString()}</span>
                      <span className={`mt-1 inline-block px-2 py-0.5 text-[10px] font-accent tracking-wider rounded uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
