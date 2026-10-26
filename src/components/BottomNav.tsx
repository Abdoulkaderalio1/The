import React from 'react';
import { Compass, UserPlus, CreditCard, Lock, MessageCircle } from 'lucide-react';
import { ADMIN_PHONE_RAW } from '../data/defaultProfiles';

interface BottomNavProps {
  activeTab: 'catalog' | 'register' | 'guide' | 'admin';
  setActiveTab: (tab: 'catalog' | 'register' | 'guide' | 'admin') => void;
  pendingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'catalog' ? 'text-emerald-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'catalog' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 leading-none">Découvrir</span>
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'register' ? 'text-emerald-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className={`w-5 h-5 ${activeTab === 'register' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 leading-none">S'inscrire</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'guide' ? 'text-emerald-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${activeTab === 'guide' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 leading-none">Tarifs</span>
        </button>

        <a
          href={`https://wa.me/${ADMIN_PHONE_RAW}?text=${encodeURIComponent(
            "Salam Alaykoum Administration Le Chemin pour le Nikah, j'ai une question concernant le service."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 leading-none">WhatsApp</span>
        </a>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 relative transition-colors ${
            activeTab === 'admin' ? 'text-emerald-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Lock className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5]' : ''}`} />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 leading-none">Admin</span>
        </button>
      </div>
    </nav>
  );
};
