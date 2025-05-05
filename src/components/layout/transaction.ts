// translations.ts
export const translations = {
    en: {
        // Navbar
        home: "Home",
        dashboard: "Dashboard",
        signUp: "Sign Up",
        login: "Log In",
        profile: "Profile",
        settings: "Settings",
        logout: "Log Out",
        darkModeToggle: "Switch to dark mode",
        lightModeToggle: "Switch to light mode",

        // Existing translations
        welcome: "Welcome to EventEase",
        getStarted: "Get Started",
        upcomingEvents: "Upcoming Events",

        // Hero Section
        "hero.title": "Discover Amazing Events Near You",
        "hero.description": "Find and attend events that match your interests, connect with like-minded people, and create lasting memories.",
        "hero.exploreButton": "Explore Events",

        // Featured Event Section
        "featured.badge": "Featured Event",
        "featured.attendees": "{count} people attending",
        "featured.viewDetails": "View Details",

        // Events Section
        "events.title": "Upcoming Events",
        "events.subtitle": "Discover and book your next experience",
        "events.viewAll": "View All Events",
        "events.noResults": "No events found matching your criteria.",

        // CTA Section
        "cta.title": "Ready to Create Your Own Event?",
        "cta.description": "Share your passion, build a community, and create unforgettable experiences.",
        "cta.button": "Get Started",

        // Search Component
        "search.placeholder": "Search events...",
        "search.location": "Location",
        "search.date": "Date",
        "search.button": "Search",

        // Category Filter
        "categories.all": "All",
        "categories.tech": "Tech",
        "categories.music": "Music",
        "categories.food": "Food & Drinks",
        "categories.business": "Business",
        "categories.wellness": "Wellness",
        "categories.arts": "Arts",

        // Event details
        "event.date": "Date",
        "event.location": "Location",
        "event.details": "View Details",

        // Footer
        "footer.quickLinks": "Quick Links",
        "footer.events": "Events",
        "footer.about": "About Us",
        "footer.categories": "Categories",
        "footer.contact": "Contact",
        "footer.subscribe": "Subscribe to Newsletter",
        "footer.rights": "© 2025 EventEase. All rights reserved.",
        "footer.email": "support@eventease.com"
    },
    fr: {
        // Navbar
        home: "Accueil",
        dashboard: "Tableau de bord",
        signUp: "S'inscrire",
        login: "Connexion",
        profile: "Profil",
        settings: "Paramètres",
        logout: "Déconnexion",
        darkModeToggle: "Passer en mode sombre",
        lightModeToggle: "Passer en mode clair",

        // Existing translations
        welcome: "Bienvenue sur EventEase",
        getStarted: "Commencer",
        upcomingEvents: "Événements à venir",

        // Hero Section
        "hero.title": "Découvrez des événements incroyables près de chez vous",
        "hero.description": "Trouvez et participez à des événements qui correspondent à vos intérêts, connectez-vous avec des personnes partageant les mêmes idées et créez des souvenirs durables.",
        "hero.exploreButton": "Explorer les événements",

        // Featured Event Section
        "featured.badge": "Événement à la une",
        "featured.attendees": "{count} personnes participent",
        "featured.viewDetails": "Voir les détails",

        // Events Section
        "events.title": "Événements à venir",
        "events.subtitle": "Découvrez et réservez votre prochaine expérience",
        "events.viewAll": "Voir tous les événements",
        "events.noResults": "Aucun événement ne correspond à vos critères.",

        // CTA Section
        "cta.title": "Prêt à créer votre propre événement ?",
        "cta.description": "Partagez votre passion, construisez une communauté et créez des expériences inoubliables.",
        "cta.button": "Commencer",

        // Search Component
        "search.placeholder": "Rechercher des événements...",
        "search.location": "Lieu",
        "search.date": "Date",
        "search.button": "Rechercher",

        // Category Filter
        "categories.all": "Tous",
        "categories.tech": "Technologie",
        "categories.music": "Musique",
        "categories.food": "Gastronomie & Boissons",
        "categories.business": "Affaires",
        "categories.wellness": "Bien-être",
        "categories.arts": "Arts",

        // Event details
        "event.date": "Date",
        "event.location": "Lieu",
        "event.details": "Voir les détails",

        // Footer
        "footer.quickLinks": "Liens rapides",
        "footer.events": "Événements",
        "footer.about": "À propos",
        "footer.categories": "Catégories",
        "footer.contact": "Contact",
        "footer.subscribe": "S'abonner à la newsletter",
        "footer.rights": "© 2025 EventEase. Tous droits réservés.",
        "footer.email": "support@eventease.com"
    }
};

// Helper hook to use translations
import { useLanguage } from '../../Context/LanguageContext';

export const useTranslation = () => {
    const { language } = useLanguage();

    // Enhanced t function to handle parameters like {count}
    const t = (key: string, params?: Record<string, any>) => {
        const translation = translations[language as keyof typeof translations]?.[key as keyof (typeof translations)['en']] || key;

        if (params) {
            return Object.entries(params).reduce((acc, [param, value]) => {
                return acc.replace(`{${param}}`, String(value));
            }, translation as string);
        }

        return translation;
    };

    return { t, language };
};
