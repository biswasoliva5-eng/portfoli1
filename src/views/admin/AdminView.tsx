import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminArtworksManager } from './AdminArtworksManager';
import { AdminYearsManager } from './AdminYearsManager';
import { AdminCategoriesManager } from './AdminCategoriesManager';
import { AdminHomepageManager } from './AdminHomepageManager';
import { AdminAboutManager } from './AdminAboutManager';
import { AdminExhibitionsManager } from './AdminExhibitionsManager';
import { AdminCVManager } from './AdminCVManager';
import { AdminSocialManager } from './AdminSocialManager';
import { AdminInquiriesManager } from './AdminInquiriesManager';
import { AdminSettingsSecurity } from './AdminSettingsSecurity';
import { AdminLoginView } from './AdminLoginView';

export const AdminView: React.FC = () => {
  const { isAdmin, loading } = usePortfolio();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [requestAddNewArtwork, setRequestAddNewArtwork] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-neutral-400 text-xs tracking-widest uppercase">
        Loading Studio CMS...
      </div>
    );
  }

  // If not authenticated, render login view
  if (!isAdmin) {
    return <AdminLoginView />;
  }

  const handleAddNewArtworkFromDashboard = () => {
    setRequestAddNewArtwork(true);
    setCurrentTab('artworks');
  };

  return (
    <AdminLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <AdminDashboardOverview
          onNavigateTab={setCurrentTab}
          onAddNewArtwork={handleAddNewArtworkFromDashboard}
        />
      )}

      {currentTab === 'artworks' && (
        <AdminArtworksManager
          onAddNewRequest={requestAddNewArtwork}
          onClearAddNewRequest={() => setRequestAddNewArtwork(false)}
        />
      )}

      {currentTab === 'years' && <AdminYearsManager />}
      {currentTab === 'categories' && <AdminCategoriesManager />}
      {currentTab === 'homepage' && <AdminHomepageManager />}
      {currentTab === 'about' && <AdminAboutManager />}
      {currentTab === 'exhibitions' && <AdminExhibitionsManager />}
      {currentTab === 'cv' && <AdminCVManager />}
      {currentTab === 'social' && <AdminSocialManager />}
      {currentTab === 'messages' && <AdminInquiriesManager />}
      {currentTab === 'settings' && <AdminSettingsSecurity />}
    </AdminLayout>
  );
};
