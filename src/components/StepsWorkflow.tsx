import React from 'react';
import { UserCheck, ShieldAlert, CreditCard, HeartHandshake } from 'lucide-react';

export const StepsWorkflow: React.FC = () => {
  const steps = [
    {
      num: 'Étape 1',
      title: 'Inscription',
      desc: 'Formulaire complet avec critères précis et deux photos récentes obligatoires.',
      icon: UserCheck,
    },
    {
      num: 'Étape 2',
      title: 'Vérification',
      desc: 'Contrôle déontologique par l\'administration avant toute publication.',
      icon: ShieldAlert,
    },
    {
      num: 'Étape 3',
      title: 'Paiement',
      desc: 'Frais de mise en relation de 2 000 FCFA réglés via MyNita ou Amanata.',
      icon: CreditCard,
    },
    {
      num: 'Étape 4',
      title: 'Mise en relation',
      desc: 'Contact officiel organisé uniquement après recueil de l\'accord mutuel.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-emerald-950">
            La démarche en 4 étapes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Un processus clair, respectueux de la loi islamique et de votre dignité
          </p>
        </div>
        <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 self-start sm:self-auto">
          Accompagnement rigoureux
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="bg-slate-50/80 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200/70 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
                    {st.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/10 text-emerald-900 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
