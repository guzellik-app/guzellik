export const MOCK_CLINICS = [
  {
    id: 1,
    name: 'Aesthetic Plus Istanbul',
    slug: 'aesthetic-plus-istanbul',
    city: 'Istanbul',
    countryKey: 'turkey',
    rating: 4.9,
    reviews: 1247,
    procedures: ['rhinoplasty', 'hairTransplant', 'breastAugmentation'],
    price: 1800,
    image: 'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.aestheticplus.com',
    socialMedia: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Premium',
    badge: 'premium',
    services: ['Hotel Transfer', 'Translation', 'Post-op Care'],
    description: 'Aesthetic Plus Istanbul is a leading cosmetic surgery center located in the heart of Turkey. We specialize in providing top-tier aesthetic procedures with a focus on patient safety, comfort, and natural-looking results. Our state-of-the-art facility is equipped with the latest technology, and our team of internationally certified surgeons brings decades of combined experience.',
    comprehensiveFeatures: [
      'JCI Accredited Facility',
      'English, German, Arabic, and Russian speaking staff',
      'VIP Airport Transfers',
      '5-Star Hotel Accommodation included',
      '1 Year Post-Op Follow-up',
      'Free Initial Online Consultation',
      'Advanced 3D Modeling Before Surgery'
    ],
    contact: {
      phone: '+90 555 123 4567',
      email: 'contact@aestheticplus.com',
      address: 'Sisli, Istanbul, Turkey',
      hours: 'Mon-Sat: 09:00 - 18:00'
    }
  },
  {
    id: 2,
    name: 'Clínica Beauté Barcelona',
    slug: 'clinica-beaute-barcelona',
    city: 'Barcelona',
    countryKey: 'spain',
    rating: 4.8,
    reviews: 873,
    procedures: ['facelift', 'liposuction', 'dentalAesthetics'],
    price: 3200,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.beautebarcelona.es',
    socialMedia: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Standard',
    badge: 'topRated',
    services: ['Consultation', 'Post-op Care'],
    description: 'Located in beautiful Barcelona, Clínica Beauté offers a blend of Spanish hospitality and world-class medical expertise. We are renowned for our minimally invasive techniques and exceptional patient care.',
    comprehensiveFeatures: [
      'ISO 9001 Certified',
      'Multilingual Staff',
      'Central Location',
      'Personalized Recovery Plans'
    ],
    contact: {
      phone: '+34 93 123 4567',
      email: 'info@beautebarcelona.es',
      address: 'Eixample, Barcelona, Spain',
      hours: 'Mon-Fri: 10:00 - 19:00'
    }
  },
  {
    id: 3,
    name: 'Lumière Medical Clinik',
    slug: 'lumiere-medical-clinik',
    city: 'Bangkok',
    countryKey: 'thailand',
    rating: 4.7,
    reviews: 612,
    procedures: ['eyelidSurgery', 'rhinoplasty'],
    price: 1200,
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.lumieremedical.th',
    socialMedia: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Boutique',
    badge: 'new',
    services: ['Hotel Transfer', 'Consultation'],
    description: 'Lumière Medical Clinik in Bangkok provides cutting-edge aesthetic treatments in a serene, spa-like environment. Our focus is on precision and patient well-being.',
    comprehensiveFeatures: [
      'Board Certified Surgeons',
      'Luxury Recovery Suites',
      'Holistic Care Approach'
    ],
    contact: {
      phone: '+66 2 123 4567',
      email: 'hello@lumiereclinik.com',
      address: 'Sukhumvit, Bangkok, Thailand',
      hours: 'Mon-Sun: 09:00 - 20:00'
    }
  },
  {
    id: 4,
    name: 'Berlin Health & Beauty',
    slug: 'berlin-health-and-beauty',
    city: 'Berlin',
    countryKey: 'germany',
    rating: 4.9,
    reviews: 2104,
    procedures: ['breastAugmentation', 'liposuction'],
    price: 4500,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.berlinhealthbeauty.de',
    socialMedia: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Premium',
    badge: 'premium',
    services: ['Consultation', 'Post-op Care', 'Translation'],
    description: 'German engineering meets aesthetic perfection. Berlin Health & Beauty is a premium clinic offering the highest standards of medical care and precision.',
    comprehensiveFeatures: [
      'TÜV Certified',
      'Latest Medical Technology',
      'Private Chauffeur Service',
      'Dedicated Patient Coordinator'
    ],
    contact: {
      phone: '+49 30 1234 5678',
      email: 'kontakt@berlinhealthbeauty.de',
      address: 'Mitte, Berlin, Germany',
      hours: 'Mon-Fri: 08:00 - 18:00'
    }
  },
  {
    id: 5,
    name: 'Swiss Dental Excellence',
    slug: 'swiss-dental-excellence',
    city: 'Zurich',
    countryKey: 'switzerland',
    rating: 5.0,
    reviews: 432,
    procedures: ['dentalAesthetics'],
    price: 5500,
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.swissdentalexcellence.ch',
    socialMedia: {
      instagram: 'https://instagram.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Boutique',
    badge: 'topRated',
    services: ['Hotel Transfer', 'Translation', 'Consultation'],
    description: 'Uncompromising quality in dental aesthetics. Swiss Dental Excellence provides world-class smile makeovers using the finest materials and techniques.',
    comprehensiveFeatures: [
      'Swiss Quality Standards',
      'In-house Dental Lab',
      'Painless Treatment Protocols'
    ],
    contact: {
      phone: '+41 44 123 4567',
      email: 'smile@swissdental.ch',
      address: 'Bahnhofstrasse, Zurich, Switzerland',
      hours: 'Mon-Thu: 08:00 - 17:00'
    }
  },
  {
    id: 6,
    name: 'Antalya Hair Institute',
    slug: 'antalya-hair-institute',
    city: 'Antalya',
    countryKey: 'turkey',
    rating: 4.6,
    reviews: 3421,
    procedures: ['hairTransplant'],
    price: 1500,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1560243558-064d0ce98662?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.antalyahair.com',
    socialMedia: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Standard',
    badge: 'new',
    services: ['Hotel Transfer', 'Translation'],
    description: 'Specializing exclusively in hair restoration, the Antalya Hair Institute combines advanced FUE and DHI techniques with a relaxing Mediterranean recovery.',
    comprehensiveFeatures: [
      'Maximum Graft Guarantee',
      'PRP Therapy Included',
      'Seaside Hotel Stay',
      'Lifetime Warranty Certificate'
    ],
    contact: {
      phone: '+90 242 123 4567',
      email: 'info@antalyahair.com',
      address: 'Lara, Antalya, Turkey',
      hours: 'Mon-Sat: 09:00 - 19:00'
    }
  },
  {
    id: 7,
    name: 'Madrid Surgery Center',
    slug: 'madrid-surgery-center',
    city: 'Madrid',
    countryKey: 'spain',
    rating: 4.8,
    reviews: 945,
    procedures: ['rhinoplasty', 'breastAugmentation'],
    price: 3800,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80',
    logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=1600&h=400&q=80',
    website: 'www.madridsurgery.es',
    socialMedia: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com'
    },
    gallery: [
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    type: 'Premium',
    badge: 'premium',
    services: ['Consultation', 'Post-op Care', 'Translation'],
    description: 'A modern, fully-equipped surgical center in the heart of Madrid, offering a wide range of aesthetic and reconstructive procedures.',
    comprehensiveFeatures: [
      'Board Certified Plastic Surgeons',
      '24/7 Nursing Care',
      'Private Recovery Rooms'
    ],
    contact: {
      phone: '+34 91 123 4567',
      email: 'contact@madridsurgery.es',
      address: 'Salamanca, Madrid, Spain',
      hours: 'Mon-Fri: 09:00 - 20:00'
    }
  }
];
