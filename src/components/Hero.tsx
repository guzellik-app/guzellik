import React, { useState } from 'react';
import { Search, MapPin, CreditCard, CheckCircle, Star, ChevronDown } from 'lucide-react';
import { useI18n } from '../I18nContext';

export function Hero({ onSearch }: { onSearch: (searchParams: { procedure: string, location: string, budget: string }) => void }) {
  const { t } = useI18n();
  const [procedure, setProcedure] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearchClick = () => {
    onSearch({ procedure, location, budget });
  };

  return (
    <section className="min-h-screen flex items-center px-[5vw] pt-[100px] pb-[60px] relative overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(200,222,255,0.45)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(201,168,76,0.08)_0%,transparent_60%),var(--color-white)]">
      {/* Background blobs */}
      <div className="absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(200,222,255,0.5)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.07)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-light-blue border border-blue/20 rounded-full px-4 py-1.5 mb-7 text-[0.78rem] font-semibold text-blue tracking-wider uppercase animate-fade-up">
            <div className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse-custom"></div>
            {t.hero.badge}
          </div>
          <h1 className="font-serif text-[clamp(2.4rem,4vw,3.8rem)] font-medium leading-[1.15] text-navy mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {t.hero.title}<em className="italic text-blue">{t.hero.titleHighlight}</em>
          </h1>
          <p className="text-[1.05rem] text-gray-600 leading-[1.7] mb-10 max-w-[480px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {t.hero.subtitle}
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-lg animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-[0.72rem] font-semibold text-gray-400 tracking-wider uppercase mb-2">{t.hero.searchLabel}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue w-4 h-4 pointer-events-none" />
                <select 
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="w-full py-3 pr-3.5 pl-9 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.88rem] text-text bg-off-white outline-none transition-all appearance-none focus:border-blue focus:shadow-[0_0_0_3px_rgba(45,107,228,0.12)] focus:bg-white"
                >
                  <option value="">{t.hero.procedurePlaceholder}</option>
                  <option value="rhinoplasty">{t.hero.procedures.rhinoplasty}</option>
                  <option value="breastAugmentation">{t.hero.procedures.breastAugmentation}</option>
                  <option value="hairTransplant">{t.hero.procedures.hairTransplant}</option>
                  <option value="facelift">{t.hero.procedures.facelift}</option>
                  <option value="liposuction">{t.hero.procedures.liposuction}</option>
                  <option value="dentalAesthetics">{t.hero.procedures.dentalAesthetics}</option>
                  <option value="eyelidSurgery">{t.hero.procedures.eyelidSurgery}</option>
                </select>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue w-4 h-4 pointer-events-none" />
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-3 pr-3.5 pl-9 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.88rem] text-text bg-off-white outline-none transition-all appearance-none focus:border-blue focus:shadow-[0_0_0_3px_rgba(45,107,228,0.12)] focus:bg-white"
                >
                  <option value="">{t.hero.locationPlaceholder}</option>
                  <option value="turkey">{t.hero.locations.turkey}</option>
                  <option value="spain">{t.hero.locations.spain}</option>
                  <option value="germany">{t.hero.locations.germany}</option>
                  <option value="thailand">{t.hero.locations.thailand}</option>
                  <option value="switzerland">{t.hero.locations.switzerland}</option>
                  <option value="austria">{t.hero.locations.austria}</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue w-4 h-4 pointer-events-none" />
                <select 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full py-3 pr-3.5 pl-9 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.88rem] text-text bg-off-white outline-none transition-all appearance-none focus:border-blue focus:shadow-[0_0_0_3px_rgba(45,107,228,0.12)] focus:bg-white"
                >
                  <option value="">{t.hero.budgetPlaceholder}</option>
                  <option value="b1">{t.hero.budgets.b1}</option>
                  <option value="b2">{t.hero.budgets.b2}</option>
                  <option value="b3">{t.hero.budgets.b3}</option>
                  <option value="b4">{t.hero.budgets.b4}</option>
                </select>
              </div>
            </div>
            <button onClick={handleSearchClick} className="w-full py-3.5 bg-gradient-to-br from-blue to-blue-dark text-white border-none rounded-md font-sans text-[0.95rem] font-semibold cursor-pointer tracking-wide shadow-[0_6px_20px_rgba(45,107,228,0.4)] transition-all flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_10px_28px_rgba(45,107,228,0.5)]">
              <Search className="w-4 h-4" />
              {t.hero.searchBtn}
            </button>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-5 sm:gap-8 mt-9 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div>
              <div className="font-serif text-3xl font-semibold text-navy leading-none">2.8<span className="text-blue">K+</span></div>
              <div className="text-[0.78rem] text-gray-400 font-medium mt-1">{t.hero.stats.clinics}</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-semibold text-navy leading-none">48<span className="text-blue">K+</span></div>
              <div className="text-[0.78rem] text-gray-400 font-medium mt-1">{t.hero.stats.reviews}</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-semibold text-navy leading-none">120<span className="text-blue">+</span></div>
              <div className="text-[0.78rem] text-gray-400 font-medium mt-1">{t.hero.stats.countries}</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative animate-fade-right w-[70%] ml-auto mr-4" style={{ animationDelay: '0.2s' }}>
          <div 
            className="overflow-hidden shadow-2xl aspect-square relative group border-[8px] border-white bg-white"
            style={{ borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%' }}
          >
            <img 
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" 
              alt="Beauty Clinic" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent opacity-60"></div>
          </div>
          <div className="absolute bottom-[20px] left-[-40px] animate-float">
            <div className="bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-light-blue flex items-center justify-center text-blue">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-[0.8rem]">
                <strong className="block font-semibold text-navy">{t.hero.verified}</strong>
                <span className="text-gray-400 text-[0.72rem]">{t.hero.certified}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-[40px] right-[-30px] animate-float" style={{ animationDelay: '2s' }}>
            <div className="bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Star className="w-5 h-5 fill-gold" />
              </div>
              <div className="text-[0.8rem]">
                <strong className="block font-semibold text-navy">4.9 / 5.0</strong>
                <span className="text-gray-400 text-[0.72rem]">{t.hero.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
