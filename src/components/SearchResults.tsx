import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { BottomNav } from './BottomNav';
import { I18nProvider, useI18n } from '../I18nContext';
import { Language } from '../i18n';
import { Search, MapPin, CreditCard, Heart, Star, Filter, ChevronDown, X } from 'lucide-react';
import { MOCK_CLINICS } from '../data/clinics';

const MOCK_CLINICS_REMOVED = true;

function SearchResultsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const [searchProcedure, setSearchProcedure] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const procedure = params.get('procedure');
    const location = params.get('location');
    const budget = params.get('budget');
    if (procedure) setSearchProcedure(procedure);
    if (location) {
      setSearchLocation(location);
    } else {
      // Try to detect location if not provided in URL
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.city) {
            setSearchLocation(data.city);
          }
        })
        .catch(err => console.error('Error detecting location:', err));
    }
    if (budget) setSearchBudget(budget);
  }, []);

  const [filterRatings, setFilterRatings] = useState<number[]>([]);
  const [filterServices, setFilterServices] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [allClinics, setAllClinics] = useState<any[]>(MOCK_CLINICS);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
            const clinicInfo = (clinicMap.get(s.clinic_id) || {}) as any;
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
          const sortedServices = [...mappedServices, ...MOCK_CLINICS].sort((a: any, b: any) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          setAllClinics(sortedServices);
        }
      } catch (err) {
        console.error('Error fetching services for search:', err);
        // Fallback to local storage if Supabase fails
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

  const filteredClinics = useMemo(() => {
    return allClinics.filter(c => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (searchProcedure && !c.procedures.includes(searchProcedure)) return false;
      if (searchLocation && !c.city.toLowerCase().includes(searchLocation.toLowerCase()) && !c.countryKey.toLowerCase().includes(searchLocation.toLowerCase())) return false;
      if (searchBudget) {
        if (searchBudget === 'b1' && c.price >= 2000) return false;
        if (searchBudget === 'b2' && (c.price < 2000 || c.price > 4000)) return false;
        if (searchBudget === 'b3' && (c.price < 4000 || c.price > 6000)) return false;
        if (searchBudget === 'b4' && c.price <= 6000) return false;
      }
      if (filterRatings.length > 0) {
        const minRating = Math.min(...filterRatings);
        if (c.rating < minRating) return false;
      }
      if (filterServices.length > 0) {
        if (!filterServices.every(s => c.services.includes(s))) return false;
      }
      if (filterTypes.length > 0) {
        if (!filterTypes.includes(c.type)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      return b.reviews - a.reviews; // recommended
    });
  }, [searchProcedure, searchLocation, searchBudget, filterRatings, filterServices, filterTypes, sortBy, allClinics]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchProcedure, searchLocation, searchBudget, filterRatings, filterServices, filterTypes, sortBy]);

  // Calculate paginated clinics
  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const paginatedClinics = filteredClinics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRatingToggle = (rating: number) => {
    setFilterRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const handleServiceToggle = (service: string) => {
    setFilterServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleTypeToggle = (type: string) => {
    setFilterTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-text bg-off-white">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-[60px] pb-24">
        {/* Sticky Search Box */}
        <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 shadow-sm py-4 px-[5vw]">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8">
            <div className="hidden md:block w-[280px] shrink-0" />
            <div className="flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue w-4 h-4 pointer-events-none" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder || "Search clinics or services..."}
                  className="w-full py-2.5 pr-3.5 pl-10 border-[1.5px] border-gray-200 rounded-md font-sans text-[0.88rem] text-text bg-off-white outline-none transition-all focus:border-blue focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-[5vw] py-8 flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Drawer Backdrop */}
          {isFilterDrawerOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-[45] md:hidden"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
          )}

          {/* Filters Sidebar / Drawer */}
          <aside className={`
            fixed inset-y-0 left-0 z-[46] w-[280px] bg-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto md:bg-transparent
            ${isFilterDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
            md:block shrink-0
          `}
          style={{ 
            top: isFilterDrawerOpen ? '0' : 'auto',
            bottom: isFilterDrawerOpen ? '0' : 'auto',
            height: isFilterDrawerOpen ? '100vh' : 'auto',
            paddingTop: isFilterDrawerOpen ? '60px' : '0',
            paddingBottom: isFilterDrawerOpen ? '100px' : '0'
          }}>
            <div className="h-full bg-white border-r border-gray-200 md:border md:rounded-xl p-5 shadow-sm overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 font-semibold text-navy">
                  <Filter className="w-4 h-4 text-blue" />
                  {t.searchResults.filters}
                </div>
                <button 
                  className="md:hidden text-gray-400 hover:text-navy"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Location Search Filter */}
              <div className="mb-6">
                <h4 className="text-[0.85rem] font-semibold text-gray-800 mb-3">Location</h4>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  <input 
                    type="text"
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                    placeholder="Search city or country..."
                    className="w-full py-2 pr-3 pl-8 border border-gray-200 rounded-md font-sans text-[0.82rem] text-text bg-off-white outline-none focus:border-blue focus:bg-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-[0.85rem] font-semibold text-gray-800 mb-3">Category</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  <select 
                    value={searchProcedure} 
                    onChange={e => setSearchProcedure(e.target.value)}
                    className="w-full py-2 pr-3 pl-8 border border-gray-200 rounded-md font-sans text-[0.82rem] text-text bg-off-white outline-none appearance-none focus:border-blue focus:bg-white"
                  >
                    <option value="">All Categories</option>
                    <option value="rhinoplasty">{t.hero.procedures.rhinoplasty}</option>
                    <option value="breastAugmentation">{t.hero.procedures.breastAugmentation}</option>
                    <option value="hairTransplant">{t.hero.procedures.hairTransplant}</option>
                    <option value="facelift">{t.hero.procedures.facelift}</option>
                    <option value="liposuction">{t.hero.procedures.liposuction}</option>
                    <option value="dentalAesthetics">{t.hero.procedures.dentalAesthetics}</option>
                    <option value="eyelidSurgery">{t.hero.procedures.eyelidSurgery}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Budget Filter */}
              <div className="mb-6">
                <h4 className="text-[0.85rem] font-semibold text-gray-800 mb-3">Budget</h4>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  <select 
                    value={searchBudget}
                    onChange={e => setSearchBudget(e.target.value)}
                    className="w-full py-2 pr-3 pl-8 border border-gray-200 rounded-md font-sans text-[0.82rem] text-text bg-off-white outline-none appearance-none focus:border-blue focus:bg-white"
                  >
                    <option value="">Any Budget</option>
                    <option value="b1">{t.hero.budgets.b1}</option>
                    <option value="b2">{t.hero.budgets.b2}</option>
                    <option value="b3">{t.hero.budgets.b3}</option>
                    <option value="b4">{t.hero.budgets.b4}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-[0.85rem] font-semibold text-gray-800 mb-3">{t.searchResults.rating}</h4>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filterRatings.includes(rating)}
                        onChange={() => handleRatingToggle(rating)}
                        className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue" 
                      />
                      <div className="flex items-center gap-1 text-[0.85rem] text-gray-600">
                        <div className="flex text-gold">
                          {[...Array(rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold" />)}
                        </div>
                        {t.searchResults.andUp}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-[0.85rem] font-semibold text-gray-800 mb-3">{t.searchResults.servicesIncluded}</h4>
                <div className="flex flex-col gap-2">
                  {['Hotel Transfer', 'Translation', 'Post-op Care', 'Consultation'].map(service => (
                    <label key={service} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filterServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue" 
                      />
                      <span className="text-[0.85rem] text-gray-600">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[0.85rem] font-semibold text-gray-800 mb-3">{t.searchResults.clinicType}</h4>
                <div className="flex flex-col gap-2">
                  {['Premium', 'Standard', 'Boutique'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filterTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue" 
                      />
                      <span className="text-[0.85rem] text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-navy hidden sm:block">
                {filteredClinics.length} {t.searchResults.clinicsFound}
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none py-2 px-3 border border-gray-200 rounded-md text-[0.85rem] text-gray-600 bg-white outline-none shadow-sm"
                >
                  <option value="latest">{t.searchResults.latest}</option>
                  <option value="recommended">{t.searchResults.recommended}</option>
                  <option value="price-low">{t.searchResults.priceLowToHigh}</option>
                  <option value="price-high">{t.searchResults.priceHighToLow}</option>
                  <option value="rating">{t.searchResults.highestRated}</option>
                </select>
                <button 
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="md:hidden flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-md text-[0.85rem] font-medium text-navy shadow-sm"
                >
                  <Filter className="w-4 h-4 text-blue" />
                  Filters
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {paginatedClinics.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-navy mb-2">{t.searchResults.noClinicsFound}</h3>
                  <p className="text-gray-500 text-[0.9rem]">{t.searchResults.tryAdjusting}</p>
                </div>
              ) : (
                <>
                  {paginatedClinics.map(clinic => (
                    <div 
                      key={clinic.id} 
                      className="bg-white rounded-2xl overflow-hidden border border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-row relative group h-[3.6cm] md:h-[5cm] lg:h-[5.8cm]"
                    >
                      <Link 
                        to={`/${lang === 'en' ? '' : lang + '/'}chatmt/${clinic.slug}`}
                        className="absolute inset-0 z-0"
                      />
                      <div className="w-[110px] md:w-[160px] lg:w-[220px] h-full relative shrink-0">
                        <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-gradient-to-br from-gold to-[#a8842c] text-white text-[0.55rem] sm:text-[0.65rem] font-semibold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
                          {t.clinics[clinic.badge as keyof typeof t.clinics] || clinic.type}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-none cursor-pointer flex items-center justify-center shadow-sm transition-transform hover:scale-110 text-gray-400 hover:text-red-500 z-10 relative"
                        >
                          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                      <div className="p-3 md:p-5 lg:p-6 flex-1 flex flex-col justify-between relative z-10 pointer-events-none">
                        <div>
                          <div className="text-[1rem] md:text-[1.2rem] lg:text-[1.35rem] font-semibold text-navy mb-1 md:mb-2 line-clamp-1">{clinic.name}</div>
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="flex text-gold">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(clinic.rating) ? 'fill-gold' : 'fill-gray-200 text-gray-200'}`} />
                              ))}
                            </div>
                            <div className="text-[0.8rem] md:text-[0.9rem] font-semibold text-gray-800">{clinic.rating.toFixed(1)}</div>
                            <div className="text-[0.75rem] md:text-[0.85rem] text-gray-400">({clinic.reviews.toLocaleString()})</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-gray-100 mt-2 pointer-events-auto">
                          <div className="text-[0.7rem] md:text-[0.85rem] text-gray-400 font-medium flex items-center gap-1 sm:gap-1.5">
                            <MapPin className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> 
                            <span className="line-clamp-1">{clinic.city}, {t.hero.locations[clinic.countryKey as keyof typeof t.hero.locations]}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[1rem] md:text-[1.2rem] lg:text-[1.4rem] font-bold text-navy">{clinic.price.toLocaleString()} €</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-md border border-gray-200 text-[0.85rem] font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        {t.searchResults.previous}
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-[0.85rem] font-medium transition-colors ${
                              currentPage === i + 1 
                                ? 'bg-blue text-white border border-blue' 
                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-md border border-gray-200 text-[0.85rem] font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        {t.searchResults.next}
                      </button>
                    </div>
                  )}
                </>
              )}
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

export function SearchResults({ lang }: { lang: Language }) {
  return (
    <I18nProvider lang={lang}>
      <SearchResultsContent />
    </I18nProvider>
  );
}
