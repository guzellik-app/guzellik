import React, { useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { BottomNav } from './BottomNav';
import { I18nProvider, useI18n } from '../I18nContext';
import { Language } from '../i18n';
import { MOCK_CLINICS } from '../data/clinics';
import { 
  MapPin, 
  Star, 
  CheckCircle, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';

function ListingDetailContent() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [sessionUser, setSessionUser] = useState<any>(null);

  const [allClinics, setAllClinics] = useState<any[]>(MOCK_CLINICS);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase.from('services').select('*');
        if (servicesError) throw servicesError;
        
        // Fetch clinic settings to get the username, city
        const { data: clinicsData, error: clinicsError } = await supabase.from('clinic_settings').select('id, username, city');
        if (clinicsError) throw clinicsError;
        
        const clinicMap = new Map(clinicsData?.map(c => [c.id, c]) || []);
        
        if (servicesData) {
          const mappedServices = servicesData.map((s: any) => {
            const clinicInfo = (clinicMap.get(s.clinic_id) || {}) as any;
            return {
            id: `service-${s.id}`,
            name: s.name,
            slug: s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `service-${s.id}`,
            clinicSlug: clinicInfo.username || `clinic-${s.clinic_id}`,
            clinic_id: s.clinic_id,
            city: clinicInfo.city || 'Unknown',
            countryKey: 'turkey',
            rating: 5.0,
            reviews: 0,
            procedures: [s.category ? (
              s.category === 'Breast Augmentation' ? 'breastAugmentation' :
              s.category === 'Hair Transplant' ? 'hairTransplant' :
              s.category === 'Dental Aesthetics' ? 'dentalAesthetics' :
              s.category === 'Eyelid Surgery' ? 'eyelidSurgery' :
              s.category.toLowerCase().replace(/\s+/g, '')
            ) : ''],
            price: parseInt((s.price || '0').toString().replace(/[^0-9]/g, ''), 10) || 0,
            image: s.image || "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=600&h=400",
            logo: s.image,
            coverImage: s.image,
            website: '',
            socialMedia: {},
            gallery: [s.image],
            type: 'Premium',
            badge: 'premium',
            services: s.included ? Object.entries(s.included).filter(([_, v]) => v).map(([k]) => k) : (s.features ? s.features.split(', ') : []),
            description: s.description,
            comprehensiveFeatures: s.features ? s.features.split(', ') : [],
            contact: { phone: '', email: '', address: clinicInfo.address || '', hours: '' }
          };
        });
          setAllClinics([...mappedServices, ...MOCK_CLINICS]);
        }
      } catch (err) {
        console.error('Error fetching services for listing detail:', err);
        try {
          const savedServices = JSON.parse(localStorage.getItem('clinic_services') || '[]');
          const mappedServices = savedServices.map((s: any) => ({
            id: `service-${s.id}`,
            name: s.name,
            slug: s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `service-${s.id}`,
            clinicSlug: s.clinicSlug || `clinic-${s.clinic_id}`,
            city: s.countryCity ? s.countryCity.split(',')[0].trim() : 'Unknown',
            countryKey: 'turkey',
            rating: 5.0,
            reviews: 0,
            procedures: [s.category ? (
              s.category === 'Breast Augmentation' ? 'breastAugmentation' :
              s.category === 'Hair Transplant' ? 'hairTransplant' :
              s.category === 'Dental Aesthetics' ? 'dentalAesthetics' :
              s.category === 'Eyelid Surgery' ? 'eyelidSurgery' :
              s.category.toLowerCase().replace(/\s+/g, '')
            ) : ''],
            price: parseInt((s.offerPrice || s.regularPrice || '0').toString().replace(/[^0-9]/g, ''), 10) || 0,
            image: s.image || "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=600&h=400",
            logo: s.image,
            coverImage: s.image,
            website: '',
            socialMedia: {},
            gallery: [s.image],
            type: 'Premium',
            badge: 'premium',
            services: Object.entries(s.included || {}).filter(([_, v]) => v).map(([k]) => k),
            description: s.description,
            comprehensiveFeatures: s.features ? s.features.split(', ') : [],
            contact: { phone: '', email: '', address: s.countryCity, hours: '' }
          }));
          setAllClinics([...mappedServices, ...MOCK_CLINICS]);
        } catch (e) {
          setAllClinics(MOCK_CLINICS);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const clinic = allClinics.find(c => c.slug === slug);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!clinic) {
    return <Navigate to={`/${lang === 'en' ? '' : lang + '/'}chatmt`} replace />;
  }

  return (
    <div className="min-h-screen bg-off-white font-sans selection:bg-blue/20 selection:text-navy flex flex-col">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-[80px] pb-24">
        <div className="max-w-[1200px] mx-auto px-[5vw]">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[0.8rem] text-gray-500 mb-6">
            <Link to={`/${lang === 'en' ? '' : lang + '/'}chatmt`} className="hover:text-blue transition-colors">
              {t.listingDetail.search}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-navy font-medium">{clinic.name}</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue/10 text-blue text-[0.7rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                  {clinic.type}
                </span>
                <div className="flex items-center gap-1 text-gold bg-gold/10 px-2 py-1 rounded-full text-[0.75rem] font-semibold">
                  <Star className="w-3.5 h-3.5 fill-gold" />
                  {clinic.rating} ({clinic.reviews} {t.listingDetail.reviews})
                </div>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-navy mb-3">
                {clinic.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-[0.9rem]">
                <MapPin className="w-4 h-4" />
                {clinic.city}, {t.hero.locations[clinic.countryKey as keyof typeof t.hero.locations]}
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <div className="text-[0.8rem] text-gray-500 mb-1">{t.listingDetail.startingFrom}</div>
              <div className="text-3xl font-bold text-navy mb-4">€{clinic.price.toLocaleString()}</div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
              <div className="md:col-span-3 h-full rounded-3xl overflow-hidden relative group">
                <img 
                  src={clinic.gallery[activeImage]} 
                  alt={clinic.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden md:flex flex-col gap-4 h-full">
                {clinic.gallery.slice(0, 3).map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative h-full rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue' : 'border-transparent hover:border-blue/50'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${clinic.name} thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {activeImage !== idx && <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors"></div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* About */}
              <section>
                <h2 className="text-2xl font-serif font-medium text-navy mb-4">{t.listingDetail.aboutClinic}</h2>
                <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                  {clinic.description}
                </p>
              </section>

              {/* Procedures */}
              <section>
                <h2 className="text-2xl font-serif font-medium text-navy mb-4">{t.listingDetail.availableProcedures}</h2>
                <div className="flex flex-wrap gap-3">
                  {clinic.procedures.map((proc, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-[0.9rem] font-medium text-navy shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue"></div>
                      {t.hero.procedures[proc as keyof typeof t.hero.procedures] || proc}
                    </div>
                  ))}
                </div>
              </section>

              {/* Comprehensive Features */}
              <section>
                <h2 className="text-2xl font-serif font-medium text-navy mb-6">{t.listingDetail.clinicFeatures}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clinic.comprehensiveFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-[0.95rem]">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Included Services */}
              <section>
                <h2 className="text-2xl font-serif font-medium text-navy mb-6">{t.listingDetail.includedInPackages}</h2>
                <div className="flex flex-wrap gap-4">
                  {clinic.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-[0.9rem]">{service}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-[120px] space-y-6">
                
                {/* Contact Form */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                  <h3 className="text-lg font-serif font-medium text-navy mb-6 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue" />
                    {t.listingDetail.contactClinic}
                  </h3>
                  
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                      const originalText = submitBtn.textContent;
                      submitBtn.textContent = t.listingDetail.sending;
                      submitBtn.disabled = true;
                      
                      try {
                        const { supabase } = await import('../lib/supabase');
                        const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
                        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                        
                        let currentUser = sessionUser;
                        
                        if (!currentUser) {
                          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                          const password = (form.elements.namedItem('password') as HTMLInputElement).value;
                          
                          // Try sign in
                          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email,
                            password
                          });
                          
                          if (signInError) {
                            // Try sign up
                            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                              email,
                              password,
                              options: {
                                data: {
                                  role: 'patient',
                                  full_name: fullName
                                }
                              }
                            });
                            if (signUpError) throw new Error(signUpError.message);
                            currentUser = signUpData.user;
                          } else {
                            currentUser = signInData.user;
                          }
                        }

                        if (!currentUser) throw new Error("Authentication failed");

                        // Insert request
                        const { error: requestError } = await supabase.from('requests').insert({
                          patient_id: currentUser.id,
                          clinic_id: clinic.clinic_id || null,
                          service_id: clinic.id,
                          service_name: clinic.name,
                          service_link: window.location.href,
                          full_name: fullName,
                          phone: phone,
                          message: message
                        });

                        if (requestError) throw requestError;
                        
                        alert(t.listingDetail.requestSuccess);
                        form.reset();
                        navigate(`/${lang === 'en' ? '' : lang + '/'}dashboard/requests`);
                      } catch (err: any) {
                        alert(`Error: ${err.message}`);
                      } finally {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                      }
                    }} 
                    className="space-y-4"
                  >
                    {!sessionUser && (
                      <>
                        <div>
                          <input type="email" name="email" required placeholder={t.listingDetail.emailPlaceholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                        </div>
                        <div>
                          <input type="password" name="password" required placeholder={t.listingDetail.passwordPlaceholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                        </div>
                      </>
                    )}
                    <div>
                      <input type="text" name="fullName" required placeholder={t.listingDetail.fullNamePlaceholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                    </div>
                    <div>
                      <input type="tel" name="phone" required placeholder={t.listingDetail.phonePlaceholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                    </div>
                    <div>
                      <textarea name="message" required defaultValue={t.listingDetail.messageDefault} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none"></textarea>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg break-all">
                      {t.listingDetail.serviceLink} {window.location.href}
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full bg-navy text-white px-6 py-3.5 rounded-xl font-medium text-[0.95rem] hover:bg-blue transition-colors shadow-md"
                    >
                      {t.listingDetail.contactClinic}
                    </button>
                    <Link 
                      to={`/${lang === 'en' ? '' : lang + '/'}mt/${clinic.clinicSlug || clinic.slug}`}
                      className="block w-full bg-light-blue text-blue px-6 py-3.5 rounded-xl font-medium text-[0.95rem] hover:bg-blue hover:text-white transition-colors text-center mt-3"
                    >
                      {t.listingDetail.viewFullProfile}
                    </Link>
                  </form>
                </div>

                {/* Trust Card */}
                <div className="bg-gradient-to-br from-light-blue to-sky rounded-3xl p-6 border border-blue/10">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-blue" />
                    <h3 className="font-serif font-medium text-navy text-lg">{t.listingDetail.clinikGuarantee}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-[0.85rem] text-navy/80">
                      <CheckCircle className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                      {t.listingDetail.guarantee1}
                    </li>
                    <li className="flex items-start gap-2 text-[0.85rem] text-navy/80">
                      <CheckCircle className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                      {t.listingDetail.guarantee2}
                    </li>
                    <li className="flex items-start gap-2 text-[0.85rem] text-navy/80">
                      <CheckCircle className="w-4 h-4 text-blue shrink-0 mt-0.5" />
                      {t.listingDetail.guarantee3}
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <BottomNav onOpenModal={() => setIsModalOpen(true)} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export function ListingDetail({ lang }: { lang: Language }) {
  return (
    <I18nProvider lang={lang}>
      <ListingDetailContent />
    </I18nProvider>
  );
}
