import React from 'react';
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useI18n } from '../I18nContext';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-navy px-[5vw] pt-[80px] pb-[40px] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-[60px] pb-[60px] border-b border-white/10">
        <div>
          <div className="font-serif text-[1.4rem] font-semibold text-white tracking-wide" dangerouslySetInnerHTML={{ __html: t.brand.nameHtml }}>
          </div>
          <p className="text-[0.88rem] text-white/45 leading-[1.7] mt-4 mb-6">
            {t.footer.desc}
          </p>
          <div className="flex gap-2.5">
            <button className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[0.85rem] text-white cursor-pointer transition-colors hover:bg-sky/15">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[0.85rem] text-white cursor-pointer transition-colors hover:bg-sky/15">
              <Linkedin className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[0.85rem] text-white cursor-pointer transition-colors hover:bg-sky/15">
              <Instagram className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[0.85rem] text-white cursor-pointer transition-colors hover:bg-sky/15">
              <Youtube className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-[0.8rem] font-semibold text-white/35 tracking-[0.1em] uppercase mb-5">{t.footer.platform}</h4>
          <ul className="list-none flex flex-col gap-2.5">
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.p1}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.p2}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.p4}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.p3}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.8rem] font-semibold text-white/35 tracking-[0.1em] uppercase mb-5">{t.footer.procedures}</h4>
          <ul className="list-none flex flex-col gap-2.5">
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.clinics.procedures.rhinoplasty}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.clinics.procedures.hairTransplant}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.clinics.procedures.dentalImplants}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">Facelift</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[0.8rem] font-semibold text-white/35 tracking-[0.1em] uppercase mb-5">{t.footer.company}</h4>
          <ul className="list-none flex flex-col gap-2.5">
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.c1}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.c2}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.c3}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.c4}</a></li>
            <li><a href="#" className="text-[0.88rem] text-white/55 no-underline transition-colors hover:text-white">{t.footer.c5}</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.8rem] text-white/30 text-center sm:text-left">
        <span>{t.brand.copyright}</span>
        <div className="flex gap-5">
          <a href="#" className="text-white/40 no-underline transition-colors hover:text-white/70">{t.footer.privacy}</a>
          <a href="#" className="text-white/40 no-underline transition-colors hover:text-white/70">{t.footer.imprint}</a>
          <a href="#" className="text-white/40 no-underline transition-colors hover:text-white/70">{t.footer.terms}</a>
        </div>
      </div>
    </footer>
  );
}
