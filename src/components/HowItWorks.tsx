import React from 'react';
import { Search, Scale, Calendar, ArrowRight } from 'lucide-react';
import { useI18n } from '../I18nContext';

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how" className="bg-gradient-to-br from-navy to-[#0f2460] px-[5vw] py-[100px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-gold-light mb-3 before:content-[''] before:w-5 before:h-0.5 before:bg-gold before:rounded-sm">
            {t.how.badge}
          </div>
          <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] font-medium text-white mb-4 leading-[1.2] whitespace-pre-line">
            {t.how.title}
          </h2>
          <p className="text-[1rem] text-white/55 max-w-[520px] mx-auto leading-[1.7]">
            {t.how.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-5 lg:gap-3 items-start">
          <div className="text-center p-10 rounded-2xl bg-white/5 border border-white/10 transition-colors hover:bg-sky/10 reveal">
            <div className="font-serif text-6xl font-light text-sky/15 leading-none mb-3">01</div>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 bg-gradient-to-br from-blue/30 to-blue-dark/50 flex items-center justify-center border border-sky/20 text-sky">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-[1.1rem] font-semibold text-white mb-2.5">{t.how.step1Title}</h3>
            <p className="text-[0.88rem] text-white/50 leading-[1.65]">
              {t.how.step1Desc}
            </p>
          </div>

          <div className="hidden lg:flex items-center justify-center text-2xl text-sky/20 pt-[60px]">
            <ArrowRight />
          </div>

          <div className="text-center p-10 rounded-2xl bg-white/5 border border-white/10 transition-colors hover:bg-sky/10 reveal">
            <div className="font-serif text-6xl font-light text-sky/15 leading-none mb-3">02</div>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 bg-gradient-to-br from-blue/30 to-blue-dark/50 flex items-center justify-center border border-sky/20 text-sky">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="text-[1.1rem] font-semibold text-white mb-2.5">{t.how.step2Title}</h3>
            <p className="text-[0.88rem] text-white/50 leading-[1.65]">
              {t.how.step2Desc}
            </p>
          </div>

          <div className="hidden lg:flex items-center justify-center text-2xl text-sky/20 pt-[60px]">
            <ArrowRight />
          </div>

          <div className="text-center p-10 rounded-2xl bg-white/5 border border-white/10 transition-colors hover:bg-sky/10 reveal">
            <div className="font-serif text-6xl font-light text-sky/15 leading-none mb-3">03</div>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 bg-gradient-to-br from-blue/30 to-blue-dark/50 flex items-center justify-center border border-sky/20 text-sky">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-[1.1rem] font-semibold text-white mb-2.5">{t.how.step3Title}</h3>
            <p className="text-[0.88rem] text-white/50 leading-[1.65]">
              {t.how.step3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
