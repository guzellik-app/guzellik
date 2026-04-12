import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../I18nContext';

export function CTA({ onOpenModal }: { onOpenModal: () => void }) {
  const { t } = useI18n();
  return (
    <section className="text-center bg-gradient-to-br from-navy to-[#0f2460] py-[120px] px-[5vw] relative overflow-hidden">
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(45,107,228,0.3)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute -bottom-[100px] right-[10%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.12)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-gold-light mb-3 before:content-[''] before:w-5 before:h-0.5 before:bg-gold before:rounded-sm">
          {t.cta.badge}
        </div>
        <h2 className="font-serif text-[clamp(2.4rem,4vw,4rem)] font-medium text-white mb-5 leading-[1.15]" dangerouslySetInnerHTML={{ __html: t.cta.title }}>
        </h2>
        <p className="text-[1rem] text-white/60 mb-12 max-w-[480px] mx-auto">
          {t.cta.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={onOpenModal} className="font-sans text-[0.95rem] font-semibold bg-gradient-to-br from-gold to-[#a8842c] text-navy border-none cursor-pointer px-9 py-4 rounded-full shadow-[0_6px_24px_rgba(201,168,76,0.4)] transition-all hover:-translate-y-[2px] hover:shadow-[0_10px_32px_rgba(201,168,76,0.55)] flex items-center gap-2">
            {t.cta.button1} <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onOpenModal} className="font-sans text-[0.95rem] font-medium bg-white/10 text-white border-[1.5px] border-white/20 cursor-pointer px-9 py-4 rounded-full transition-all hover:bg-white/15 hover:border-white/40">
            {t.cta.button2}
          </button>
        </div>
      </div>
    </section>
  );
}
