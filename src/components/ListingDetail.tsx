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
  ChevronDown,
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

  const fetchReviews = async () => {
    if (!clinic) return;
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('service_id', clinic.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist yet, we'll just keep empty reviews
        if (error.code === 'PGRST116' || error.message.includes('relation "reviews" does not exist')) {
          console.warn('Reviews table not found. Please create it in Supabase.');
          return;
        }
        throw error;
      }
      if (data) setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

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
        const { data: clinicsData, error: clinicsError } = await supabase.from('clinic_settings').select('id, username, city, profile_picture');
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
            logo: clinicInfo.profile_picture || s.image,
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

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : (clinic?.rating || 0);
  
  const totalReviews = reviews.length > 0 ? reviews.length : (clinic?.reviews || 0);

  React.useEffect(() => {
    if (!loading && clinic) {
      fetchReviews();
    }
  }, [loading, clinic?.id]);

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
          
          {/* Image Gallery */}
          <div className="mb-6">
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

          {/* Info Bar (Location, Type, Reviews) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.85rem] text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue" />
              <span>{clinic.city}{clinic.countryKey !== 'turkey' ? `, ${t.hero.locations[clinic.countryKey as keyof typeof t.hero.locations]}` : ''}</span>
            </div>

            <div className="w-px h-3 bg-gray-300 hidden sm:block"></div>

            <span className="bg-blue/10 text-blue text-[0.7rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md">
              {clinic.type}
            </span>

            <div className="w-px h-3 bg-gray-300 hidden sm:block"></div>

            <button 
              onClick={() => {
                setIsReviewsExpanded(true);
                setTimeout(() => {
                  document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center gap-1 text-gold font-semibold hover:opacity-80 transition-opacity"
            >
              <Star className="w-3.5 h-3.5 fill-gold" />
              {averageRating.toFixed(1)} ({totalReviews} {t.listingDetail.reviews})
            </button>
          </div>

          {/* Divider Line */}
          <div className="h-px bg-gray-200 w-full mb-8"></div>

          {/* Title and Price Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div className="flex flex-col gap-4">
              <h1 className="font-robot text-4xl md:text-5xl font-medium text-navy">
                {clinic.name}
              </h1>
              {/* Procedures on mobile */}
              <div className="flex flex-wrap gap-2 md:hidden">
                {clinic.procedures.map((proc, idx) => (
                  <div key={idx} className="px-3 py-1 bg-blue/5 text-blue rounded-full text-[0.75rem] font-medium">
                    {t.hero.procedures[proc as keyof typeof t.hero.procedures] || proc}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6 self-end md:self-auto w-full md:w-auto">
              {/* Procedures on desktop (left of price) */}
              <div className="hidden md:flex flex-wrap gap-2">
                {clinic.procedures.map((proc, idx) => (
                  <div key={idx} className="px-3 py-1 bg-blue/5 text-blue rounded-full text-[0.75rem] font-medium">
                    {t.hero.procedures[proc as keyof typeof t.hero.procedures] || proc}
                  </div>
                ))}
              </div>

              {clinic.price > 0 && (
                <div className="flex flex-col items-end">
                  <div className="text-[0.8rem] text-gray-500 mb-1">{t.listingDetail.startingFrom}</div>
                  <div className="text-3xl font-bold text-navy">€{clinic.price.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* About */}
              <section>
                <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                  {clinic.description}
                </p>
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

          {/* Reviews Section */}
          <section id="reviews-section" className="mt-16 pt-16 border-t border-gray-200">
            <button 
              onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
              className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left hover:opacity-80 transition-opacity group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-serif font-medium text-navy">{t.listingDetail.reviews}</h2>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isReviewsExpanded ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex items-center gap-2 text-gold">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-gold' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-lg">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">({totalReviews} {t.listingDetail.reviews})</span>
                </div>
              </div>
              
              <div className="hidden md:block">
                <span className="text-blue font-medium flex items-center gap-2">
                  {isReviewsExpanded ? 'Hide Reviews' : 'Show All Reviews'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isReviewsExpanded ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </button>

            {isReviewsExpanded && (
              <div className="animate-fade-down">
                {/* Google Maps Style Rate & Review Prompt */}
                {!isReviewFormOpen && (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue/5 flex items-center justify-center mb-4">
                      <Star className="w-8 h-8 text-blue" />
                    </div>
                    <h3 className="text-xl font-serif font-medium text-navy mb-2">Rate and review</h3>
                    <p className="text-gray-500 text-sm mb-6">Share your experience to help others</p>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            if (!sessionUser) {
                              alert('Please sign in to write a review');
                              return;
                            }
                            setReviewRating(star);
                            setIsReviewFormOpen(true);
                            setTimeout(() => {
                              document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star 
                            className={`w-10 h-10 transition-colors ${
                              star <= (hoverRating || 0) 
                                ? 'fill-gold text-gold' 
                                : 'text-gray-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <div id="review-form" className={`${isReviewFormOpen ? 'block' : 'hidden'} mb-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-lg animate-fade-down`}>
                  <h3 className="text-xl font-serif font-medium text-navy mb-6">Share your experience</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!sessionUser) return;
                    
                    setIsSubmittingReview(true);
                    const form = e.target as HTMLFormElement;
                    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;
                    
                    try {
                      const { supabase } = await import('../lib/supabase');
                      const { error } = await supabase.from('reviews').insert({
                        service_id: clinic.id,
                        user_id: sessionUser.id,
                        user_name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Anonymous',
                        rating: reviewRating,
                        comment,
                        created_at: new Date().toISOString()
                      });
                      
                      if (error) throw error;
                      
                      alert('Review submitted successfully!');
                      form.reset();
                      setIsReviewFormOpen(false);
                      fetchReviews();
                    } catch (err: any) {
                      alert(`Error submitting review: ${err.message}`);
                    } finally {
                      setIsSubmittingReview(false);
                    }
                  }}>
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star 
                              className={`w-8 h-8 transition-colors ${
                                star <= (hoverRating || reviewRating) 
                                  ? 'fill-gold text-gold' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="ml-4 text-sm font-medium text-gray-500">
                          {reviewRating === 5 ? 'Excellent' : 
                           reviewRating === 4 ? 'Very Good' : 
                           reviewRating === 3 ? 'Good' : 
                           reviewRating === 2 ? 'Fair' : 'Poor'}
                        </span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                      <textarea name="comment" required rows={4} placeholder="Tell us about your experience..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none"></textarea>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsReviewFormOpen(false)}
                        className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="bg-navy text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue transition-colors disabled:opacity-50"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-500">
                      {clinic.reviews > 0 ? (
                        <div className="space-y-4">
                          <p>Loading real reviews...</p>
                          {/* Fallback to mock reviews if real ones aren't loaded yet but count > 0 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                            {[1, 2].map((i) => (
                              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold">
                                    {i === 1 ? 'JD' : 'AS'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-navy">{i === 1 ? 'John Doe' : 'Anna Smith'}</div>
                                    <div className="text-xs text-gray-400">Sample Review</div>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm italic">
                                  "{i === 1 ? 'Exceptional service and very professional staff.' : 'The results exceeded my expectations.'}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : 'No reviews yet for this service. Be the first to write one!'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold">
                              {review.user_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-navy">{review.user_name}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(review.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className="ml-auto flex text-gold">
                              {[...Array(5)].map((_, starIdx) => (
                                <Star key={starIdx} className={`w-3 h-3 ${starIdx < review.rating ? 'fill-gold' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm italic">
                            "{review.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
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
