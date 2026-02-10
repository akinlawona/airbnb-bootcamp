import { prisma } from "../src/lib/prisma";

const userId = "cmlesp2bs00006xeaki4xx45h";

const listings = [
  // ========== PARIS, FRANCE (6 listings) ==========
  {
    title: "Charming Apartment in Paris Le Marais",
    description:
      "Experience Parisian charm in this beautifully renovated apartment in the historic Marais district. Walking distance to the Louvre, Notre-Dame, and countless cafés and boutiques. High ceilings, original moldings, and French doors.",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    country_code: "FR",
    location: "Paris, France",
    lat: 48.8566,
    lng: 2.3522,
    price: 280,
    weekendPrice: 350,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 3,
    bathroomCount: 1.5,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Washer", "Heating", "Essentials"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        caption: "Parisian apartment exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        caption: "Elegant living space",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Cozy bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Modern bathroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
        caption: "Parisian street view",
        isCover: false,
      },
    ],
  },
  {
    title: "Luxury Studio near Eiffel Tower",
    description:
      "Stunning studio with direct views of the Eiffel Tower. Perfectly located in the 7th arrondissement, this modern space features premium amenities and elegant Parisian decor. Walk to world-class museums and restaurants.",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    country_code: "FR",
    location: "Paris, France",
    lat: 48.8584,
    lng: 2.2945,
    price: 320,
    weekendPrice: 400,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Washer", "Air conditioning", "TV"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800",
        caption: "Studio with Eiffel Tower view",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "Modern living area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        caption: "Comfortable bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
        caption: "Stylish kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=800",
        caption: "Luxurious bathroom",
        isCover: false,
      },
    ],
  },
  {
    title: "Classic Parisian Apartment in Montmartre",
    description:
      "Live like a local in the artistic Montmartre neighborhood. This classic apartment features original hardwood floors, a charming balcony, and is steps from Sacré-Cœur. Experience authentic Parisian culture.",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    country_code: "FR",
    location: "Paris, France",
    lat: 48.8867,
    lng: 2.3431,
    price: 250,
    weekendPrice: 310,
    guestCount: 3,
    bedroomCount: 1,
    bedCount: 2,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Heating", "Essentials"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
        caption: "Montmartre apartment exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
        caption: "Charming living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        caption: "Classic bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Cozy dining area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800",
        caption: "Parisian balcony",
        isCover: false,
      },
    ],
  },
  {
    title: "Modern Loft in Saint-Germain-des-Prés",
    description:
      "Contemporary loft in the heart of literary Paris. High ceilings, minimalist design, and surrounded by historic cafés and bookshops. Perfect for couples seeking an authentic Left Bank experience.",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    country_code: "FR",
    location: "Paris, France",
    lat: 48.8534,
    lng: 2.333,
    price: 310,
    weekendPrice: 380,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Air conditioning",
      "Dedicated workspace",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        caption: "Modern loft interior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        caption: "Spacious living area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Designer kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800",
        caption: "Minimalist bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800",
        caption: "Modern bathroom",
        isCover: false,
      },
    ],
  },
  {
    title: "Spacious Family Home in Latin Quarter",
    description:
      "Perfect for families! This three-bedroom apartment is near the Panthéon and Luxembourg Gardens. Bright, spacious, and equipped with everything needed for a comfortable family stay in Paris.",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    country_code: "FR",
    location: "Paris, France",
    lat: 48.8462,
    lng: 2.3372,
    price: 380,
    weekendPrice: 450,
    guestCount: 6,
    bedroomCount: 3,
    bedCount: 4,
    bathroomCount: 2,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Washer", "Heating", "Essentials", "TV"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
        caption: "Family apartment building",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        caption: "Large living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        caption: "Master bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800",
        caption: "Kids bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Full kitchen",
        isCover: false,
      },
    ],
  },
  {
    title: "Elegant Haussmann Apartment near Champs-Élysées",
    description:
      "Experience luxury Parisian living in this stunning Haussmann-style apartment. Original architectural details, marble fireplace, and steps from the Champs-Élysées. Truly exceptional.",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    country_code: "FR",
    location: "Paris, France",
    lat: 48.8698,
    lng: 2.3079,
    price: 450,
    weekendPrice: 550,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 2,
    bathroomCount: 2,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Air conditioning",
      "TV",
      "Heating",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        caption: "Haussmann building exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
        caption: "Elegant living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Luxurious bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
        caption: "Gourmet kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
        caption: "Marble bathroom",
        isCover: false,
      },
    ],
  },

  // ========== NEW YORK, USA (6 listings) ==========
  {
    title: "Modern Loft in Downtown Manhattan",
    description:
      "Sleek and stylish loft in the heart of NYC. Walking distance to Broadway, Times Square, and world-class dining. Floor-to-ceiling windows, exposed brick, and contemporary furnishings make this the perfect urban retreat.",
    city: "New York",
    state: "New York",
    country: "United States",
    country_code: "US",
    location: "New York, New York, United States",
    lat: 40.7128,
    lng: -74.006,
    price: 380,
    weekendPrice: 480,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "TV",
      "Kitchen",
      "Air conditioning",
      "Dedicated workspace",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        caption: "Modern loft interior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        caption: "Cozy bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        caption: "Living area with brick wall",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Modern kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
        caption: "City view from window",
        isCover: false,
      },
    ],
  },
  {
    title: "Brooklyn Brownstone with Garden",
    description:
      "Charming Brooklyn brownstone in trendy Williamsburg. Private garden, original details, and modern updates. Walk to cafes, shops, and the waterfront. Experience Brooklyn living at its finest.",
    city: "New York",
    state: "New York",
    country: "United States",
    country_code: "US",
    location: "New York, New York, United States",
    lat: 40.7081,
    lng: -73.9571,
    price: 420,
    weekendPrice: 520,
    guestCount: 6,
    bedroomCount: 3,
    bedCount: 4,
    bathroomCount: 2.5,
    categoryName: "House",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Free parking on premises",
      "Washer",
      "Patio",
      "BBQ grill",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        caption: "Brooklyn brownstone exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        caption: "Spacious living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        caption: "Master bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Full kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        caption: "Private garden",
        isCover: false,
      },
    ],
  },
  {
    title: "Luxury Penthouse in Upper East Side",
    description:
      "Experience Manhattan luxury in this stunning penthouse. Panoramic Central Park views, marble bathrooms, and chef's kitchen. Doorman building with top-tier amenities. Pure elegance.",
    city: "New York",
    state: "New York",
    country: "United States",
    country_code: "US",
    location: "New York, New York, United States",
    lat: 40.7736,
    lng: -73.9566,
    price: 650,
    weekendPrice: 800,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 2,
    bathroomCount: 2.5,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "TV",
      "Kitchen",
      "Washer",
      "Air conditioning",
      "Pool",
      "Gym",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        caption: "Luxury building exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
        caption: "Penthouse living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Luxurious master suite",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
        caption: "Gourmet kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
        caption: "Central Park view",
        isCover: false,
      },
    ],
  },
  {
    title: "Cozy Studio in Greenwich Village",
    description:
      "Perfect Village studio for solo travelers or couples. Located on a quiet tree-lined street, this charming space is steps from Washington Square Park and NYU. Authentic New York living.",
    city: "New York",
    state: "New York",
    country: "United States",
    country_code: "US",
    location: "New York, New York, United States",
    lat: 40.7308,
    lng: -74.002,
    price: 280,
    weekendPrice: 350,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Air conditioning", "TV", "Heating"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
        caption: "Village apartment building",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "Cozy studio interior",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        caption: "Comfortable bed area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
        caption: "Compact kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800",
        caption: "Charming details",
        isCover: false,
      },
    ],
  },
  {
    title: "SoHo Artist Loft with Natural Light",
    description:
      "Incredible artist loft in the heart of SoHo. Massive windows, 14-foot ceilings, and surrounded by art galleries and designer boutiques. Industrial chic meets modern comfort.",
    city: "New York",
    state: "New York",
    country: "United States",
    country_code: "US",
    location: "New York, New York, United States",
    lat: 40.7233,
    lng: -74.003,
    price: 480,
    weekendPrice: 580,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 2,
    bathroomCount: 2,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Air conditioning",
      "Dedicated workspace",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        caption: "SoHo loft living space",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Industrial kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800",
        caption: "Bright bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800",
        caption: "Modern bathroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
        caption: "SoHo street views",
        isCover: false,
      },
    ],
  },
  {
    title: "Midtown Apartment near Times Square",
    description:
      "Prime Midtown location! Walk to Broadway shows, Rockefeller Center, and shopping. Modern apartment with all amenities. Perfect for experiencing the energy of Manhattan.",
    city: "New York",
    state: "New York",
    country: "United States",
    country_code: "US",
    location: "New York, New York, United States",
    lat: 40.758,
    lng: -73.9855,
    price: 350,
    weekendPrice: 430,
    guestCount: 3,
    bedroomCount: 1,
    bedCount: 2,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "TV",
      "Kitchen",
      "Air conditioning",
      "Gym",
      "Elevator",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800",
        caption: "Midtown apartment exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "Modern living area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        caption: "Comfortable bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Equipped kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",
        caption: "Times Square proximity",
        isCover: false,
      },
    ],
  },

  // ========== TOKYO, JAPAN (6 listings) ==========
  {
    title: "Traditional Zen Ryokan in Kyoto",
    description:
      "Authentic Japanese ryokan experience near Fushimi Inari Shrine. Tatami rooms, futon bedding, private onsen bath, and traditional breakfast included. Immerse yourself in Japanese culture.",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    country_code: "JP",
    location: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    price: 220,
    weekendPrice: 280,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Ryokan",
    privacyTypeName: "A room",
    amenityNames: [
      "Wifi",
      "Air conditioning",
      "Heating",
      "Hot tub",
      "Essentials",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
        caption: "Traditional Japanese room",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        caption: "Tatami mat bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800",
        caption: "Japanese garden view",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        caption: "Private onsen bath",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
        caption: "Traditional breakfast setting",
        isCover: false,
      },
    ],
  },
  {
    title: "Modern Apartment in Shibuya",
    description:
      "Stylish apartment in the heart of Shibuya. Steps from the famous crossing, shopping, and nightlife. Perfect blend of traditional Tokyo charm and modern convenience.",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    country_code: "JP",
    location: "Tokyo, Japan",
    lat: 35.658,
    lng: 139.7016,
    price: 180,
    weekendPrice: 230,
    guestCount: 3,
    bedroomCount: 1,
    bedCount: 2,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Air conditioning",
      "Washer",
      "TV",
      "Elevator",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        caption: "Modern Tokyo apartment",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "Contemporary living space",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Cozy bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Modern kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
        caption: "Shibuya city view",
        isCover: false,
      },
    ],
  },
  {
    title: "Luxury High-Rise in Roppongi",
    description:
      "Stunning high-rise apartment with Tokyo Tower views. Premium building with concierge, gym, and rooftop terrace. Walking distance to museums, restaurants, and nightlife.",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    country_code: "JP",
    location: "Tokyo, Japan",
    lat: 35.6627,
    lng: 139.7298,
    price: 320,
    weekendPrice: 400,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 2,
    bathroomCount: 2,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Air conditioning",
      "Gym",
      "Pool",
      "Elevator",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        caption: "Luxury high-rise building",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
        caption: "Spacious living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        caption: "Master bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
        caption: "Designer kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
        caption: "Tokyo Tower view",
        isCover: false,
      },
    ],
  },
  {
    title: "Cozy Studio in Shinjuku",
    description:
      "Compact yet comfortable studio in bustling Shinjuku. Perfect for solo travelers. Near train stations, restaurants, and entertainment. Experience the vibrant energy of Tokyo.",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    country_code: "JP",
    location: "Tokyo, Japan",
    lat: 35.6938,
    lng: 139.7034,
    price: 150,
    weekendPrice: 190,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Air conditioning", "TV", "Heating"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
        caption: "Compact studio exterior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "Efficient studio layout",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        caption: "Comfortable sleeping area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
        caption: "Kitchenette",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800",
        caption: "Shinjuku street view",
        isCover: false,
      },
    ],
  },
  {
    title: "Spacious Family Home in Setagaya",
    description:
      "Perfect for families visiting Tokyo. Quiet residential neighborhood with easy train access to central Tokyo. Traditional Japanese home with modern amenities and private garden.",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    country_code: "JP",
    location: "Tokyo, Japan",
    lat: 35.6464,
    lng: 139.6531,
    price: 280,
    weekendPrice: 340,
    guestCount: 6,
    bedroomCount: 3,
    bedCount: 4,
    bathroomCount: 2,
    categoryName: "House",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Free parking on premises",
      "Washer",
      "Air conditioning",
      "Patio",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        caption: "Traditional Japanese house",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        caption: "Spacious living area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        caption: "Tatami bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Modern kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800",
        caption: "Private garden",
        isCover: false,
      },
    ],
  },
  {
    title: "Designer Apartment in Harajuku",
    description:
      "Trendy apartment in fashionable Harajuku. Minimalist Japanese design, surrounded by unique shops and cafes. Perfect for young travelers and fashion enthusiasts.",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    country_code: "JP",
    location: "Tokyo, Japan",
    lat: 35.6702,
    lng: 139.7025,
    price: 240,
    weekendPrice: 300,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Air conditioning",
      "Washer",
      "Dedicated workspace",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        caption: "Designer apartment interior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        caption: "Minimalist living space",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800",
        caption: "Modern bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Sleek kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800",
        caption: "Stylish bathroom",
        isCover: false,
      },
    ],
  },

  // ========== LONDON, UK (6 listings) ==========
  {
    title: "Charming Flat in Notting Hill",
    description:
      "Beautiful Victorian flat in the heart of Notting Hill. Walk to Portobello Market, Hyde Park, and charming cafes. High ceilings, original features, and modern comfort combined.",
    city: "London",
    state: "England",
    country: "United Kingdom",
    country_code: "GB",
    location: "London, United Kingdom",
    lat: 51.5074,
    lng: -0.1278,
    price: 320,
    weekendPrice: 400,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 2,
    bathroomCount: 1.5,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Washer", "Heating", "TV"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        caption: "Victorian flat interior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        caption: "Elegant living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Cozy bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Modern kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800",
        caption: "Notting Hill street",
        isCover: false,
      },
    ],
  },
  {
    title: "Modern Apartment in Shoreditch",
    description:
      "Hip Shoreditch apartment perfect for exploring East London. Surrounded by street art, trendy restaurants, and nightlife. Industrial chic design with all modern amenities.",
    city: "London",
    state: "England",
    country: "United Kingdom",
    country_code: "GB",
    location: "London, United Kingdom",
    lat: 51.5255,
    lng: -0.078,
    price: 280,
    weekendPrice: 350,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Heating",
      "Dedicated workspace",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        caption: "Industrial loft interior",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        caption: "Open plan kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        caption: "Stylish bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
        caption: "Modern bathroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
        caption: "Shoreditch streets",
        isCover: false,
      },
    ],
  },
  {
    title: "Luxury Penthouse in Mayfair",
    description:
      "Exceptional penthouse in prestigious Mayfair. Walking distance to Hyde Park, Bond Street shopping, and finest restaurants. Concierge service and rooftop terrace with city views.",
    city: "London",
    state: "England",
    country: "United Kingdom",
    country_code: "GB",
    location: "London, United Kingdom",
    lat: 51.5099,
    lng: -0.1435,
    price: 680,
    weekendPrice: 850,
    guestCount: 4,
    bedroomCount: 2,
    bedCount: 2,
    bathroomCount: 2.5,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Air conditioning",
      "Gym",
      "Elevator",
      "TV",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        caption: "Mayfair luxury building",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
        caption: "Penthouse living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Master bedroom suite",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
        caption: "Gourmet kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800",
        caption: "Rooftop terrace view",
        isCover: false,
      },
    ],
  },
  {
    title: "Cozy Studio in Covent Garden",
    description:
      "Perfect central London studio near theaters and shopping. Walk to Leicester Square, Soho, and the Thames. Compact but beautifully designed for maximum comfort.",
    city: "London",
    state: "England",
    country: "United Kingdom",
    country_code: "GB",
    location: "London, United Kingdom",
    lat: 51.5117,
    lng: -0.1235,
    price: 240,
    weekendPrice: 300,
    guestCount: 2,
    bedroomCount: 1,
    bedCount: 1,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: ["Wifi", "Kitchen", "Heating", "TV", "Elevator"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
        caption: "Covent Garden building",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "Compact studio space",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        caption: "Comfortable bed area",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
        caption: "Small kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800",
        caption: "Theater district view",
        isCover: false,
      },
    ],
  },
  {
    title: "Elegant Townhouse in Kensington",
    description:
      "Beautiful 3-bedroom townhouse in upscale Kensington. Perfect for families with easy access to museums, parks, and top schools. Garden, parking, and classic British charm.",
    city: "London",
    state: "England",
    country: "United Kingdom",
    country_code: "GB",
    location: "London, United Kingdom",
    lat: 51.4991,
    lng: -0.1938,
    price: 520,
    weekendPrice: 640,
    guestCount: 6,
    bedroomCount: 3,
    bedCount: 4,
    bathroomCount: 2.5,
    categoryName: "House",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Free parking on premises",
      "Heating",
      "Patio",
      "TV",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
        caption: "Kensington townhouse",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        caption: "Spacious living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
        caption: "Master bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        caption: "Full kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        caption: "Private garden",
        isCover: false,
      },
    ],
  },
  {
    title: "Riverside Apartment in South Bank",
    description:
      "Modern apartment with Thames River views. Walk to London Eye, Tate Modern, and Borough Market. Floor-to-ceiling windows and contemporary design.",
    city: "London",
    state: "England",
    country: "United Kingdom",
    country_code: "GB",
    location: "London, United Kingdom",
    lat: 51.5045,
    lng: -0.1087,
    price: 360,
    weekendPrice: 440,
    guestCount: 3,
    bedroomCount: 1,
    bedCount: 2,
    bathroomCount: 1,
    categoryName: "Apartment",
    privacyTypeName: "An Entire Place",
    amenityNames: [
      "Wifi",
      "Kitchen",
      "Washer",
      "Heating",
      "TV",
      "Gym",
      "Elevator",
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800",
        caption: "South Bank apartment",
        isCover: true,
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
        caption: "River view living room",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        caption: "Modern bedroom",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
        caption: "Contemporary kitchen",
        isCover: false,
      },
      {
        url: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",
        caption: "Thames River view",
        isCover: false,
      },
    ],
  },
];

