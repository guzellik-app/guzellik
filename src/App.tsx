/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Clinics } from './components/Clinics';
import { HowItWorks } from './components/HowItWorks';
import { BeforeAfter } from './components/BeforeAfter';
import { Reviews } from './components/Reviews';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { I18nProvider } from './I18nContext';
import { Language, translations } from './i18n';
import { useNavigate } from 'react-router-dom';

export default function App({ lang }: { lang: Language }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [lang]);

  const handleSearch = (searchParams?: { procedure: string, location: string, budget: string }) => {
    const queryParams = searchParams ? `?procedure=${encodeURIComponent(searchParams.procedure)}&location=${encodeURIComponent(searchParams.location)}&budget=${encodeURIComponent(searchParams.budget)}` : '';
    if (lang === 'en') {
      navigate(`/chatmt${queryParams}`);
    } else {
      navigate(`/${lang}/chatmt${queryParams}`);
    }
  };

  return (
    <I18nProvider lang={lang}>
      <div className="min-h-screen flex flex-col font-sans text-text bg-white">
        <Navbar onOpenModal={() => setIsModalOpen(true)} />
        
        <main className="flex-grow">
          <Hero onSearch={handleSearch} />
          <TrustBar />
          <Clinics onOpenModal={() => setIsModalOpen(true)} />
          <HowItWorks />
          <BeforeAfter />
          <Reviews />
          <CTA onOpenModal={() => setIsModalOpen(true)} />
        </main>

        <Footer />
        
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </I18nProvider>
  );
}

