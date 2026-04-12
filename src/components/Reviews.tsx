import React from 'react';
import { Star } from 'lucide-react';
import { useI18n } from '../I18nContext';

export function Reviews() {
  const { t } = useI18n();

  const translateLocation = (loc: string) => {
    if (loc.includes('Istanbul')) return loc.replace('Istanbul', t.clinics.locations.istanbul);
    if (loc.includes('Barcelona')) return loc.replace('Barcelona', t.clinics.locations.barcelona);
    if (loc.includes('Bangkok')) return loc.replace('Bangkok', t.clinics.locations.bangkok);
    return loc;
  };

  const translateProcedure = (proc: string) => {
    if (proc.includes('Rhinoplastik')) return proc.replace('Rhinoplastik', t.clinics.procedures.rhinoplasty);
    if (proc.includes('Haartransplantation')) return proc.replace('Haartransplantation', t.clinics.procedures.hairTransplant);
    if (proc.includes('Facelift')) return proc.replace('Facelift', 'Facelift'); // Assuming Facelift is same, or add to translations
    return proc;
  };

  return (
    <section id="reviews" className="bg-off-white px-[5vw] py-[100px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-blue mb-3 before:content-[''] before:w-5 before:h-0.5 before:bg-gold before:rounded-sm">
            {t.reviews.badge}
          </div>
          <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] font-medium text-navy mb-4 leading-[1.2] whitespace-pre-line">
            {t.reviews.title}
          </h2>
          <p className="text-[1rem] text-gray-600 max-w-[520px] mx-auto leading-[1.7]">
            {t.reviews.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-7 border border-gray-200 transition-shadow hover:shadow-md reveal">
            <div className="flex text-gold mb-4">
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
            </div>
            <p className="text-[0.92rem] leading-[1.7] text-gray-600 mb-5 italic">
              "{t.reviews.review1}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-blue to-sky flex items-center justify-center text-lg">
                👩
              </div>
              <div>
                <div className="text-[0.9rem] font-semibold text-navy">Sarah M.</div>
                <div className="text-[0.75rem] text-gray-400">{translateProcedure('Rhinoplastik')} · {translateLocation('Istanbul')} · {t.reviews.time1}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy to-[#0f2460] rounded-2xl p-7 transition-shadow hover:shadow-md reveal">
            <div className="flex text-gold mb-4">
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
            </div>
            <p className="text-[0.92rem] leading-[1.7] text-white/70 mb-5 italic">
              "{t.reviews.review2}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-blue to-sky flex items-center justify-center text-lg">
                👨
              </div>
              <div>
                <div className="text-[0.9rem] font-semibold text-white">Thomas K.</div>
                <div className="text-[0.75rem] text-white/50">{translateProcedure('Haartransplantation')} · {translateLocation('Barcelona')} · {t.reviews.time2}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-gray-200 transition-shadow hover:shadow-md reveal">
            <div className="flex text-gold mb-4">
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
              <Star className="w-4 h-4 fill-gold" />
            </div>
            <p className="text-[0.92rem] leading-[1.7] text-gray-600 mb-5 italic">
              "{t.reviews.review3}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-blue to-sky flex items-center justify-center text-lg">
                👩‍💼
              </div>
              <div>
                <div className="text-[0.9rem] font-semibold text-navy">Julia R.</div>
                <div className="text-[0.75rem] text-gray-400">Facelift · {translateLocation('Bangkok')} · {t.reviews.time3}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
