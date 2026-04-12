import React from 'react';
import { useI18n } from '../I18nContext';

export function BeforeAfter() {
  const { t } = useI18n();
  return (
    <section id="results" className="px-[5vw] py-[100px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-blue mb-3 before:content-[''] before:w-5 before:h-0.5 before:bg-gold before:rounded-sm">
            {t.beforeAfter.badge}
          </div>
          <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] font-medium text-navy mb-4 leading-[1.2] whitespace-pre-line">
            {t.beforeAfter.title}
          </h2>
          <p className="text-[1rem] text-gray-600 max-w-[520px] leading-[1.7]">
            {t.beforeAfter.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden relative aspect-[3/4] cursor-pointer group reveal">
            <div className="w-full h-full bg-gradient-to-br from-sky to-light-blue flex items-center justify-center text-5xl transition-transform duration-400 group-hover:scale-105">
              👃
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/75 to-transparent p-5 pt-10">
              <div className="text-[0.72rem] font-semibold text-gold-light tracking-wider uppercase">{t.clinics.procedures.rhinoplasty}</div>
              <div className="text-[0.88rem] font-medium text-white mt-0.5">Aesthetic Plus {t.clinics.locations.istanbul}</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden relative aspect-[3/4] cursor-pointer group lg:mt-8 reveal">
            <div className="w-full h-full bg-gradient-to-br from-[#d0e8ff] to-[#e8f4ff] flex items-center justify-center text-5xl transition-transform duration-400 group-hover:scale-105">
              💇
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/75 to-transparent p-5 pt-10">
              <div className="text-[0.72rem] font-semibold text-gold-light tracking-wider uppercase">{t.clinics.procedures.hairTransplant}</div>
              <div className="text-[0.88rem] font-medium text-white mt-0.5">Lumière Medical Clinic</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden relative aspect-[3/4] cursor-pointer group reveal">
            <div className="w-full h-full bg-gradient-to-br from-[#ffefc0] to-[#fff8e8] flex items-center justify-center text-5xl transition-transform duration-400 group-hover:scale-105">
              😊
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/75 to-transparent p-5 pt-10">
              <div className="text-[0.72rem] font-semibold text-gold-light tracking-wider uppercase">Facelift</div>
              <div className="text-[0.88rem] font-medium text-white mt-0.5">Clínica Beauté</div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden relative aspect-[3/4] cursor-pointer group lg:-mt-8 reveal">
            <div className="w-full h-full bg-gradient-to-br from-[#e8f8f0] to-[#d0f0e0] flex items-center justify-center text-5xl transition-transform duration-400 group-hover:scale-105">
              🦷
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/75 to-transparent p-5 pt-10">
              <div className="text-[0.72rem] font-semibold text-gold-light tracking-wider uppercase">{t.clinics.procedures.dentalImplants}</div>
              <div className="text-[0.88rem] font-medium text-white mt-0.5">DentaCare Zürich</div>
            </div>
          </div>
        </div>

        <p className="text-center mt-7 text-[0.75rem] text-gray-400 italic">
          {t.beforeAfter.disclaimer}
        </p>
      </div>
    </section>
  );
}
