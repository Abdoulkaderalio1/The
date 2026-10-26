import { ContactRequest, Profile } from '../types';
import {
  ADMIN_PHONE_RAW,
  CONTACT_FEE_FCFA,
  DEFAULT_CONTACT_REQUESTS,
  DEFAULT_PROFILES,
} from '../data/defaultProfiles';

const PROFILES_STORAGE_KEY = 'chemin_nikah_profiles_v1';
const REQUESTS_STORAGE_KEY = 'chemin_nikah_requests_v1';
const ADMIN_PASSCODE = 'admin123';

export function getStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_PROFILES;
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function saveStoredProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des profils', err);
  }
}

export function getStoredRequests(): ContactRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(DEFAULT_CONTACT_REQUESTS));
      return DEFAULT_CONTACT_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_CONTACT_REQUESTS;
  } catch {
    return DEFAULT_CONTACT_REQUESTS;
  }
}

export function saveStoredRequests(requests: ContactRequest[]): void {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des demandes', err);
  }
}

export function resetToDefaults(): void {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(DEFAULT_CONTACT_REQUESTS));
}

export function verifyAdminPassword(input: string): boolean {
  return input === ADMIN_PASSCODE;
}

export function createWhatsAppContactUrl(req: {
  targetPseudo: string;
  targetId: string;
  senderName: string;
  senderPhone: string;
  paymentMethod: string;
  transactionRef?: string;
  amount: number;
}): string {
  const text = `Salam Alaykoum Administration Le Chemin pour le Nikah,

Je vous contacte concernant une demande de mise en relation officielle :
• Profil ciblé : ${req.targetPseudo} (${req.targetId})
• Demandeur : ${req.senderName} (${req.senderPhone})
• Frais prévus : ${req.amount.toLocaleString()} FCFA
• Moyen de paiement : ${req.paymentMethod}
• Référence de transaction : ${req.transactionRef || 'En attente de validation'}

Je confirme avoir effectué le transfert pour initier la consultation de consentement mutuel.`;

  return `https://wa.me/${ADMIN_PHONE_RAW}?text=${encodeURIComponent(text)}`;
}

export function createGeneralSupportUrl(subject?: string): string {
  const text = subject
    ? `Salam Alaykoum Administration Le Chemin pour le Nikah. Objet : ${subject}`
    : `Salam Alaykoum Administration Le Chemin pour le Nikah, j'ai une question concernant le service et les démarches de mise en relation.`;
  return `https://wa.me/${ADMIN_PHONE_RAW}?text=${encodeURIComponent(text)}`;
}
