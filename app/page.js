'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DailyMenuSection from '@/components/DailyMenuSection';
import RatingModal from '@/components/RatingModal';
import ReviewsFeed from '@/components/ReviewsFeed';
import WeeklyVotingSection from '@/components/WeeklyVotingSection';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import CloudflareD1Modal from '@/components/CloudflareD1Modal';
import AdminMenuModal from '@/components/AdminMenuModal';
import AdminPasswordModal from '@/components/AdminPasswordModal';
import AdminSiteConfigModal from '@/components/AdminSiteConfigModal';

import { INITIAL_MENUS, INITIAL_REVIEWS, INITIAL_VOTES, DEFAULT_SITE_CONFIG } from '@/lib/initial-data';
import { StorageKeys } from '@/lib/db';

export default function Home() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'reviews', 'voting', 'dashboard'
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [votes, setVotes] = useState([]);
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  
  const [selectedMenuForRating, setSelectedMenuForRating] = useState(null);
  const [isD1ModalOpen, setIsD1ModalOpen] = useState(false);
  const [isAdminMenuModalOpen, setIsAdminMenuModalOpen] = useState(false);
  const [isSiteConfigModalOpen, setIsSiteConfigModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState(null); // callback after password verified
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // requires 147258

  const [menuToEdit, setMenuToEdit] = useState(null);
  const [helpfulIds, setHelpfulIds] = useState([]);
  const [userVotedIds, setUserVotedIds] = useState([]);

  // Load data on mount from API (which queries Cloudflare D1) or fallback to localStorage
  const refreshAllData = async () => {
    try {
      const [resMenus, resReviews, resVotes, resConfig] = await Promise.all([
        fetch('/api/menus').then(r => r.json()).catch(() => null),
        fetch('/api/reviews').then(r => r.json()).catch(() => null),
        fetch('/api/votes').then(r => r.json()).catch(() => null),
        fetch('/api/config').then(r => r.json()).catch(() => null),
      ]);

      if (Array.isArray(resMenus?.data)) {
        setMenus(resMenus.data);
        try {
          localStorage.setItem(StorageKeys.MENUS, JSON.stringify(resMenus.data));
        } catch (e) {}
      }
      if (Array.isArray(resReviews?.data)) {
        setReviews(resReviews.data);
        try {
          localStorage.setItem(StorageKeys.REVIEWS, JSON.stringify(resReviews.data));
        } catch (e) {}
      }
      if (Array.isArray(resVotes?.data)) {
        setVotes(resVotes.data);
        try {
          localStorage.setItem(StorageKeys.VOTES, JSON.stringify(resVotes.data));
        } catch (e) {}
      }
      if (resConfig?.data) {
        setSiteConfig(resConfig.data);
        try {
          localStorage.setItem('canteen_site_config', JSON.stringify(resConfig.data));
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Using local storage fallback", err);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  useEffect(() => {
    // 1. Immediately restore real cached data from localStorage to prevent F5 flicker
    try {
      const savedMenus = localStorage.getItem(StorageKeys.MENUS);
      if (savedMenus) {
        const parsed = JSON.parse(savedMenus);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMenus(parsed);
          setIsLoadingMenus(false);
        }
      }

      const savedReviews = localStorage.getItem(StorageKeys.REVIEWS);
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews);
        if (Array.isArray(parsed)) setReviews(parsed);
      }

      const savedVotes = localStorage.getItem(StorageKeys.VOTES);
      if (savedVotes) {
        const parsed = JSON.parse(savedVotes);
        if (Array.isArray(parsed)) setVotes(parsed);
      }

      const savedHelpful = localStorage.getItem(StorageKeys.HELPFUL_REVIEWS);
      if (savedHelpful) setHelpfulIds(JSON.parse(savedHelpful));

      const savedUserVotes = localStorage.getItem(StorageKeys.USER_VOTED_IDS);
      if (savedUserVotes) setUserVotedIds(JSON.parse(savedUserVotes));
      
      const savedConfig = localStorage.getItem('canteen_site_config');
      if (savedConfig) setSiteConfig(JSON.parse(savedConfig));

      const savedAuth = sessionStorage.getItem('canteen_admin_auth');
      if (savedAuth === 'true') setIsAdminAuthenticated(true);
    } catch (e) {}

    // 2. Fetch fresh data from D1 API in background
    refreshAllData();
  }, []);

  // Sync document title with site brand name
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const brand = siteConfig?.brandName || 'DOD Canteen';
      document.title = `${brand} - ระบบประเมินและรีวิวอาหารกลางวันพนักงาน | Cloudflare D1`;
    }
  }, [siteConfig]);

  // Compute live scores for menus whenever reviews change
  useEffect(() => {
    setMenus(prevMenus => {
      return prevMenus.map(menu => {
        const menuReviews = reviews.filter(r => r.menu_id === menu.id);
        if (menuReviews.length === 0) {
          return {
            ...menu,
            rating_avg: menu.reviews_count > 0 && menu.rating_avg ? menu.rating_avg : 0,
            reviews_count: menu.reviews_count || 0
          };
        }
        const total = menuReviews.reduce((sum, r) => sum + Number(r.overall_score || 0), 0);
        const avg = Number((total / menuReviews.length).toFixed(1));
        return {
          ...menu,
          rating_avg: avg,
          reviews_count: menuReviews.length
        };
      });
    });
  }, [reviews]);

  // Handle New Review Submission
  const handleReviewSubmit = async (newReview) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    try {
      localStorage.setItem(StorageKeys.REVIEWS, JSON.stringify(updatedReviews));
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
    } catch (e) {
      console.warn("Could not save to API/D1:", e);
    }
  };

  // Handle Helpful / Upvote on Review
  const handleToggleHelpful = (reviewId) => {
    let updatedHelpful;
    if (helpfulIds.includes(reviewId)) {
      updatedHelpful = helpfulIds.filter(id => id !== reviewId);
    } else {
      updatedHelpful = [...helpfulIds, reviewId];
    }
    setHelpfulIds(updatedHelpful);
    try {
      localStorage.setItem(StorageKeys.HELPFUL_REVIEWS, JSON.stringify(updatedHelpful));
    } catch (e) {}
  };

  // Handle Vote for Next Week Dish
  const handleVoteDish = async (dishId) => {
    if (userVotedIds.includes(dishId)) return;

    const updatedVotes = votes.map(dish => {
      if (dish.id === dishId) {
        return { ...dish, votes_count: dish.votes_count + 1 };
      }
      return dish;
    });

    const updatedUserVotes = [...userVotedIds, dishId];
    setVotes(updatedVotes);
    setUserVotedIds(updatedUserVotes);

    try {
      localStorage.setItem(StorageKeys.VOTES, JSON.stringify(updatedVotes));
      localStorage.setItem(StorageKeys.USER_VOTED_IDS, JSON.stringify(updatedUserVotes));
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', dishId }),
      });
    } catch (e) {}
  };

  // Handle New Dish Proposal
  const handleProposeDish = async (newDish) => {
    const updatedVotes = [newDish, ...votes];
    setVotes(updatedVotes);
    try {
      localStorage.setItem(StorageKeys.VOTES, JSON.stringify(updatedVotes));
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'propose', ...newDish }),
      });
    } catch (e) {}
  };

  // Admin Verification Guard: requires 147258
  const executeWithAdminAuth = (action) => {
    if (isAdminAuthenticated) {
      action();
    } else {
      setPendingAdminAction(() => action);
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsPasswordModalOpen(false);
    try {
      sessionStorage.setItem('canteen_admin_auth', 'true');
    } catch (e) {}

    if (pendingAdminAction) {
      pendingAdminAction();
      setPendingAdminAction(null);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('canteen_admin_auth');
    } catch (e) {}
  };

  // Admin: Open Add Menu Modal
  const handleOpenAddMenu = () => {
    executeWithAdminAuth(() => {
      setMenuToEdit(null);
      setIsAdminMenuModalOpen(true);
    });
  };

  // Admin: Open Edit Menu Modal
  const handleOpenEditMenu = (menu) => {
    executeWithAdminAuth(() => {
      setMenuToEdit(menu);
      setIsAdminMenuModalOpen(true);
    });
  };

  // Admin: Open Site Config Modal (Tab names & Banner Slogan)
  const handleOpenSiteConfigModal = () => {
    executeWithAdminAuth(() => {
      setIsSiteConfigModalOpen(true);
    });
  };

  // Admin: Save Site Config
  const handleSaveSiteConfig = async (newConfig) => {
    setSiteConfig(newConfig);
    try {
      localStorage.setItem('canteen_site_config', JSON.stringify(newConfig));
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (e) {
      console.warn("Could not save site config to D1:", e);
    }
  };

  // Admin: Save or Update Menu
  const handleSaveMenu = async (menuData, isEditing) => {
    let updated;
    if (isEditing) {
      updated = menus.map(m => m.id === menuData.id ? { ...m, ...menuData } : m);
      setMenus(updated);
      try { localStorage.setItem(StorageKeys.MENUS, JSON.stringify(updated)); } catch (e) {}
      await fetch('/api/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });
    } else {
      updated = [menuData, ...menus];
      setMenus(updated);
      try { localStorage.setItem(StorageKeys.MENUS, JSON.stringify(updated)); } catch (e) {}
      await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });
    }
    setTimeout(() => refreshAllData(), 500);
  };

  // Admin: Delete Menu
  const handleDeleteMenu = async (menuId) => {
    executeWithAdminAuth(async () => {
      const updated = menus.filter(m => m.id !== menuId);
      setMenus(updated);
      try { localStorage.setItem(StorageKeys.MENUS, JSON.stringify(updated)); } catch (e) {}
      await fetch(`/api/menus?id=${menuId}`, {
        method: 'DELETE'
      });
      setTimeout(() => refreshAllData(), 500);
    });
  };

  // Admin: Delete Review
  const handleDeleteReview = async (reviewId) => {
    executeWithAdminAuth(async () => {
      const updated = reviews.filter(r => r.id !== reviewId);
      setReviews(updated);
      try { localStorage.setItem(StorageKeys.REVIEWS, JSON.stringify(updated)); } catch (e) {}
      try {
        await fetch(`/api/reviews?id=${reviewId}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn("Could not delete review from D1:", e);
      }
      setTimeout(() => refreshAllData(), 500);
    });
  };

  // View specific menu reviews
  const handleViewMenuReviews = (menuId) => {
    setActiveTab('reviews');
  };

  // Calculate top-level stats for Navbar
  const todayStats = {
    totalMenus: menus.length,
    totalReviews: reviews.length,
    avgRating: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.overall_score, 0) / reviews.length
      : 0
  };

  return (
    <div className="min-h-screen flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      
      <div className="w-full max-w-full overflow-x-hidden">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          todayStats={todayStats}
          siteConfig={siteConfig}
          onOpenD1Modal={() => setIsD1ModalOpen(true)}
          onOpenAddMenu={handleOpenAddMenu}
          onOpenSiteConfigModal={handleOpenSiteConfigModal}
          isAdmin={isAdminAuthenticated}
          onToggleAdmin={() => {
            if (isAdminAuthenticated) {
              handleLogoutAdmin();
            } else {
              executeWithAdminAuth(() => {});
            }
          }}
        />

        {/* Main Content Area */}
        <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
          {activeTab === 'menu' && (
            <DailyMenuSection
              menus={menus}
              siteConfig={siteConfig}
              isLoading={isLoadingMenus}
              onOpenRatingModal={(menu) => setSelectedMenuForRating(menu)}
              onViewMenuReviews={handleViewMenuReviews}
              onOpenAddMenu={handleOpenAddMenu}
              onOpenEditMenu={handleOpenEditMenu}
              onDeleteMenu={handleDeleteMenu}
              onOpenSiteConfigModal={handleOpenSiteConfigModal}
              isAdmin={isAdminAuthenticated}
              onToggleAdmin={() => {
                if (isAdminAuthenticated) {
                  handleLogoutAdmin();
                } else {
                  executeWithAdminAuth(() => {});
                }
              }}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsFeed
              reviews={reviews}
              menus={menus}
              onToggleHelpful={handleToggleHelpful}
              helpfulIds={helpfulIds}
              onOpenRatingModal={(menu) => setSelectedMenuForRating(menu)}
              onDeleteReview={handleDeleteReview}
              isAdmin={isAdminAuthenticated}
            />
          )}

          {activeTab === 'voting' && (
            <WeeklyVotingSection
              votes={votes}
              onVoteDish={handleVoteDish}
              onProposeDish={handleProposeDish}
              userVotedIds={userVotedIds}
            />
          )}

          {activeTab === 'dashboard' && (
            <AnalyticsDashboard
              reviews={reviews}
              menus={menus}
              votes={votes}
              onOpenD1Modal={() => setIsD1ModalOpen(true)}
              onOpenAddMenu={handleOpenAddMenu}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-amber-500/20 py-8 text-center text-xs text-stone-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-black text-white text-sm">
            <span>🍽️ {siteConfig?.brandName || 'DOD Canteen'}</span>
            <span>•</span>
            <span className="text-amber-400">Employee Fine Dining & Lunch Rating System</span>
          </div>
        </div>
      </footer>

      {/* Rating & Review Modal */}
      {selectedMenuForRating && (
        <RatingModal
          menu={selectedMenuForRating}
          onClose={() => setSelectedMenuForRating(null)}
          onSubmitReview={handleReviewSubmit}
        />
      )}

      {/* Admin Passcode Modal (147258) */}
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => { setIsPasswordModalOpen(false); setPendingAdminAction(null); }}
        onSuccess={handlePasswordSuccess}
      />

      {/* Admin Menu Add/Edit Modal */}
      <AdminMenuModal
        isOpen={isAdminMenuModalOpen}
        onClose={() => { setIsAdminMenuModalOpen(false); setMenuToEdit(null); }}
        menuToEdit={menuToEdit}
        onSaveMenu={handleSaveMenu}
        onDeleteMenu={handleDeleteMenu}
      />

      {/* Cloudflare D1 Info & Setup Modal */}
      <CloudflareD1Modal
        isOpen={isD1ModalOpen}
        onClose={() => setIsD1ModalOpen(false)}
      />

      {/* Admin Site Header & Slogan Config Modal */}
      <AdminSiteConfigModal
        isOpen={isSiteConfigModalOpen}
        onClose={() => setIsSiteConfigModalOpen(false)}
        siteConfig={siteConfig}
        onSaveConfig={handleSaveSiteConfig}
      />

    </div>
  );
}
