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
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ChevronRight, 
  Instagram,
  Facebook,
  Twitter,
  Heart,
  Plus,
  Settings,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

function ClinicProfileContent() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews' | 'contact'>('posts');

  const [clinic, setClinic] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    let authSubscription: any = null;

    const setupAuth = async () => {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      authSubscription = subscription;
    };

    setupAuth();

    const fetchClinicData = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        let query = supabase.from('clinic_settings').select('*');
        
        if (slug?.startsWith('clinic-')) {
          query = query.eq('id', slug.replace('clinic-', ''));
        } else {
          query = query.eq('username', slug);
        }
        
        const { data: clinicData, error: clinicError } = await query.single();
          
        if (clinicError) throw clinicError;
        
        if (clinicData) {
          // Fetch profile info separately since there's no direct FK
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_verified, is_active')
            .eq('id', clinicData.id)
            .single();
          
          setClinic({
            id: clinicData.id,
            name: clinicData.clinic_name || 'Unnamed Clinic',
            slug: clinicData.username,
            city: clinicData.city || 'Unknown',
            countryKey: 'turkey',
            rating: clinicData.rating || 5.0,
            reviews: clinicData.reviews || 0,
            image: clinicData.profile_picture || "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=600&h=400",
            logo: clinicData.profile_picture || "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=150&h=150",
            coverImage: clinicData.cover_image || "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=1200&h=400",
            website: clinicData.website || '',
            socialMedia: {},
            type: 'Premium',
            badge: 'premium',
            description: clinicData.description || 'No description provided.',
            isVerified: profile?.is_verified ?? false,
            isActive: profile?.is_active ?? true,
            contact: { 
              phone: clinicData.phone || '', 
              email: '', 
              address: clinicData.address || '', 
              hours: 'Mon-Sat: 09:00 - 18:00' 
            }
          });

          // Fetch services for this clinic
          const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .eq('clinic_id', clinicData.id)
            .order('created_at', { ascending: false });
            
          if (!servicesError && servicesData) {
            const mappedServices = servicesData.map((s: any) => ({
              id: `service-${s.id}`,
              name: s.name,
              slug: s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `service-${s.id}`,
              category: s.category,
              price: parseInt((s.price || '0').toString().replace(/[^0-9]/g, ''), 10) || 0,
              image: s.image || "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=600&h=400",
              procedures: [s.category ? (
                s.category === 'Breast Augmentation' ? 'breastAugmentation' :
                s.category === 'Hair Transplant' ? 'hairTransplant' :
                s.category === 'Dental Aesthetics' ? 'dentalAesthetics' :
                s.category === 'Eyelid Surgery' ? 'eyelidSurgery' :
                s.category.toLowerCase().replace(/\s+/g, '')
              ) : ''],
              badge: 'premium',
              type: 'Premium'
            }));
            setServices(mappedServices);
          }
        }
      } catch (err) {
        console.error('Error fetching clinic profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClinicData();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!clinic) {
    return <Navigate to={`/${lang === 'en' ? '' : lang + '/'}chatmt`} replace />;
  }

  if (!clinic.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onOpenModal={() => setIsModalOpen(true)} />
        <main className="flex-grow max-w-7xl mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-2">Profile Inactive</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              This profile has been deactivated by the administrator and is currently not visible to the public.
            </p>
            <Link to="/" className="inline-block mt-8 text-blue font-medium hover:underline">
              Return to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue/20 selection:text-navy flex flex-col">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pb-24">
        {/* Unified White Top Section */}
        <section className="bg-white border-b border-gray-100 pt-20 sm:pt-28 pb-6 sm:pb-8">
          <div className="max-w-[1200px] mx-auto px-[5vw]">
            <div className="flex flex-row gap-5 sm:gap-10 items-start mb-4 sm:mb-5">
              <div className="w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-2 md:border-4 border-white bg-white shadow-md">
                <img 
                  src={clinic.logo} 
                  alt={`${clinic.name} logo`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow min-w-0 pt-2 sm:pt-6">
                <div className="flex flex-col justify-between items-start gap-1 sm:gap-3 mb-5 sm:mb-6">
                  <div className="w-full">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="text-gray-900 font-bold text-[0.8rem] sm:text-[1rem] tracking-wider">@{clinic.slug}</div>
                      {clinic.isVerified && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0095f6] fill-[#0095f6] text-white shrink-0" />}
                    </div>
                    <h1 className="font-nunito text-2xl sm:text-4xl md:text-5xl font-medium text-navy mb-1.5 sm:mb-3 leading-[1.1] break-words tracking-tight">
                      {clinic.name}
                    </h1>
                    <div className="text-gray-500 text-[0.95rem] sm:text-[1.2rem] mb-4">{clinic.type}</div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-[0.85rem] sm:text-[1.1rem]">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="truncate text-gray-400">
                        {clinic.city}{clinic.countryKey !== 'turkey' ? `, ${t.hero.locations[clinic.countryKey as keyof typeof t.hero.locations]}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {clinic.socialMedia?.instagram && (
                    <a href={clinic.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue hover:text-white transition-all">
                      <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {clinic.socialMedia?.facebook && (
                    <a href={clinic.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue hover:text-white transition-all">
                      <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  )}
                  {clinic.socialMedia?.twitter && (
                    <a href={clinic.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue hover:text-white transition-all">
                      <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="max-w-2xl mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-serif font-medium text-navy mb-2 sm:mb-3">{t.clinicProfile.about}</h2>
              <p className="text-gray-600 leading-relaxed text-[0.9rem] sm:text-[1rem]">
                {clinic.description}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-[5vw]">
          {/* Tabs Navigation - Connected to content */}
          <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar border border-gray-100 mb-4 sm:mb-6 sticky top-[80px] z-10 shadow-sm transition-all duration-300">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                activeTab === 'posts' 
                ? 'bg-white text-blue shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-navy hover:bg-gray-100'
              }`}
            >
              {t.clinicProfile.posts}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                activeTab === 'reviews' 
                ? 'bg-white text-blue shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-navy hover:bg-gray-100'
              }`}
            >
              <Star className={`w-4 h-4 ${activeTab === 'reviews' ? 'fill-blue text-blue' : 'text-gray-400'}`} />
              <span>{clinic.rating}</span>
              <span className="opacity-60">({clinic.reviews})</span>
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`flex-[1.5] sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                activeTab === 'contact' 
                ? 'bg-white text-blue shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-navy hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="hidden sm:inline">{t.clinicProfile.contactLocation}</span>
            </button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'posts' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-8">
                  <div className="flex justify-end items-center gap-3 mb-6">
                    {user && (
                      <button 
                        onClick={() => {
                          const langPrefix = lang === 'en' ? '' : `/${lang}`;
                          navigate(`${langPrefix}/dashboard/settings`);
                        }}
                        className="flex items-center gap-2 bg-white text-navy border border-gray-200 px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:bg-gray-50 shadow-sm active:scale-95"
                      >
                        <Settings className="w-4 h-4" />
                        {t.clinicProfile.editProfile}
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (user) {
                          const langPrefix = lang === 'en' ? '' : `/${lang}`;
                          navigate(`${langPrefix}/dashboard/services/new`);
                        } else {
                          setIsModalOpen(true);
                        }
                      }}
                      className="flex items-center gap-2 bg-blue text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:bg-navy shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      {t.clinicProfile.newPost}
                    </button>
                  </div>
                  {services.length === 0 ? (
                    <p className="text-gray-500">{t.clinicProfile.noServices}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map(service => (
                        <Link 
                          key={service.id}
                          to={`/${lang === 'en' ? '' : lang + '/'}chatmt/${service.slug}`}
                          className="bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"
                        >
                          <div className="w-full h-[200px] relative shrink-0">
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-3.5 left-3.5 bg-gradient-to-br from-gold to-[#a8842c] text-white text-[0.68rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                              {t.clinics[service.badge as keyof typeof t.clinics] || service.type}
                            </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-[1.15rem] font-semibold text-navy mb-2 leading-tight">{service.name}</div>
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {service.procedures.map((proc: string) => (
                                  <span key={proc} className="text-[0.72rem] font-medium text-blue bg-light-blue rounded-full px-2.5 py-1">
                                    {t.hero.procedures[proc as keyof typeof t.hero.procedures] || proc}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                              <div>
                                {service.price > 0 && (
                                  <>
                                    <span className="text-[0.7rem] text-gray-400 block">{t.clinics.from}</span>
                                    <span className="text-[1.1rem] font-bold text-navy">{service.price.toLocaleString()} €</span>
                                  </>
                                )}
                              </div>
                              <div className="font-sans text-[0.82rem] font-semibold text-blue bg-light-blue border-none rounded-full px-5 py-2 cursor-pointer transition-colors hover:bg-blue hover:text-white">
                                {t.clinicProfile.viewDetails}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-navy mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">This clinic hasn't received any verified patient reviews yet. Be the first to share your experience!</p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-serif font-medium text-navy mb-8">
                      {t.clinicProfile.contactInfo}
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-blue" />
                        </div>
                        <div>
                          <div className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold mb-1">{t.clinicProfile.address}</div>
                          <div className="text-[1rem] text-navy font-medium leading-relaxed">{clinic.contact.address}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-blue" />
                        </div>
                        <div>
                          <div className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold mb-1">{t.clinicProfile.workingHours}</div>
                          <div className="text-[1rem] text-navy font-medium">{clinic.contact.hours}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-blue" />
                        </div>
                        <div>
                          <div className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold mb-1">Phone</div>
                          <div className="text-[1rem] text-navy font-medium">{clinic.contact.phone || 'Contact for details'}</div>
                        </div>
                      </div>

                      {clinic.website && (
                        <div className="flex items-start gap-4 pt-4 border-t border-gray-50 mt-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue/5 flex items-center justify-center shrink-0">
                            <Globe className="w-5 h-5 text-blue" />
                          </div>
                          <div>
                            <div className="text-[0.8rem] text-gray-400 uppercase tracking-wider font-bold mb-1">Website</div>
                            <a 
                              href={`https://${clinic.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[1rem] text-blue font-medium hover:underline break-all"
                            >
                              {clinic.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-3xl overflow-hidden min-h-[300px] flex items-center justify-center">
                    {/* Map Placeholder */}
                    <div className="text-center p-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <div className="text-gray-400 font-medium">Map for {clinic.city} placeholder</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav onOpenModal={() => setIsModalOpen(true)} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export function ClinicProfile({ lang }: { lang: Language }) {
  return (
    <I18nProvider lang={lang}>
      <ClinicProfileContent />
    </I18nProvider>
  );
}
