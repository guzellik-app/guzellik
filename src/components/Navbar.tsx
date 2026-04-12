import React, { useEffect, useState } from 'react';
import { Search, MapPin, CreditCard, CheckCircle, MessageSquare, Globe, Heart, Star, X, ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Navbar({ onOpenModal }: { onOpenModal: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const { t, lang: language } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        setSessionUser(session?.user || null);
        
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          setSessionUser(session?.user || null);
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };
    checkSession();
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLangOpen(false);
    
    // Determine the base path without the language prefix
    let currentPath = location.pathname;
    if (currentPath.startsWith('/de/')) currentPath = currentPath.replace('/de/', '/');
    else if (currentPath === '/de') currentPath = '/';
    else if (currentPath.startsWith('/tr/')) currentPath = currentPath.replace('/tr/', '/');
    else if (currentPath === '/tr') currentPath = '/';

    if (lang === 'en') {
      navigate(currentPath);
    } else {
      navigate(`/${lang}${currentPath === '/' ? '' : currentPath}`);
    }
  };

  const getHomePath = () => {
    if (language === 'en') return '/';
    return `/${language}`;
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'tr', name: 'Türkçe' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[72px] transition-shadow duration-300 ${scrolled ? 'shadow-md bg-white/90 backdrop-blur-md border-b border-sky/30' : 'bg-white/85 backdrop-blur-md border-b border-sky/30'}`}>
      <div className="flex items-center gap-3">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger className="sm:hidden p-1 -ml-1 bg-transparent border-none cursor-pointer text-navy">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-8 mt-6">
              <Link to={getHomePath()} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 font-serif text-[1.55rem] font-semibold tracking-wide text-navy no-underline">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gold to-blue"></div>
                <span dangerouslySetInnerHTML={{ __html: t.brand.nameHtml }}></span>
              </Link>
              <div className="flex flex-col gap-6">
                <a href={`${getHomePath()}#clinics`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.clinics}</a>
                <a href={`${getHomePath()}#how`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.howItWorks}</a>
                <a href={`${getHomePath()}#results`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.results}</a>
                <a href={`${getHomePath()}#reviews`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.reviews}</a>
                <Link to={`${getHomePath() === '/' ? '' : getHomePath()}/dashboard`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-blue no-underline transition-colors hover:text-blue-dark">Dashboard</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link to={getHomePath()} className="flex items-center gap-2.5 font-serif text-[1.55rem] font-semibold tracking-wide text-navy no-underline">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-gold to-blue"></div>
          <span dangerouslySetInnerHTML={{ __html: t.brand.nameHtml }}></span>
        </Link>
      </div>
      <ul className="hidden sm:flex gap-8 list-none">
        <li><a href={`${getHomePath()}#clinics`} className="text-[0.9rem] font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.clinics}</a></li>
        <li><a href={`${getHomePath()}#how`} className="text-[0.9rem] font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.howItWorks}</a></li>
        <li><a href={`${getHomePath()}#results`} className="text-[0.9rem] font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.results}</a></li>
        <li><a href={`${getHomePath()}#reviews`} className="text-[0.9rem] font-medium text-gray-600 no-underline transition-colors hover:text-blue">{t.nav.reviews}</a></li>
        <li><Link to={`${getHomePath() === '/' ? '' : getHomePath()}/dashboard`} className="text-[0.9rem] font-medium text-blue no-underline transition-colors hover:text-blue-dark">Dashboard</Link></li>
      </ul>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 font-sans text-[0.85rem] font-medium text-gray-600 bg-transparent border-none cursor-pointer px-3 py-2 rounded-full transition-colors hover:bg-gray-100"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{language}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {langOpen && (
            <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  className={`w-full text-left px-4 py-2 text-[0.85rem] transition-colors hover:bg-gray-50 border-none cursor-pointer ${language === l.code ? 'font-semibold text-blue bg-light-blue/30' : 'text-gray-600 bg-transparent'}`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {sessionUser ? (
          <button onClick={() => navigate(`${getHomePath() === '/' ? '' : getHomePath()}/dashboard`)} className="font-sans text-[0.85rem] font-semibold bg-gradient-to-br from-blue to-blue-dark text-white border-none cursor-pointer px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(45,107,228,0.35)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(45,107,228,0.45)]">Dashboard</button>
        ) : (
          <button onClick={onOpenModal} className="font-sans text-[0.85rem] font-semibold bg-gradient-to-br from-blue to-blue-dark text-white border-none cursor-pointer px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(45,107,228,0.35)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(45,107,228,0.45)]">{t.nav.loginRegister}</button>
        )}
      </div>
    </nav>
  );
}