async function seedListings() {
  console.log("🏠 Starting to seed listings...");

  // Get categories, privacy types, and amenities
  const categories = await prisma.category.findMany();
  const privacyTypes = await prisma.privacyType.findMany();
  const amenities = await prisma.amenity.findMany();

  // Create a map for quick lookup
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));
  const privacyTypeMap = new Map(privacyTypes.map((p) => [p.name, p.id]));
  const amenityMap = new Map(amenities.map((a) => [a.name, a.id]));

  let successCount = 0;
  let errorCount = 0;

  for (const listing of listings) {
    try {
      const categoryId = categoryMap.get(listing.categoryName);
      const privacyTypeId = privacyTypeMap.get(listing.privacyTypeName);
      const amenityIds = listing.amenityNames
        .map((name) => amenityMap.get(name))
        .filter((id): id is string => id !== undefined);

      if (!categoryId || !privacyTypeId) {
        console.warn(
          `⚠️  Skipping "${listing.title}" - missing category or privacy type`,
        );
        errorCount++;
        continue;
      }

      // Create the listing
      const createdListing = await prisma.listing.create({
        data: {
          title: listing.title,
          description: listing.description,
          city: listing.city,
          state: listing.state,
          country: listing.country,
          country_code: listing.country_code,
          location: listing.location,
          lat: listing.lat,
          lng: listing.lng,
          price: listing.price,
          weekendPrice: listing.weekendPrice,
          guestCount: listing.guestCount,
          bedroomCount: listing.bedroomCount,
          bedCount: listing.bedCount,
          bathroomCount: listing.bathroomCount,
          userId: userId,
          categoryId: categoryId,
          privacyTypeId: privacyTypeId,
          amenityIds: amenityIds,
          isPublished: true,
          isListed: true,
          step: "completed",
          amenities: {
            connect: amenityIds.map((id) => ({ id })),
          },
        },
      });

      // Create photos
      if (listing.photos && listing.photos.length > 0) {
        await Promise.all(
          listing.photos.map((photo, index) =>
            prisma.photo.create({
              data: {
                url: photo.url,
                caption: photo.caption,
                isCoverPicture: photo.isCover,
                order: index,
                listingId: createdListing.id,
                publicId: `seed_${createdListing.id}_${index}`,
                signature: `seed_signature_${index}`,
              },
            }),
          ),
        );
      }

      console.log(`✅ Created: ${listing.title} in ${listing.city}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create "${listing.title}":`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding complete!`);
  console.log(`✅ Successfully created: ${successCount} listings`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} listings`);
  }
}

async function main() {
  console.log("🚀 Starting listings seed...\n");

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error(
      `User with ID ${userId} not found. Please create the user first or update the userId in this seed file.`,
    );
  }

  console.log(`✅ Found user: ${user.email || user.name || "Unknown"}\n`);

  await seedListings();

  console.log("\n🎉 All done!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
