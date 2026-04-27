'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Users, LogOut, ExternalLink, Menu, X, Tag } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Bundles & Coupons', href: '/admin/marketing', icon: Tag },
    { name: 'Form Entries', href: '/admin/forms', icon: MessageSquare },
    { name: 'Staff & Managers', href: '/admin/staff', icon: Users },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/orders')) return 'Orders';
    if (pathname.startsWith('/admin/products')) return 'Products';
    if (pathname.startsWith('/admin/marketing')) return 'Bundles & Coupons';
    if (pathname.startsWith('/admin/forms')) return 'Form Entries';
    if (pathname.startsWith('/admin/staff')) return 'Staff & Managers';
    return 'Admin';
  };

  return (
    <div className="flex h-[100dvh] bg-[#fafafa] text-black overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-50`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-display text-2xl tracking-widest text-[#111]">ANFAAL</h2>
            <p className="font-accent text-[10px] tracking-widest text-gray-500 uppercase mt-1">Workspace</p>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-left font-body text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-5 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-display text-xl lg:text-2xl text-black">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center text-sm font-body font-medium text-gray-600 hover:text-black transition-colors bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200">
              <ExternalLink size={14} className="mr-2 hidden sm:block" />
              <span className="hidden sm:inline">Live Store</span>
              <span className="sm:hidden">Store</span>
            </a>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 lg:p-8 flex-1 overflow-y-auto bg-[#fafafa]">
          {children}
        </div>
      </main>
    </div>
  );
}
