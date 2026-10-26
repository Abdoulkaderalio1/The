import React, { useState } from 'react';
import { Profile, Gender, MaritalStatus, ReligiousPractice } from '../types';
import {
  Upload,
  CheckCircle2,
  ShieldCheck,
  EyeOff,
  Image as ImageIcon,
  AlertCircle,
  MessageCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { ADMIN_PHONE_NUMBER, ADMIN_PHONE_RAW } from '../data/defaultProfiles';

interface RegistrationFormProps {
  onAddProfile: (profile: Profile) => void;
  onSuccess: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onAddProfile,
  onSuccess,
}) => {
  const [pseudo, setPseudo] = useState('');
  const [gender, setGender] = useState<Gender>('femme');
  const [age, setAge] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Célibataire (Jamais marié)');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const [religiousPractice, setReligiousPractice] = useState<ReligiousPractice>(
    'Régulier(ère) et engagé(e)'
  );
  const [education, setEducation] = useState('');
  const [children, setChildren] = useState('Sans enfant');
  const [polygamyAcceptance, setPolygamyAcceptance] = useState<'Ouvert(e)' | 'Non envisagé' | 'Non applicable'>(
    'Non envisagé'
  );

  const [photo1, setPhoto1] = useState<string>('');
  const [photo2, setPhoto2] = useState<string>('');
  const [hidePhotos, setHidePhotos] = useState<boolean>(true);
  const [consentPublish, setConsentPublish] = useState<boolean>(true);
  const [isAdult, setIsAdult] = useState<boolean>(false);
  const [submittedProfile, setSubmittedProfile] = useState<Profile | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, photoNum: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        if (photoNum === 1) setPhoto1(event.target.result);
        else setPhoto2(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdult) {
      alert('Vous devez obligatoirement confirmer que vous avez au moins 18 ans révolus.');
      return;
    }

    if (!photo1 || !photo2) {
      alert('Deux photos récentes sont strictement obligatoires pour constituer votre dossier.');
      return;
    }

    const generatedId = `NIKAH-${Math.floor(100 + Math.random() * 900)}`;

    const newProfile: Profile = {
      id: generatedId,
      pseudo: pseudo.trim(),
      gender,
      age: Number(age),
      city: city.trim(),
      profession: profession.trim(),
      maritalStatus,
      phone: phone.trim(),
      description: description.trim(),
      criteria: criteria.trim(),
      religiousPractice,
      education: education.trim() || 'Non spécifié',
      children,
      polygamyAcceptance,
      photo1,
      photo2,
      hidePhotos,
      consentPublish,
      isAdult,
      status: 'en_attente', // Requires admin moderation
      submissionDate: new Date().toISOString().substring(0, 10),
      adminNotes: 'Nouvelle inscription via formulaire web. En attente de vérification des 2 photos.',
    };

    onAddProfile(newProfile);
    setSubmittedProfile(newProfile);
  };

  if (submittedProfile) {
    const whatsappNoticeUrl = `https://wa.me/${ADMIN_PHONE_RAW}?text=${encodeURIComponent(
      `Salam Alaykoum Administration Le Chemin pour le Nikah,\n\nJe viens de déposer mon dossier d'inscription :\n• Référence : ${submittedProfile.id}\n• Pseudonyme : ${submittedProfile.pseudo}\n• Numéro : ${submittedProfile.phone}\n• Âge/Ville : ${submittedProfile.age} ans, ${submittedProfile.city}\n\nMes deux photos sont transmises dans le système, je suis disponible pour vérification.`
    )}`;

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <UserCheck className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Dossier transmis avec succès
          </span>
          <h2 className="font-serif font-bold text-2xl text-emerald-950">
            Bienvenue sur Le Chemin pour le Nikah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Votre dossier porte le numéro de référence{' '}
            <strong className="font-mono text-emerald-900">{submittedProfile.id}</strong>.
            Il a été placé dans la file d'attente de vérification de l'administrateur.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-900/10 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span>Prochaines étapes pour votre profil :</span>
          </div>
          <p className="text-slate-600">
            1. <strong>Contrôle déontologique :</strong> L'administrateur vérifie vos 2 photographies pour garantir décence et authenticité.
          </p>
          <p className="text-slate-600">
            2. <strong>Validation :</strong> Dès approbation, votre profil descriptif apparaît sur la plateforme.
          </p>
          <p className="text-slate-600">
            3. <strong>Pudeur :</strong> {submittedProfile.hidePhotos ? 'Vos photos resteront floutées en public comme vous l\'avez demandé.' : 'Vos photos seront visibles selon votre consentement.'}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={whatsappNoticeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-emerald-300" />
            <span>Signaler mon inscription sur WhatsApp ({ADMIN_PHONE_NUMBER})</span>
          </a>

          <button
            onClick={onSuccess}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Retourner au catalogue des profils
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
          <span>Formulaire officiel d'inscription confidentiel</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-emerald-950">
          Inscription des Célibataires
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Renseignez fidèlement vos critères. Vos coordonnées privées et vos photos ne sont jamais diffusées sans votre accord.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Genre & Pseudonyme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Je suis *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('femme')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  gender === 'femme'
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Une femme (Sœur)
              </button>
              <button
                type="button"
                onClick={() => setGender('homme')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  gender === 'homme'
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Un homme (Frère)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Prénom ou Pseudonyme public *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Sœur Amina ou Frère Ibrahim"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        </div>

        {/* Age, Ville, Profession */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Âge (Min. 18 ans) *
            </label>
            <input
              type="number"
              required
              min={18}
              max={85}
              placeholder="Ex: 27"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Ville de résidence *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Niamey, Maradi, Zinder..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Profession exercée *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Enseignant, Commerçant..."
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        </div>

        {/* Situation matrimoniale & Pratique */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Situation matrimoniale *
            </label>
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
            >
              <option value="Célibataire (Jamais marié)">Célibataire (Jamais marié)</option>
              <option value="Divorcé(e)">Divorcé(e)</option>
              <option value="Veuf / Veuve">Veuf / Veuve</option>
              <option value="En instance de divorce">En instance de divorce</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Assiduité religieuse *
            </label>
            <select
              value={religiousPractice}
              onChange={(e) => setReligiousPractice(e.target.value as ReligiousPractice)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
            >
              <option value="Très assidu(e) (5 prières à la mosquée/à l'heure)">
                Très assidu(e) (5 prières à l'heure)
              </option>
              <option value="Régulier(ère) et engagé(e)">Régulier(ère) et engagé(e)</option>
              <option value="En constante progression">En constante progression</option>
            </select>
          </div>
        </div>

        {/* Détails complémentaires */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Enfants à charge
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
            >
              <option value="Sans enfant">Sans enfant</option>
              <option value="1 enfant">1 enfant</option>
              <option value="2 enfants">2 enfants</option>
              <option value="3 enfants ou plus">3 enfants ou plus</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Niveau d'études / diplôme
            </label>
            <input
              type="text"
              placeholder="Ex: Licence, Bac, Études islamiques"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Position polygamie
            </label>
            <select
              value={polygamyAcceptance}
              onChange={(e) =>
                setPolygamyAcceptance(e.target.value as 'Ouvert(e)' | 'Non envisagé' | 'Non applicable')
              }
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-800"
            >
              <option value="Non envisagé">Non envisagé</option>
              <option value="Ouvert(e)">Ouvert(e)</option>
              <option value="Non applicable">Non applicable</option>
            </select>
          </div>
        </div>

        {/* Numéro WhatsApp confidentiel */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Votre Numéro WhatsApp confidentiel (strictement réservé à l'administrateur) *
          </label>
          <input
            type="tel"
            required
            placeholder="Ex: +227 90 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Ce numéro ne sera jamais publié ni rendu public sur le site.
          </p>
        </div>

        {/* Description & Recherche */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Description personnelle & Tempérament *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Présentez vos valeurs morales, vos centres d'intérêt, votre conception de la vie de couple et de la piété..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Critères souhaités chez le futur conjoint *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Âge approximatif, pratique religieuse, caractère, projet de vie, conditions d'entente..."
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
            />
          </div>
        </div>

        {/* Section 2 Photos Obligatoires */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-900/20 space-y-4">
          <div>
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-800" />
              Deux belles photos récentes obligatoires *
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Chaque membre doit fournir deux photos décentes (1 portrait visage dégagé et 1 photo en pied ou posture décente).
              Elles font l'objet d'un examen approfondi par l'administrateur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Photo 1 */}
            <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-3">
              <span className="text-xs font-semibold text-slate-800 block">
                Photo 1 : Visage décent (Obligatoire)
              </span>

              {photo1 ? (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border">
                  <img src={photo1} alt="Aperçu Photo 1" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhoto1('')}
                    className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md hover:bg-black/80"
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-700 cursor-pointer p-4 transition-colors bg-slate-50">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-emerald-900 text-center">
                    Choisir la photo 1
                  </span>
                  <span className="text-[10px] text-slate-500 text-center mt-1">
                    Format JPG, PNG (Max 5 Mo)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 1)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Photo 2 */}
            <div className="bg-white p-4 rounded-xl border border-emerald-900/10 space-y-3">
              <span className="text-xs font-semibold text-slate-800 block">
                Photo 2 : En pied ou posture digne (Obligatoire)
              </span>

              {photo2 ? (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border">
                  <img src={photo2} alt="Aperçu Photo 2" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhoto2('')}
                    className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md hover:bg-black/80"
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-700 cursor-pointer p-4 transition-colors bg-slate-50">
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-emerald-900 text-center">
                    Choisir la photo 2
                  </span>
                  <span className="text-[10px] text-slate-500 text-center mt-1">
                    Format JPG, PNG (Max 5 Mo)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 2)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Confidentiality & Consent Checks */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hidePhotos}
              onChange={(e) => setHidePhotos(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-900 focus:ring-emerald-800"
            />
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-emerald-950 block">
                Option Pudeur (Recommandée) : Flouter mes photos sur le catalogue public
              </span>
              <span className="text-slate-500 text-[11px] leading-relaxed block mt-0.5">
                Vos photos ne seront jamais visibles par le grand public. Elles seront uniquement présentées à un(e) prétendant(e) sérieux(se) ayant réglé les frais et après votre consentement exprès.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-slate-200/80">
            <input
              type="checkbox"
              checked={consentPublish}
              onChange={(e) => setConsentPublish(e.target.checked)}
              required
              className="mt-1 w-4 h-4 rounded text-emerald-900 focus:ring-emerald-800"
            />
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">
                Consentement de publication après vérification *
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                J'autorise l'administration à examiner mon dossier et à publier ma fiche anonymisée sur « Le Chemin pour le Nikah ».
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-slate-200/80">
            <input
              type="checkbox"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              required
              className="mt-1 w-4 h-4 rounded text-emerald-900 focus:ring-emerald-800"
            />
            <div className="text-xs text-slate-700">
              <span className="font-bold text-emerald-950">
                Attestation de majorité légale (Obligatoire) *
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Je certifie sur l'honneur avoir au moins 18 ans révolus et être juridiquement apte au mariage.
              </span>
            </div>
          </label>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span>Soumettre mon dossier à l'administrateur</span>
        </button>
      </form>
    </div>
  );
};
