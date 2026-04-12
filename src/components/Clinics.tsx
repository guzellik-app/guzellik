import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { useI18n } from '../I18nContext';
import { MOCK_CLINICS } from '../data/clinics';

export function Clinics({ onOpenModal }: { onOpenModal: () => void }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  
  const [allClinics, setAllClinics] = React.useState<any[]>(MOCK_CLINICS);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });
        if (servicesError) throw servicesError;
        
        // Fetch clinic settings to get the username, city
        const { data: clinicsData, error: clinicsError } = await supabase.from('clinic_settings').select('id, username, city');
        if (clinicsError) throw clinicsError;
        
        const clinicMap = new Map(clinicsData?.map(c => [c.id, c]) || []);
        
        if (servicesData) {
          const mappedServices = servicesData.map((s: any) => {
            const clinicInfo = clinicMap.get(s.clinic_id) || {};
            return {
            id: `service-${s.id}`,
            name: s.name,
            slug: s.name ? s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `service-${s.id}`,
            clinicSlug: clinicInfo.username || `clinic-${s.clinic_id}`,
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
            contact: { phone: '', email: '', address: clinicInfo.address || '', hours: '' },
            created_at: s.created_at
          };
        });
          
          // Sort by latest
          const sortedServices = [...mappedServices, ...MOCK_CLINICS].sort((a: any, b: any) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          
          setAllClinics(sortedServices);
        }
      } catch (err) {
        console.error('Error fetching services for clinics:', err);
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
            contact: { phone: '', email: '', address: s.countryCity, hours: '' },
            created_at: s.created_at || new Date().toISOString()
          }));
          
          // Sort by latest
          const sortedServices = [...mappedServices, ...MOCK_CLINICS].sort((a: any, b: any) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          
          setAllClinics(sortedServices);
        } catch (e) {
          setAllClinics(MOCK_CLINICS);
        }
      }
    };
    
    fetchServices();
  }, []);

  const displayClinics = allClinics.slice(0, 3);

  return (
    <section id="clinics" className="bg-off-white px-[5vw] py-[100px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-blue mb-3 before:content-[''] before:w-5 before:h-0.5 before:bg-gold before:rounded-sm">
            {t.clinics.badge}
          </div>
          <h2 className="font-serif text-[clamp(2rem,3vw,3rem)] font-medium text-navy mb-4 leading-[1.2] whitespace-pre-line">
            {t.clinics.title}
          </h2>
          <p className="text-[1rem] text-gray-600 max-w-[520px] leading-[1.7]">
            {t.clinics.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClinics.map((clinic, index) => (
            <div 
              key={clinic.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg reveal relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link 
                to={`/${lang === 'en' ? '' : lang + '/'}chatmt/${clinic.slug}`}
                className="absolute inset-0 z-0"
              />
              <div className="w-full h-[200px] relative">
                <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className={`absolute top-3.5 left-3.5 text-white text-[0.68rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${clinic.badge === 'premium' ? 'bg-gradient-to-br from-gold to-[#a8842c]' : clinic.badge === 'topRated' ? 'bg-navy' : 'bg-blue'}`}>
                  {t.clinics[clinic.badge as keyof typeof t.clinics] || clinic.type}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border-none cursor-pointer flex items-center justify-center shadow-sm transition-transform hover:scale-110 text-gray-400 hover:text-red-500 z-10 relative"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 flex flex-col h-[calc(100%-200px)] relative z-10 pointer-events-none">
                <div className="text-[0.75rem] text-gray-400 font-medium mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {clinic.city}, {t.hero.locations[clinic.countryKey as keyof typeof t.hero.locations]}
                </div>
                <div className="text-[1.05rem] font-semibold text-navy mb-2">{clinic.name}</div>
                <div className="flex items-center gap-1.5 mb-3.5">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(clinic.rating) ? 'fill-gold' : 'fill-gray-200 text-gray-200'}`} />
                    ))}
                  </div>
                  <div className="text-[0.82rem] font-semibold text-gray-800">{clinic.rating.toFixed(1)}</div>
                  <div className="text-[0.78rem] text-gray-400">({clinic.reviews.toLocaleString()} {t.clinics.reviews})</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {clinic.procedures.slice(0, 3).map(proc => (
                    <span key={proc} className="text-[0.72rem] font-medium text-blue bg-light-blue rounded-full px-2.5 py-1">
                      {t.hero.procedures[proc as keyof typeof t.hero.procedures]}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto pointer-events-auto">
                  <div>
                    <span className="text-[0.7rem] text-gray-400 block">{t.clinics.from}</span>
                    <span className="text-[1.1rem] font-bold text-navy">{clinic.price.toLocaleString()} €</span>
                  </div>
                  <Link 
                    to={`/${lang === 'en' ? '' : lang + '/'}mt/${clinic.clinicSlug || clinic.slug}`}
                    className="font-sans text-[0.82rem] font-semibold text-blue bg-light-blue border-none rounded-full px-4 py-2 cursor-pointer transition-colors hover:bg-blue hover:text-white relative z-10"
                  >
                    {t.clinics.viewProfile}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
