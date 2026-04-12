import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Modal } from './Modal';
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
  Heart
} from 'lucide-react';

function ClinicProfileContent() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [clinic, setClinic] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        
        // Fetch clinic profile by username (slug) or by ID if it's a fallback
        let query = supabase.from('clinic_settings').select('*');
        
        if (slug?.startsWith('clinic-')) {
          query = query.eq('id', slug.replace('clinic-', ''));
        } else {
          query = query.eq('username', slug);
        }
        
        const { data: clinicData, error: clinicError } = await query.single();
          
        if (clinicError) throw clinicError;
        
        if (clinicData) {
          setClinic({
            id: clinicData.id,
            name: clinicData.clinic_name || 'Unnamed Clinic',
            slug: clinicData.username,
            city: clinicData.city || 'Unknown',
            countryKey: 'turkey',
            rating: 5.0,
            reviews: 0,
            image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=600&h=400",
            logo: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=150&h=150",
            coverImage: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=1200&h=400",
            website: clinicData.website || '',
            socialMedia: {},
            type: 'Premium',
            badge: 'premium',
            description: clinicData.description || 'No description provided.',
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
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!clinic) {
    return <Navigate to={`/${lang === 'en' ? '' : lang + '/'}chatmt`} replace />;
  }

  return (
    <div className="min-h-screen bg-off-white font-sans selection:bg-blue/20 selection:text-navy flex flex-col">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pb-20">
        {/* Cover Image */}
        <div className="w-full h-[300px] md:h-[400px] relative pt-[100px]">
          <div className="absolute inset-0">
            <img 
              src={clinic.coverImage} 
              alt={`${clinic.name} cover`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
          </div>
          
          <div className="max-w-[1200px] mx-auto px-[5vw] relative z-10 h-full flex flex-col">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[0.8rem] text-white/80 mt-6">
              <Link to={`/${lang === 'en' ? '' : lang + '/'}chatmt`} className="hover:text-white transition-colors">
                {t.clinicProfile.search}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">{clinic.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-[5vw] relative -mt-24">
          
          {/* Header Section with Logo */}
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-start relative z-10 mb-12">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
              <img 
                src={clinic.logo} 
                alt={`${clinic.name} logo`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl font-medium text-navy mb-2">
                    {clinic.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 text-[0.9rem]">
                    <MapPin className="w-4 h-4" />
                    {clinic.city}, {t.hero.locations[clinic.countryKey as keyof typeof t.hero.locations]}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-gold/10 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-gold text-gold" />
                  <span className="text-gold font-bold text-lg">{clinic.rating}</span>
                  <span className="text-gold/80 text-sm">({clinic.reviews} {t.clinicProfile.reviews})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                {clinic.website && (
                  <a href={`https://${clinic.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue hover:text-navy transition-colors text-[0.9rem] font-medium">
                    <Globe className="w-4 h-4" />
                    {clinic.website}
                  </a>
                )}
                <div className="flex items-center gap-3">
                  {clinic.socialMedia?.instagram && (
                    <a href={clinic.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue hover:text-white transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {clinic.socialMedia?.facebook && (
                    <a href={clinic.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue hover:text-white transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {clinic.socialMedia?.twitter && (
                    <a href={clinic.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue hover:text-white transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Explanation */}
              <section>
                <h2 className="text-2xl font-serif font-medium text-navy mb-4">{t.clinicProfile.aboutClinic}</h2>
                <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                  {clinic.description}
                </p>
              </section>

              {/* Their Listings Below */}
              <section>
                <h2 className="text-2xl font-serif font-medium text-navy mb-6">{t.clinicProfile.clinicListings}</h2>
                {services.length === 0 ? (
                  <p className="text-gray-500">{t.clinicProfile.noServices}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => (
                      <Link 
                        key={service.id}
                        to={`/${lang === 'en' ? '' : lang + '/'}chatmt/${service.slug}`}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg flex flex-col block"
                      >
                        <div className="w-full h-[200px] relative shrink-0">
                          <img src={service.image} alt={service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute top-3.5 left-3.5 bg-gradient-to-br from-gold to-[#a8842c] text-white text-[0.68rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                            {t.clinics[service.badge as keyof typeof t.clinics] || service.type}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[1.15rem] font-semibold text-navy mb-2">{service.name}</div>
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
                              <span className="text-[0.7rem] text-gray-400 block">{t.clinics.from}</span>
                              <span className="text-[1.1rem] font-bold text-navy">{service.price.toLocaleString()} €</span>
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
              </section>

            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-[120px] space-y-6">
                
                {/* Contact Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                  <h3 className="text-lg font-serif font-medium text-navy mb-6">
                    {t.clinicProfile.contactInfo}
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue/5 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-blue" />
                      </div>
                      <div>
                        <div className="text-[0.75rem] text-gray-400 uppercase tracking-wider font-semibold mb-1">{t.clinicProfile.address}</div>
                        <div className="text-[0.9rem] text-navy font-medium">{clinic.contact.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue/5 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-blue" />
                      </div>
                      <div>
                        <div className="text-[0.75rem] text-gray-400 uppercase tracking-wider font-semibold mb-1">{t.clinicProfile.workingHours}</div>
                        <div className="text-[0.9rem] text-navy font-medium">{clinic.contact.hours}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
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
