'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { Mail, Check, Trash2 } from 'lucide-react';

export default function AdminForms() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const q = query(collection(db, 'contactForms'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, readStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'contactForms', id), { read: !readStatus });
      loadForms();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'contactForms', id));
      loadForms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-display text-lg">Contact Form Entries</h3>
        <span className="font-accent tracking-widest text-xs uppercase bg-black text-white px-3 py-1 rounded-full">
          {entries.length} Total
        </span>
      </div>
      
      {loading ? (
        <div className="p-12 flex justify-center">
          <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="p-12 text-center text-gray-500 font-body">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Mail className="w-8 h-8 text-gray-400" />
          </div>
          <p>No form entries have been received yet.</p>
          <p className="text-sm mt-2">When customers use the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {entries.map(entry => (
            <div key={entry.id} className={`p-6 transition-colors ${entry.read ? 'bg-white' : 'bg-blue-50/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  {!entry.read && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  <h4 className="font-bold font-body text-black">{entry.subject || 'No Subject'}</h4>
                </div>
                <span className="font-body text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="font-body text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-900">From:</span> {entry.name} ({entry.email})
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-3 font-body text-sm text-gray-800 whitespace-pre-wrap">
                  {entry.message}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => markAsRead(entry.id, entry.read)}
                  className={`flex items-center font-body text-xs px-3 py-1.5 rounded-lg border transition-colors ${entry.read ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'}`}
                >
                  <Check size={14} className="mr-1.5" />
                  {entry.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="flex items-center font-body text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} className="mr-1.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
