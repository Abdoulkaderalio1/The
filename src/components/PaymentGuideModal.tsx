import React, { useState } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  HelpCircle,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';
import {
  ADMIN_PHONE_NUMBER,
  ADMIN_PHONE_RAW,
  CONTACT_FEE_FCFA,
} from '../data/defaultProfiles';

interface PaymentGuideProps {
  onGoToCatalog: () => void;
  onGoToRegister: () => void;
}

export const PaymentGuide: React.FC<PaymentGuideProps> = ({
  onGoToCatalog,
  onGoToRegister,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeService, setActiveService] = useState<'MyNita' | 'Amanata'>('MyNita');

  const copyPhone = () => {
    navigator.clipboard.writeText('+22799614098');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold mb-2">
          <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
          <span>Frais, Modalités & Déontologie</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">
          Guide des Tarifs & Paiements Mobiles
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tous les paiements s'effectuent en toute sécurité via les services agréés au Niger : <strong>MyNita</strong> et <strong>Amanata</strong>.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
              Frais uniques par mise en contact
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                {CONTACT_FEE_FCFA.toLocaleString()}
              </span>
              <span className="text-lg text-emerald-200 font-semibold">FCFA</span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-2 max-w-md leading-relaxed">
              La consultation publique des profils autorisés est libre. Les frais de {CONTACT_FEE_FCFA.toLocaleString()} FCFA ne sont exigés que lors d'une demande formelle pour entrer en relation avec un profil choisi.
            </p>
          </div>

          <div className="bg-emerald-900/80 p-4 rounded-2xl border border-emerald-700/60 backdrop-blur-sm sm:w-64 space-y-2">
            <span className="text-[11px] font-semibold text-emerald-300 block">
              Ce que couvrent vos frais :
            </span>
            <ul className="text-xs text-emerald-100 space-y-1.5 list-disc list-inside">
              <li>Examen strict du dossier & photos</li>
              <li>Consultation privée du/de la candidate</li>
              <li>Organisation de l'échange dans le respect</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods (MyNita & Amanata) */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-emerald-950">
          Services de Transfert Autorisés
        </h3>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-sm">
          <button
            onClick={() => setActiveService('MyNita')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeService === 'MyNita'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MyNita (Niger)
          </button>
          <button
            onClick={() => setActiveService('Amanata')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeService === 'Amanata'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amanata (Niger)
          </button>
        </div>

        {/* Step-by-Step for Active Service */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-800" />
              <span className="font-bold text-sm text-slate-900">
                Numéro Récepteur Officiel {activeService}
              </span>
            </div>

            <button
              onClick={copyPhone}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-emerald-950 hover:bg-slate-100 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Numéro copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ADMIN_PHONE_NUMBER}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="font-bold text-amber-600 block mb-1">Étape 1</span>
              <p className="text-slate-600">
                Ouvrez votre application ou rendez-vous en agence <strong>{activeService}</strong>.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="font-bold text-amber-600 block mb-1">Étape 2</span>
              <p className="text-slate-600">
                Transférez exactement <strong>{CONTACT_FEE_FCFA.toLocaleString()} FCFA</strong> au{' '}
                <strong>{ADMIN_PHONE_NUMBER}</strong>.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="font-bold text-amber-600 block mb-1">Étape 3</span>
              <p className="text-slate-600">
                Conservez le SMS ou la capture d'écran contenant la référence de confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Business Verification Box */}
      <div className="bg-emerald-50/70 border border-emerald-900/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-emerald-950 text-base">
              WhatsApp Business de l'Administrateur
            </h4>
            <p className="text-xs text-slate-600">
              Canal unique pour la validation des paiements, la confirmation d'inscription et l'assistance.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-emerald-900/10">
          <div className="text-xs text-slate-700">
            <span>Numéro officiel : </span>
            <strong className="font-mono text-emerald-950 text-sm">{ADMIN_PHONE_NUMBER}</strong>
          </div>

          <a
            href={`https://wa.me/${ADMIN_PHONE_RAW}?text=${encodeURIComponent(
              "Salam Alaykoum Administration Le Chemin pour le Nikah, je souhaite obtenir de l'aide concernant les paiements MyNita / Amanata."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Contacter l'administrateur</span>
          </a>
        </div>
      </div>

      {/* Important Security Notice */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Règles Impératives & Sécurité des Membres</span>
        </div>
        <p className="leading-relaxed">
          • <strong>Aucune publication sans autorisation :</strong> Vos photos, votre nom de famille et vos coordonnées privées ne sont jamais dévoilées sans votre accord.
        </p>
        <p className="leading-relaxed">
          • <strong>Protection contre les arnaques :</strong> L'administration ne vous demandera jamais d'effectuer des transferts vers un autre numéro que le <strong>{ADMIN_PHONE_NUMBER}</strong>.
        </p>
        <p className="leading-relaxed">
          • <strong>Consentement mutuel :</strong> Après paiement, l'administrateur contacte le membre convoité. Si la personne décline poliment, vos frais sont réassignables à un autre profil sans surcoût.
        </p>
      </div>

      {/* Action Footers */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onGoToCatalog}
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm text-center"
        >
          Consulter les profils vérifiés
        </button>
        <button
          onClick={onGoToRegister}
          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition-colors text-center"
        >
          S'inscrire comme célibataire
        </button>
      </div>
    </div>
  );
};
