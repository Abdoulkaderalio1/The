import React, { useState } from 'react';
import { Profile } from '../types';
import { MapPin, Briefcase, Eye, EyeOff, HeartHandshake, ShieldCheck } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  onOpenDetails: (profile: Profile) => void;
  onRequestContact: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onOpenDetails,
  onRequestContact,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<0 | 1>(0);
  const currentPhoto = activePhotoIndex === 0 ? profile.photo1 : profile.photo2;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden group">
        <img
          src={currentPhoto}
          alt={`Photo de ${profile.pseudo}`}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-top transition-transform duration-300 ${
            profile.hidePhotos ? 'blur-xl scale-110 select-none' : 'group-hover:scale-105'
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-emerald-950/80 backdrop-blur-md text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>2 photos vérifiées</span>
          </div>

          <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
            {profile.id}
          </div>
        </div>

        {/* Modesty Banner Overlay if Hidden */}
        {profile.hidePhotos && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-[2px] text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-900/90 text-amber-300 flex items-center justify-center mb-2 shadow-sm">
              <EyeOff className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-white drop-shadow-sm max-w-[200px]">
              Option Pudeur active
            </p>
            <p className="text-[10px] text-emerald-100/90 max-w-[220px] mt-0.5 leading-snug">
              Photos transmises uniquement avec l'accord de la personne
            </p>
          </div>
        )}

        {/* Photo Switcher Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex(0);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              activePhotoIndex === 0 ? 'bg-amber-400 w-4' : 'bg-white/60 hover:bg-white'
            }`}
            title="Photo 1"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex(1);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              activePhotoIndex === 1 ? 'bg-amber-400 w-4' : 'bg-white/60 hover:bg-white'
            }`}
            title="Photo 2"
          />
        </div>
      </div>

      {/* Profile Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Info */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-serif font-bold text-lg text-emerald-950 tracking-tight">
                {profile.pseudo}
              </h3>
              {/* Unboxed Metadata with Typographic Separator */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium flex-wrap">
                <span className="text-slate-800 font-semibold">{profile.age} ans</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-800" />
                  {profile.city}
                </span>
                <span aria-hidden="true">·</span>
                <span>{profile.maritalStatus}</span>
              </div>
            </div>
          </div>

          {/* Profession */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-900 font-medium mb-3">
            <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{profile.profession}</span>
          </div>

          {/* Personal Description Preview */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {profile.description}
          </p>

          {/* Search Criteria Preview */}
          <div className="text-xs text-slate-700 mb-4">
            <span className="font-semibold text-emerald-950">Recherche : </span>
            <span className="italic text-slate-600 line-clamp-1">{profile.criteria}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onOpenDetails(profile)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fiche complète</span>
          </button>

          <button
            onClick={() => onRequestContact(profile)}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Mise en relation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
