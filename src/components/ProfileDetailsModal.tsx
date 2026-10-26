import React, { useState } from 'react';
import { Profile } from '../types';
import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  ShieldCheck,
  EyeOff,
  HeartHandshake,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { CONTACT_FEE_FCFA } from '../data/defaultProfiles';

interface ProfileDetailsModalProps {
  profile: Profile | null;
  onClose: () => void;
  onRequestContact: (profile: Profile) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onRequestContact,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<1 | 2>(1);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center text-xs font-mono font-bold">
              {profile.id.replace('NIKAH-', '')}
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-emerald-950">
                {profile.pseudo}
              </h2>
              <p className="text-xs text-slate-500">
                Dossier vérifié le {new Date(profile.submissionDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Dual Photos View */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                2 Photos récentes vérifiées par l'administrateur
              </span>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setSelectedPhoto(1)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedPhoto === 1
                      ? 'bg-emerald-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Photo 1 (Visage)
                </button>
                <button
                  onClick={() => setSelectedPhoto(2)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedPhoto === 2
                      ? 'bg-emerald-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Photo 2 (En pied)
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={selectedPhoto === 1 ? profile.photo1 : profile.photo2}
                alt={`Photo ${selectedPhoto} de ${profile.pseudo}`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-top transition-all ${
                  profile.hidePhotos ? 'blur-2xl scale-110 select-none' : ''
                }`}
              />

              {profile.hidePhotos && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-emerald-950/50 backdrop-blur-sm text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/90 text-amber-300 flex items-center justify-center mb-2 shadow-sm">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">Photos sous Option Pudeur</h4>
                  <p className="text-xs text-emerald-100/90 max-w-sm mt-1 leading-relaxed">
                    Ce membre a choisi de préserver sa discrétion sur le site public. Les photographies en clair lui seront transmises et présentées uniquement si les deux parties acceptent la mise en contact.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Matrimonial Characteristics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Âge</span>
              <span className="text-sm font-semibold text-slate-900">{profile.age} ans</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Ville</span>
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                {profile.city}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Situation</span>
              <span className="text-sm font-semibold text-slate-900">{profile.maritalStatus}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Profession</span>
              <span className="text-sm font-semibold text-slate-900 truncate block">
                {profile.profession}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Enfants</span>
              <span className="text-sm font-semibold text-slate-900">
                {profile.children || 'Sans enfant'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Polygamie</span>
              <span className="text-sm font-semibold text-slate-900">
                {profile.polygamyAcceptance || 'Non envisagé'}
              </span>
            </div>
          </div>

          {/* Description & Religious Practice */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                Présentation & Pratique religieuse
              </h4>
              <div className="bg-emerald-50/40 border border-emerald-900/10 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                <p>{profile.description}</p>
                {profile.religiousPractice && (
                  <p className="text-xs font-medium text-emerald-900 pt-2 border-t border-emerald-900/10">
                    <span className="font-semibold">Pratique :</span> {profile.religiousPractice}
                  </p>
                )}
                {profile.education && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Formation :</span> {profile.education}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1.5">
                Recherche souhaitée chez le futur époux / l'épouse
              </h4>
              <div className="bg-amber-50/50 border border-amber-900/10 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                {profile.criteria}
              </div>
            </div>
          </div>

          {/* Confidentiality Reminder */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">
                Confidentialité garantie & Respect de la pudeur
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 leading-normal">
                Les coordonnées téléphoniques, l'adresse exacte et l'identité légale ne sont jamais partagées en public.
                Après confirmation du paiement, l'administrateur prend contact avec ce membre pour recueillir son accord avant toute transmission.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="sticky bottom-0 bg-white p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-slate-500 block">Frais de mise en relation officielle</span>
            <span className="text-lg font-mono font-bold text-emerald-950">
              {CONTACT_FEE_FCFA.toLocaleString()} FCFA
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onRequestContact(profile);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>Demander la mise en contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
