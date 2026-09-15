import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ items, roleLabel }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const activeItem = [...items].sort((a, b) => b.to.length - a.to.length).find((item) => location.pathname.startsWith(item.to));

  return (
    <div className="min-h-screen bg-paper-100">
      <Sidebar items={items} roleLabel={roleLabel} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Topbar title={activeItem?.label || 'Dashboard'} onMenuClick={() => setMobileOpen(true)} />
        <main className="page-shell py-6 sm:py-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
