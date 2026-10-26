import React, { useState, useEffect } from 'react';
import { ContactRequest, ContactRequestStatus, Gender, MaritalStatus, Profile, ProfileStatus } from './types';
import {
  getStoredProfiles,
  saveStoredProfiles,
  getStoredRequests,
  saveStoredRequests,
  resetToDefaults,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HeroBanner } from './components/HeroBanner';
import { StepsWorkflow } from './components/StepsWorkflow';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { ContactModal } from './components/ContactModal';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentGuide } from './components/PaymentGuideModal';
import {
  Search,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  MessageCircle,
  Heart,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { ADMIN_PHONE_NUMBER, ADMIN_PHONE_RAW } from './data/defaultProfiles';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'register' | 'guide' | 'admin'>('catalog');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);
  const [targetProfileForContact, setTargetProfileForContact] = useState<Profile | null>(null);

  // Filters state
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loadedProfiles = getStoredProfiles();
    const loadedRequests = getStoredRequests();
    setProfiles(loadedProfiles);
    setRequests(loadedRequests);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddProfile = (newProfile: Profile) => {
    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    saveStoredProfiles(updated);
    showToast(`Dossier ${newProfile.id} soumis ! En attente d'approbation par l'administrateur.`);
  };

  const handleUpdateProfileStatus = (id: string, status: ProfileStatus) => {
    const updated = profiles.map((p) => (p.id === id ? { ...p, status } : p));
    setProfiles(updated);
    saveStoredProfiles(updated);
    showToast(`Statut du profil mis à jour (${status}).`);
  };

  const handleToggleProfilePhotosModesty = (id: string, hidePhotos: boolean) => {
    const updated = profiles.map((p) => (p.id === id ? { ...p, hidePhotos } : p));
    setProfiles(updated);
    saveStoredProfiles(updated);
    showToast(hidePhotos ? 'Option Pudeur activée (photos floutées).' : 'Photos affichées en clair.');
  };

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    saveStoredProfiles(updated);
    showToast('Profil retiré avec succès.');
  };

  const handleUpdateAdminNotes = (id: string, notes: string) => {
    const updated = profiles.map((p) => (p.id === id ? { ...p, adminNotes: notes } : p));
    setProfiles(updated);
    saveStoredProfiles(updated);
  };

  const handleAddContactRequest = (req: ContactRequest) => {
    const updated = [req, ...requests];
    setRequests(updated);
    saveStoredRequests(updated);
    showToast('Demande enregistrée. Procédez à la confirmation sur WhatsApp.');
  };

  const handleUpdateRequestStatus = (requestId: string, status: ContactRequestStatus, notes?: string) => {
    const updated = requests.map((r) =>
      r.id === requestId ? { ...r, status, adminNotes: notes || r.adminNotes } : r
    );
    setRequests(updated);
    saveStoredRequests(updated);
    showToast('Statut de la demande de mise en relation mis à jour.');
  };

  const handleResetData = () => {
    resetToDefaults();
    setProfiles(getStoredProfiles());
    setRequests(getStoredRequests());
    showToast('Données réinitialisées aux valeurs initiales.');
  };

  // Only approved profiles are shown in the public catalog
  const publicApprovedProfiles = profiles.filter((p) => p.status === 'approuvé');

  const filteredCatalogProfiles = publicApprovedProfiles.filter((p) => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    if (cityFilter !== 'all' && !p.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (statusFilter !== 'all' && p.maritalStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.pseudo.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.criteria.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingDossiersCount = profiles.filter((p) => p.status === 'en_attente').length;

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-slate-800 flex flex-col font-sans pb-20 md:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingDossiersCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: CATALOG OF PROFILES */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <HeroBanner
              onExplore={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onRegister={() => setActiveTab('register')}
              totalProfilesCount={publicApprovedProfiles.length}
            />

            {/* 4 Steps Section */}
            <StepsWorkflow />

            {/* Catalog Section */}
            <section id="catalog-section" className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif font-bold text-xl text-emerald-950 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-800" />
                      <span>Profils Célibataires Disponibles</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {filteredCatalogProfiles.length} profil(s) approuvé(s) et vérifié(s) selon vos critères
                    </p>
                  </div>

                  {/* Gender Filter Buttons */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                    <button
                      onClick={() => setGenderFilter('all')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        genderFilter === 'all'
                          ? 'bg-white text-emerald-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setGenderFilter('femme')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        genderFilter === 'femme'
                          ? 'bg-white text-emerald-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sœurs
                    </button>
                    <button
                      onClick={() => setGenderFilter('homme')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        genderFilter === 'homme'
                          ? 'bg-white text-emerald-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Frères
                    </button>
                  </div>
                </div>

                {/* Search & Advanced Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher profession, valeurs, mot-clé..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
                    >
                      <option value="all">Toutes les villes (Niger & Diaspora)</option>
                      <option value="Niamey">Niamey</option>
                      <option value="Maradi">Maradi</option>
                      <option value="Zinder">Zinder</option>
                      <option value="Tahoua">Tahoua</option>
                      <option value="Agadez">Agadez</option>
                      <option value="Dosso">Dosso</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
                    >
                      <option value="all">Toutes situations matrimoniales</option>
                      <option value="Célibataire (Jamais marié)">Célibataire (Jamais marié)</option>
                      <option value="Divorcé(e)">Divorcé(e)</option>
                      <option value="Veuf / Veuve">Veuf / Veuve</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Profiles Grid */}
              {filteredCatalogProfiles.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                  <EyeOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-lg text-slate-800">
                    Aucun profil ne correspond à vos filtres
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Essayez de réinitialiser la recherche ou de modifier la ville pour découvrir d'autres membres.
                  </p>
                  <button
                    onClick={() => {
                      setGenderFilter('all');
                      setCityFilter('all');
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCatalogProfiles.map((p) => (
                    <ProfileCard
                      key={p.id}
                      profile={p}
                      onOpenDetails={(prof) => setSelectedProfileForDetails(prof)}
                      onRequestContact={(prof) => setTargetProfileForContact(prof)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: REGISTRATION FORM */}
        {activeTab === 'register' && (
          <RegistrationForm
            onAddProfile={handleAddProfile}
            onSuccess={() => setActiveTab('catalog')}
          />
        )}

        {/* VIEW 3: PAYMENT & GUIDE */}
        {activeTab === 'guide' && (
          <PaymentGuide
            onGoToCatalog={() => setActiveTab('catalog')}
            onGoToRegister={() => setActiveTab('register')}
          />
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            profiles={profiles}
            requests={requests}
            onUpdateProfileStatus={handleUpdateProfileStatus}
            onToggleProfilePhotosModesty={handleToggleProfilePhotosModesty}
            onDeleteProfile={handleDeleteProfile}
            onUpdateAdminNotes={handleUpdateAdminNotes}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-serif font-bold text-sm text-emerald-950 block">
              Le Chemin pour le Nikah
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Accompagnement matrimonial béni et confidentiel au Niger.
            </p>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1 sm:text-right">
            <div>
              WhatsApp Business Officiel :{' '}
              <strong className="font-mono text-emerald-950">{ADMIN_PHONE_NUMBER}</strong>
            </div>
            <div>Paiements acceptés : MyNita & Amanata (2 000 FCFA / mise en relation)</div>
          </div>
        </div>
      </footer>

      {/* Bottom Mobile Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingDossiersCount}
      />

      {/* Modals */}
      <ProfileDetailsModal
        profile={selectedProfileForDetails}
        onClose={() => setSelectedProfileForDetails(null)}
        onRequestContact={(p) => {
          setSelectedProfileForDetails(null);
          setTargetProfileForContact(p);
        }}
      />

      <ContactModal
        targetProfile={targetProfileForContact}
        onClose={() => setTargetProfileForContact(null)}
        onSubmitRequest={handleAddContactRequest}
      />
    </div>
  );
}
