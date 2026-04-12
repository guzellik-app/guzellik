import React from 'react';
import { ShieldCheck, MessageSquare, CreditCard, Globe } from 'lucide-react';
import { useI18n } from '../I18nContext';

export function TrustBar() {
  const { t } = useI18n();
  return (
    <div className="px-[5vw] py-[60px] bg-navy">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 rounded-2xl overflow-hidden">
        <div className="bg-navy p-7 lg:px-7 lg:py-9 flex items-start gap-4 transition-colors hover:bg-sky/5 reveal">
          <div className="w-12 h-12 rounded-xl shrink-0 bg-sky/10 flex items-center justify-center text-sky">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <strong className="block text-[0.95rem] font-semibold text-white mb-1">{t.trust.verified}</strong>
            <p className="text-[0.8rem] text-white/50 leading-[1.5]">{t.trust.verifiedDesc}</p>
          </div>
        </div>
        <div className="bg-navy p-7 lg:px-7 lg:py-9 flex items-start gap-4 transition-colors hover:bg-sky/5 reveal">
          <div className="w-12 h-12 rounded-xl shrink-0 bg-sky/10 flex items-center justify-center text-sky">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <strong className="block text-[0.95rem] font-semibold text-white mb-1">{t.trust.reviews}</strong>
            <p className="text-[0.8rem] text-white/50 leading-[1.5]">{t.trust.reviewsDesc}</p>
          </div>
        </div>
        <div className="bg-navy p-7 lg:px-7 lg:py-9 flex items-start gap-4 transition-colors hover:bg-sky/5 reveal">
          <div className="w-12 h-12 rounded-xl shrink-0 bg-sky/10 flex items-center justify-center text-sky">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <strong className="block text-[0.95rem] font-semibold text-white mb-1">{t.trust.prices}</strong>
            <p className="text-[0.8rem] text-white/50 leading-[1.5]">{t.trust.pricesDesc}</p>
          </div>
        </div>
        <div className="bg-navy p-7 lg:px-7 lg:py-9 flex items-start gap-4 transition-colors hover:bg-sky/5 reveal">
          <div className="w-12 h-12 rounded-xl shrink-0 bg-sky/10 flex items-center justify-center text-sky">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <strong className="block text-[0.95rem] font-semibold text-white mb-1">{t.trust.international}</strong>
            <p className="text-[0.8rem] text-white/50 leading-[1.5]">{t.trust.internationalDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
