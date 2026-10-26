export type Gender = 'homme' | 'femme';

export type MaritalStatus =
  | 'Célibataire (Jamais marié)'
  | 'Divorcé(e)'
  | 'Veuf / Veuve'
  | 'En instance de divorce';

export type ReligiousPractice =
  | 'Très assidu(e) (5 prières à la mosquée/à l\'heure)'
  | 'Régulier(ère) et engagé(e)'
  | 'En constante progression';

export type ProfileStatus = 'approuvé' | 'en_attente' | 'masqué';

export interface Profile {
  id: string;
  pseudo: string;
  gender: Gender;
  age: number;
  city: string;
  profession: string;
  maritalStatus: MaritalStatus;
  phone: string; // Strictly confidential for admin
  description: string;
  criteria: string;
  religiousPractice?: ReligiousPractice;
  children?: string;
  education?: string;
  polygamyAcceptance?: 'Ouvert(e)' | 'Non envisagé' | 'Non applicable';
  photo1: string;
  photo2: string;
  hidePhotos: boolean; // "Option Pudeur" - blurred on public feed
  consentPublish: boolean;
  isAdult: boolean;
  status: ProfileStatus;
  submissionDate: string;
  adminNotes?: string;
}

export type PaymentMethod = 'MyNita' | 'Amanata';

export type ContactRequestStatus =
  | 'en_attente_paiement'
  | 'paiement_recu'
  | 'consentement_en_cours'
  | 'mise_en_relation_reussie'
  | 'annule';

export interface ContactRequest {
  id: string;
  targetProfileId: string;
  targetPseudo: string;
  senderName: string;
  senderPhone: string;
  senderAge: number;
  senderCity: string;
  senderProfession: string;
  senderStatus: string;
  senderMessage?: string;
  paymentMethod: PaymentMethod;
  paymentAmount: number; // e.g. 2000 FCFA
  transactionRef: string;
  status: ContactRequestStatus;
  requestDate: string;
  adminNotes?: string;
}
