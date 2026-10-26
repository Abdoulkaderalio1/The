import React, { useState } from 'react';
import { ContactRequest, PaymentMethod, Profile } from '../types';
import {
  X,
  Copy,
  Check,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Info,
  AlertCircle,
} from 'lucide-react';
import {
  ADMIN_PHONE_NUMBER,
  ADMIN_PHONE_RAW,
  CONTACT_FEE_FCFA,
} from '../data/defaultProfiles';
import { createWhatsAppContactUrl } from '../utils/storage';

interface ContactModalProps {
  targetProfile: Profile | null;
  onClose: () => void;
  onSubmitRequest: (req: ContactRequest) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  targetProfile,
  onClose,
  onSubmitRequest,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAge, setSenderAge] = useState<number | ''>('');
  const [senderCity, setSenderCity] = useState('');
  const [senderProfession, setSenderProfession] = useState('');
  const [senderStatus, setSenderStatus] = useState('Célibataire (Jamais marié)');
  const [senderMessage, setSenderMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MyNita');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [step, setStep] = useState<'instructions' | 'confirmation'>('instructions');

  if (!targetProfile) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+22799614098');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderPhone || !senderAge || !senderCity) {
      alert('Veuillez remplir les informations obligatoires de votre candidature.');
      return;
    }

    const newRequest: ContactRequest = {
      id: `DEM-${Math.floor(100 + Math.random() * 900)}`,
      targetProfileId: targetProfile.id,
      targetPseudo: targetProfile.pseudo,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      senderAge: Number(senderAge),
      senderCity: senderCity.trim(),
      senderProfession: senderProfession.trim() || 'Non spécifié',
      senderStatus,
      senderMessage: senderMessage.trim(),
      paymentMethod,
      paymentAmount: CONTACT_FEE_FCFA,
      transactionRef: transactionRef.trim() || 'En attente de confirmation SMS',
      status: transactionRef.trim() ? 'paiement_recu' : 'en_attente_paiement',
      requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminNotes: `Demande reçue via le site pour ${targetProfile.pseudo}. Mode : ${paymentMethod}.`,
    };

    onSubmitRequest(newRequest);
    setStep('confirmation');
  };

  const whatsappUrl = createWhatsAppContactUrl({
    targetPseudo: targetProfile.pseudo,
    targetId: targetProfile.id,
    senderName: senderName || 'Candidat(e)',
    senderPhone: senderPhone || 'Non renseigné',
    paymentMethod,
    transactionRef: transactionRef || 'SMS en cours d\'envoi',
    amount: CONTACT_FEE_FCFA,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              Procédure officielle de mise en contact
            </span>
            <h2 className="font-serif font-bold text-lg text-emerald-950">
              Mise en relation avec {targetProfile.pseudo}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 'instructions' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Box with Clear Pricing & Instructions */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-amber-900 block">
                        Frais administratifs de mise en relation
                      </span>
                      <span className="font-mono text-lg font-extrabold text-amber-950">
                        {CONTACT_FEE_FCFA.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] bg-amber-200/80 text-amber-900 font-medium px-2.5 py-1 rounded-md">
                    Non remboursable après contact
                  </span>
                </div>

                <p className="text-xs text-amber-950/90 leading-relaxed">
                  Ces frais préservent la sincérité des démarches et couvrent la vérification administrative,
                  l'appel de consentement auprès de <strong>{targetProfile.pseudo}</strong> et l'organisation du contact digne.
                </p>

                {/* Mobile Money Service Choice */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-800 block mb-2">
                    Choisissez votre service de transfert mobile :
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MyNita')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        paymentMethod === 'MyNita'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm block">MyNita</span>
                        <span className="text-[11px] text-slate-500">Paiement instantané</span>
                      </div>
                      <Smartphone className="w-4 h-4 text-emerald-800" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Amanata')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        paymentMethod === 'Amanata'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm block">Amanata</span>
                        <span className="text-[11px] text-slate-500">Transfert direct</span>
                      </div>
                      <Smartphone className="w-4 h-4 text-emerald-800" />
                    </button>
                  </div>
                </div>

                {/* Step Instructions */}
                <div className="bg-white p-4 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      Numéro officiel ({paymentMethod}) :
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs transition-colors"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>+227 99 61 40 98</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    1. Effectuez le transfert de <strong>{CONTACT_FEE_FCFA.toLocaleString()} FCFA</strong> vers le{' '}
                    <strong>{ADMIN_PHONE_NUMBER}</strong> via l'application ou l'agence <strong>{paymentMethod}</strong>.
                  </p>
                  <p className="text-[11px] text-slate-600">
                    2. Notez la référence de transaction SMS reçue sur votre téléphone ci-dessous.
                  </p>
                </div>
              </div>

              {/* Form: Requester Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Vos informations pour la mise en relation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Votre prénom ou nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Moussa Abdou"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Votre numéro WhatsApp (joignable) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +227 90 00 00 00"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Votre âge *
                    </label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={85}
                      placeholder="Ex: 30"
                      value={senderAge}
                      onChange={(e) => setSenderAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Votre ville *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Niamey"
                      value={senderCity}
                      onChange={(e) => setSenderCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Situation
                    </label>
                    <select
                      value={senderStatus}
                      onChange={(e) => setSenderStatus(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
                    >
                      <option value="Célibataire (Jamais marié)">Célibataire</option>
                      <option value="Divorcé(e)">Divorcé(e)</option>
                      <option value="Veuf / Veuve">Veuf / Veuve</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Votre profession
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cadre d'entreprise, Enseignant, Commerçant..."
                    value={senderProfession}
                    onChange={(e) => setSenderProfession(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Référence de transfert {paymentMethod} (reçue par SMS)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: MN-9823149 ou AM-110293 (Optionnel si vous envoyez la capture sur WhatsApp)"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Court message de motivation pour {targetProfile.pseudo} (présenté en toute pudeur)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Salam Alaykoum, j'ai été touché(e) par vos critères et souhaite faire votre connaissance selon les règles convenables..."
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              </div>

              {/* Strict Notice */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Engagement déontologique strict</span>
                </div>
                <p>
                  L'administrateur consultera d'abord <strong>{targetProfile.pseudo}</strong>. En cas de refus poli ou d'incompatibilité, vos frais ne sont pas perdus : vous pourrez solliciter un autre profil sans frais supplémentaires selon les conditions du service.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Enregistrer ma demande & Confirmer</span>
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation & WhatsApp Transmission Step */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-emerald-950">
                  Demande enregistrée avec succès !
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Votre dossier de mise en contact pour <strong>{targetProfile.pseudo}</strong> est bien pris en compte par la direction.
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-900/10 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-emerald-900/10 pb-1.5">
                  <span className="text-slate-500">Profil ciblé :</span>
                  <span className="font-bold text-slate-900">{targetProfile.pseudo} ({targetProfile.id})</span>
                </div>
                <div className="flex justify-between border-b border-emerald-900/10 pb-1.5">
                  <span className="text-slate-500">Moyen de règlement :</span>
                  <span className="font-bold text-slate-900">{paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-900/10 pb-1.5">
                  <span className="text-slate-500">Montant :</span>
                  <span className="font-mono font-bold text-emerald-900">{CONTACT_FEE_FCFA.toLocaleString()} FCFA</span>
                </div>
                {transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Réf. transaction :</span>
                    <span className="font-mono text-slate-900">{transactionRef}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Pour finaliser immédiatement la vérification et envoyer votre capture de SMS à l'administrateur, cliquez sur le bouton WhatsApp ci-dessous :
              </p>

              <div className="space-y-2 pt-2 max-w-md mx-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-300" />
                  <span>Envoyer la confirmation sur WhatsApp ({ADMIN_PHONE_NUMBER})</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
                >
                  Fermer cette fenêtre
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
