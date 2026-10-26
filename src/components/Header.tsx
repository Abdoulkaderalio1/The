import React from 'react';
import { ADMIN_PHONE_NUMBER, ADMIN_PHONE_RAW } from '../data/defaultProfiles';
import { ShieldCheck, MessageCircle, Heart, Lock, UserPlus, Compass, CreditCard } from 'lucide-react';

interface HeaderProps {
  activeTab: 'catalog' | 'register' | 'guide' | 'admin';
  setActiveTab: (tab: 'catalog' | 'register' | 'guide' | 'admin') => void;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
              <Heart className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-emerald-950 tracking-tight block leading-tight">
                Le Chemin pour le Nikah
              </span>
              <span className="text-[11px] text-emerald-800/80 font-medium hidden sm:block">
                Matrimonial Sérieux & Pudeur au Niger
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Profils vérifiés</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'register'
                  ? 'text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>S'inscrire</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Paiement & Tarifs</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap relative ${
                activeTab === 'admin'
                  ? 'text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Espace Admin</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title={`${pendingCount} profil(s) en attente`} />
              )}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (WhatsApp Business) */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/${ADMIN_PHONE_RAW}?text=${encodeURIComponent(
                "Salam Alaykoum Administration Le Chemin pour le Nikah, je souhaite des renseignements sur l'accompagnement au mariage."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="font-mono text-amber-300">{ADMIN_PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
