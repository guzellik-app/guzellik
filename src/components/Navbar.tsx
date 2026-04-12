import React, { useEffect, useState } from 'react';
import { Search, MapPin, CreditCard, CheckCircle, MessageSquare, Globe, Heart, Star, X, ArrowRight, ChevronDown, Menu, User } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { useNavigation } from '../NavigationContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Navbar({ onOpenModal }: { onOpenModal: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const { t, lang: language } = useI18n();
  const { toggleMenu } = useNavigation();
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
        console.error('Error checking session:', err);
      }
    };
    checkSession();

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
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
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[60px] transition-shadow duration-300 ${scrolled ? 'shadow-md bg-white/90 backdrop-blur-md border-b border-sky/30' : 'bg-white/85 backdrop-blur-md border-b border-sky/30'}`}>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMenu}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100/50 transition-colors text-navy"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to={getHomePath()} className="flex items-center gap-2.5 font-sans text-[1.2rem] font-semibold tracking-tight text-navy no-underline">
          <span dangerouslySetInnerHTML={{ __html: t.brand.nameHtml }}></span>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        {sessionUser ? (
          <button onClick={() => navigate(`${getHomePath() === '/' ? '' : getHomePath()}/dashboard`)} className="font-sans text-[0.8rem] font-semibold bg-gradient-to-br from-blue to-blue-dark text-white border-none cursor-pointer px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(45,107,228,0.35)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(45,107,228,0.45)]">
            <span className="hidden sm:inline">Dashboard</span>
            <User className="w-5 h-5 sm:hidden" />
          </button>
        ) : (
          <button onClick={onOpenModal} className="font-sans text-[0.8rem] font-semibold bg-gradient-to-br from-blue to-blue-dark text-white border-none cursor-pointer px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(45,107,228,0.35)] transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(45,107,228,0.45)]">
            <span className="hidden sm:inline">Log in / Sign up</span>
            <User className="w-5 h-5 sm:hidden" />
          </button>
        )}
      </div>
    </nav>
  );
}
