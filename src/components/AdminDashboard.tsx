import React, { useState } from 'react';
import { ContactRequest, ContactRequestStatus, Profile, ProfileStatus } from '../types';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Check,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  CreditCard,
  MessageCircle,
  Phone,
  Calendar,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { ADMIN_PHONE_NUMBER, ADMIN_PHONE_RAW, CONTACT_FEE_FCFA } from '../data/defaultProfiles';
import { verifyAdminPassword } from '../utils/storage';

interface AdminDashboardProps {
  profiles: Profile[];
  requests: ContactRequest[];
  onUpdateProfileStatus: (id: string, status: ProfileStatus) => void;
  onToggleProfilePhotosModesty: (id: string, hidePhotos: boolean) => void;
  onDeleteProfile: (id: string) => void;
  onUpdateAdminNotes: (id: string, notes: string) => void;
  onUpdateRequestStatus: (requestId: string, status: ContactRequestStatus, notes?: string) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  requests,
  onUpdateProfileStatus,
  onToggleProfilePhotosModesty,
  onDeleteProfile,
  onUpdateAdminNotes,
  onUpdateRequestStatus,
  onResetData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [adminTab, setAdminTab] = useState<'profiles' | 'requests' | 'settings'>('profiles');

  // Photo viewer modal state
  const [inspectingProfile, setInspectingProfile] = useState<Profile | null>(null);
  const [profileFilter, setProfileFilter] = useState<'all' | 'en_attente' | 'approuvé' | 'masqué'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Mot de passe incorrect. Le mot de passe par défaut est : admin123');
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    if (profileFilter !== 'all' && p.status !== profileFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.pseudo.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = profiles.filter((p) => p.status === 'en_attente').length;
  const approvedCount = profiles.filter((p) => p.status === 'approuvé').length;
  const totalRevenue = requests.filter((r) => r.status !== 'en_attente_paiement' && r.status !== 'annule')
    .length * CONTACT_FEE_FCFA;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="font-serif font-bold text-xl text-emerald-950 mb-1">
          Espace d'Administration
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Accès restreint au modérateur pour la validation des photos, profils et paiements MyNita/Amanata.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              required
              placeholder="Mot de passe gestionnaire (admin123)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-800 text-center"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 text-amber-300" />
            <span>Déverrouiller le panneau</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-4">
          Contact WhatsApp administrateur : {ADMIN_PHONE_NUMBER}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Top Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
              Connecté : Superviseur Général
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-950 mt-0.5">
            Tableau de Bord Administratif
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Verrouiller
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Profils en attente</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600 font-mono">{pendingCount}</span>
            <span className="text-xs text-slate-400">à modérer</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Profils approuvés</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-700 font-mono">{approvedCount}</span>
            <span className="text-xs text-slate-400">visibles</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Demandes contact</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800 font-mono">{requests.length}</span>
            <span className="text-xs text-slate-400">total</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Volume encaissé estimé</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-950 font-mono">
              {totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">FCFA</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md">
        <button
          onClick={() => setAdminTab('profiles')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            adminTab === 'profiles'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Inscriptions & Photos ({profiles.length})
        </button>

        <button
          onClick={() => setAdminTab('requests')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            adminTab === 'requests'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Paiements & Demandes ({requests.length})
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            adminTab === 'settings'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gestion
        </button>
      </div>

      {/* TAB 1: PROFILES MODERATION */}
      {adminTab === 'profiles' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setProfileFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  profileFilter === 'all'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous ({profiles.length})
              </button>
              <button
                onClick={() => setProfileFilter('en_attente')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  profileFilter === 'en_attente'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                En attente ({pendingCount})
              </button>
              <button
                onClick={() => setProfileFilter('approuvé')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  profileFilter === 'approuvé'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Approuvés ({approvedCount})
              </button>
              <button
                onClick={() => setProfileFilter('masqué')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  profileFilter === 'masqué'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Masqués
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Membre & Tél (Confidentiel)</th>
                  <th className="py-3 px-3">Âge / Ville</th>
                  <th className="py-3 px-3">Statut actuel</th>
                  <th className="py-3 px-3">Option Pudeur</th>
                  <th className="py-3 px-3">2 Photos</th>
                  <th className="py-3 px-4 text-right">Actions de modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Aucun profil ne correspond aux critères de filtre.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.pseudo}</div>
                        <div className="text-[11px] text-emerald-800 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{p.phone}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Réf: {p.id}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{p.age} ans</div>
                        <div className="text-slate-500">{p.city}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {p.profession}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {p.status === 'approuvé' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Approuvé
                          </span>
                        )}
                        {p.status === 'en_attente' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            En examen
                          </span>
                        )}
                        {p.status === 'masqué' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                            Masqué
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => onToggleProfilePhotosModesty(p.id, !p.hidePhotos)}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                            p.hidePhotos
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {p.hidePhotos ? 'Floutées (Actif)' : 'En clair'}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => setInspectingProfile(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspecter (2)</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        {p.status !== 'approuvé' ? (
                          <button
                            onClick={() => onUpdateProfileStatus(p.id, 'approuvé')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-sm"
                            title="Publier sur le site"
                          >
                            Approuver
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateProfileStatus(p.id, 'masqué')}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-medium transition-all"
                            title="Retirer temporairement du catalogue public"
                          >
                            Masquer
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Confirmez-vous la suppression définitive du profil ${p.pseudo} (${p.id}) ?`)) {
                              onDeleteProfile(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors inline-block align-middle"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT REQUESTS & PAYMENTS */}
      {adminTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-emerald-950">
                Demandes de Mise en Contact & Suivi MyNita / Amanata
              </h3>
              <p className="text-xs text-slate-500">
                Vérifiez la réception des 2 000 FCFA sur le WhatsApp Business (+227 99 61 40 98) avant de contacter le profil ciblé.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aucune demande de mise en contact enregistrée pour l'instant.
              </div>
            ) : (
              requests.map((r) => {
                const targetProfile = profiles.find((p) => p.id === r.targetProfileId);
                const waChatUrl = `https://wa.me/${r.senderPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Salam Alaykoum ${r.senderName}, ici l'administrateur de « Le Chemin pour le Nikah » concernant votre demande pour ${r.targetPseudo} (${r.targetProfileId}).`
                )}`;

                return (
                  <div key={r.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {r.id}
                          </span>
                          <span className="text-xs text-slate-400">
                            Reçue le {r.requestDate}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {r.senderName} ({r.senderAge} ans, {r.senderCity})
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5 flex-wrap">
                          <span className="font-mono text-emerald-800 font-semibold">{r.senderPhone}</span>
                          <span>·</span>
                          <span>{r.senderProfession}</span>
                          <span>·</span>
                          <span>{r.senderStatus}</span>
                        </div>
                      </div>

                      {/* Payment Badge & Method */}
                      <div className="text-left sm:text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                          <span>{r.paymentMethod}</span>
                          <span className="font-mono">{r.paymentAmount.toLocaleString()} FCFA</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1">
                          Réf SMS : <strong>{r.transactionRef || 'Non renseignée'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Target Person & Message */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1 mb-3">
                      <div>
                        <span className="font-semibold text-emerald-950">Profil sollicité : </span>
                        <strong>{r.targetPseudo}</strong> ({r.targetProfileId})
                        {targetProfile && (
                          <span className="text-slate-500 text-[11px] ml-2">
                            [Numéro privé admin: {targetProfile.phone}]
                          </span>
                        )}
                      </div>
                      {r.senderMessage && (
                        <p className="text-slate-600 italic">« {r.senderMessage} »</p>
                      )}
                    </div>

                    {/* Operational Progress Status Controller */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-600">Étape dossier :</span>
                        <select
                          value={r.status}
                          onChange={(e) =>
                            onUpdateRequestStatus(r.id, e.target.value as ContactRequestStatus)
                          }
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:border-emerald-800"
                        >
                          <option value="en_attente_paiement">1. En attente vérif paiement</option>
                          <option value="paiement_recu">2. Paiement validé</option>
                          <option value="consentement_en_cours">3. Appel de consentement en cours</option>
                          <option value="mise_en_relation_reussie">4. Contact officiel transmis (Succès)</option>
                          <option value="annule">Annulé / Profil indisponible</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={waChatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Ouvrir WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & BACKUP */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-emerald-950">
              Paramètres du Service & Déontologie
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configuration de la plateforme Le Chemin pour le Nikah.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <span className="font-bold block">Rappels Déontologiques Majeurs :</span>
            <p>
              • <strong>Règle n°1 :</strong> Ne jamais divulguer le numéro ni les photos d'un profil sans son accord préalable exprès.
            </p>
            <p>
              • <strong>Règle n°2 :</strong> Vérifier rigoureusement les deux photos de chaque célibataire avant toute publication.
            </p>
            <p>
              • <strong>Règle n°3 :</strong> Confirmer les alertes SMS MyNita et Amanata sur le WhatsApp Business <strong>{ADMIN_PHONE_NUMBER}</strong>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Réinitialisation des données de test
              </span>
              <span className="text-[11px] text-slate-500">
                Rétablit les profils par défaut et efface le cache local
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Voulez-vous réinitialiser tous les profils aux données par défaut ?')) {
                  onResetData();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurer par défaut</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PHOTO INSPECTOR (2 PHOTOS IN HIGH RES) */}
      {inspectingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
                  Contrôle Déontologique des 2 Photos Obligatoires
                </span>
                <h3 className="font-serif font-bold text-xl text-emerald-950">
                  {inspectingProfile.pseudo} ({inspectingProfile.id})
                </h3>
              </div>

              <button
                onClick={() => setInspectingProfile(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Photos side-by-side (non-blurred in admin mode) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Photo 1 : Visage & Décence
                </span>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                  <img
                    src={inspectingProfile.photo1}
                    alt="Photo 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Photo 2 : En pied & Silhouette
                </span>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                  <img
                    src={inspectingProfile.photo2}
                    alt="Photo 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Numéro confidentiel :</span>
                <span className="font-mono font-bold text-slate-900">{inspectingProfile.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Option Pudeur demandée :</span>
                <span className="font-semibold text-amber-700">
                  {inspectingProfile.hidePhotos ? 'Oui (flouter en public)' : 'Non (visible)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Attestation d\'âge (+18 ans) :</span>
                <span className="font-semibold text-emerald-700">Validée sur l'honneur</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onUpdateProfileStatus(inspectingProfile.id, 'masqué');
                  setInspectingProfile(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Refuser / Masquer
              </button>

              <button
                onClick={() => {
                  onUpdateProfileStatus(inspectingProfile.id, 'approuvé');
                  setInspectingProfile(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-amber-300" />
                <span>Valider les photos & Approuver le profil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
