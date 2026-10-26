import React from 'react';
import { ShieldCheck, HeartHandshake, EyeOff, CheckCircle2 } from 'lucide-react';
import { DEFAULT_HERO_IMAGE } from '../data/defaultProfiles';

interface HeroBannerProps {
  onExplore: () => void;
  onRegister: () => void;
  totalProfilesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onRegister,
  totalProfilesCount,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-xl mb-8">
      {/* Background Image with Measured Contrast Scrim */}
      <img
        src={DEFAULT_HERO_IMAGE}
        alt="Atmosphère matrimoniale noble et sereine"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-900/70" />

      {/* Content */}
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-900/80 border border-emerald-700/50 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Plateforme matrimoniale islamique encadrée au Niger</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 text-balance leading-tight">
          Le Chemin vers un Mariage Béni, Sincère & Pudique
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6">
          Tous les profils et les deux photos obligatoires sont soumis à une vérification administrative stricte.
          Aucune information personnelle n'est divulguée sans le consentement explicite des deux parties.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs text-emerald-200/90">
          <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/60 backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>2 photos récentes vérifiées</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/60 backdrop-blur-sm">
            <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Option Pudeur (floutage public)</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/60 backdrop-blur-sm">
            <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Consentement mutuel obligatoire</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>Consulter les profils</span>
            <span className="bg-emerald-950/20 px-2 py-0.5 rounded-md text-xs font-mono">
              {totalProfilesCount}
            </span>
          </button>

          <button
            onClick={onRegister}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all backdrop-blur-sm active:scale-95"
          >
            Déposer ma candidature
          </button>
        </div>
      </div>
    </div>
  );
};
