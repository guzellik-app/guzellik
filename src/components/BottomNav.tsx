import React from 'react';
import { Home, Search, Menu, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../I18nContext';
import { useNavigation } from '../NavigationContext';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function BottomNav({ onOpenModal }: { onOpenModal?: () => void }) {
  const { t, lang } = useI18n();
  const { isMenuOpen, setIsMenuOpen } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = React.useState<any>(null);

  React.useEffect(() => {
    let isMounted = true;
    let subscription: any = null;

    const checkSession = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        if (!isMounted) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setSessionUser(session?.user || null);
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (isMounted) {
            setSessionUser(session?.user || null);
          }
        });
        subscription = authListener.subscription;
      } catch (err) {
        console.error('Error checking session in BottomNav:', err);
      }
    };
    checkSession();

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const getHomePath = () => {
    if (lang === 'en') return '/';
    return `/${lang}`;
  };

  const getSearchPath = () => {
    if (lang === 'en') return '/chatmt';
    return `/${lang}/chatmt`;
  };

  const handleLanguageChange = (newLang: string) => {
    setIsMenuOpen(false);
    
    // Determine the base path without the language prefix
    let currentPath = location.pathname;
    if (currentPath.startsWith('/de/')) currentPath = currentPath.replace('/de/', '/');
    else if (currentPath === '/de') currentPath = '/';
    else if (currentPath.startsWith('/tr/')) currentPath = currentPath.replace('/tr/', '/');
    else if (currentPath === '/tr') currentPath = '/';

    if (newLang === 'en') {
      navigate(currentPath);
    } else {
      navigate(`/${newLang}${currentPath === '/' ? '' : currentPath}`);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'tr', name: 'Türkçe' }
  ];

  const isActive = (path: string) => {
    if (path === '/' || path === '/de' || path === '/tr') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: t.nav.clinics, href: `${getHomePath()}#clinics` },
    { name: t.nav.howItWorks, href: `${getHomePath()}#how` },
    { name: t.nav.results, href: `${getHomePath()}#results` },
    { name: t.nav.reviews, href: `${getHomePath()}#reviews` },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-1/2 lg:w-[40%] max-w-2xl">
      <div className="bg-white/85 backdrop-blur-xl border-2 border-blue-300 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-full p-1 flex items-center justify-around">
        <Link 
          to={getHomePath()} 
          className={`flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${isActive(getHomePath()) ? 'text-blue bg-blue/10' : 'text-gray-500 active:scale-95 hover:bg-gray-100/50'}`}
        >
          <Home className={`w-6 h-6 ${isActive(getHomePath()) ? 'fill-blue/20' : ''}`} />
        </Link>

        <Link 
          to={getSearchPath()} 
          className={`flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${isActive(getSearchPath()) ? 'text-blue bg-blue/10' : 'text-gray-500 active:scale-95 hover:bg-gray-100/50'}`}
        >
          <Search className={`w-6 h-6 ${isActive(getSearchPath()) ? 'fill-blue/20' : ''}`} />
        </Link>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger
            render={
              <button className="flex items-center justify-center p-1.5 rounded-full text-gray-500 active:scale-95 hover:bg-gray-100/50 transition-all outline-none">
                <Menu className="w-6 h-6" />
              </button>
            }
          />
          <SheetContent side="left" className="w-[300px] border-r-0 rounded-r-3xl top-[60px] bottom-[100px] h-auto">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full gap-8 mt-20 px-2">
              <div className="flex flex-col gap-1">
                {sessionUser ? (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`${getHomePath() === '/' ? '' : getHomePath()}/dashboard`);
                    }}
                    className="w-fit mx-auto font-sans text-[0.9rem] font-semibold bg-gradient-to-br from-blue to-blue-dark text-white border-none cursor-pointer px-8 py-3 rounded-full shadow-[0_4px_16px_rgba(45,107,228,0.35)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(45,107,228,0.45)] mb-4 text-center"
                  >
                    Dashboard
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenModal?.();
                    }}
                    className="w-fit mx-auto font-sans text-[0.9rem] font-semibold bg-gradient-to-br from-blue to-blue-dark text-white border-none cursor-pointer px-8 py-3 rounded-full shadow-[0_4px_16px_rgba(45,107,228,0.35)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(45,107,228,0.45)] mb-4 text-center"
                  >
                    Log in / Sign up
                  </button>
                )}
                <div className="h-px bg-gray-100 mb-2 mx-4"></div>
                {navLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-lg font-semibold text-gray-700 no-underline py-3 px-4 rounded-xl hover:bg-gray-50 hover:text-blue transition-all"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-auto pb-6">
                <div className="px-4 mb-4">
                  <p className="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400 mb-3">Language</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLanguageChange(l.code)}
                        className={`px-4 py-2 rounded-full text-[0.85rem] font-semibold transition-all ${lang === l.code ? 'bg-blue text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-4">
                  <p className="text-xs text-gray-400 font-medium">{t.brand.copyright}</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
