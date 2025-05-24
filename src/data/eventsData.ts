export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  endTime?: string; // Added end time
  location: string;
  coordinates?: { lat: number; lng: number }; // Added for maps
  image: string;
  darkModeImage?: string; // Optional alternative image for dark mode
  category: string;
  tags?: string[]; // Added for better filtering
  price: number;
  isFeatured: boolean;
  isOnline?: boolean; // Added for virtual events
  maxAttendees?: number; // Added for capacity
  organizer: {
    name: string;
    logo: string;
    darkModeLogo?: string; // Optional alternative logo for dark mode
  };
  attendees: number;
  socialLinks?: { // Added for social sharing
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  requirements?: string[]; // Added for event requirements
}

export const eventsData: Event[] = [
  {
    id: "1",
    title: "TechConnect Conference 2025",
    description: "Join us for the most anticipated tech conference...",
    shortDescription: "The premier tech conference featuring industry leaders...",
    date: "2025-05-15",
    time: "09:00 AM",
    endTime: "06:00 PM",
    location: "Kigali Convention Center, KG 2 Roundabout, Kigali",
    coordinates: { lat: -1.9575, lng: 30.0958 },
    image: "https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg",
    darkModeImage: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg", // Darker tech image
    category: "Tech",
    tags: ["AI", "Blockchain", "Cloud Computing"],
    price: 299,
    isFeatured: true,
    maxAttendees: 2000,
    organizer: {
      name: "TechInnovate Group",
      logo: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      darkModeLogo: "https://images.pexels.com/photos/3861975/pexels-photo-3861975.jpeg" // Darker logo
    },
    attendees: 1500,
    socialLinks: {
      website: "https://techconnect.example.com",
      twitter: "techconnect_rw"
    },
    requirements: ["Business casual attire", "Bring laptop for workshops"]
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Experience the ultimate summer music festival...",
    shortDescription: "A weekend of amazing music performances...",
    date: "2025-07-10",
    time: "03:00 PM",
    endTime: "11:00 PM",
    location: "Sunshine Park, Kicukiro, Kigali",
    coordinates: { lat: -1.9846, lng: 30.0989 },
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    darkModeImage: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg", // Night concert image
    category: "Music",
    tags: ["Live Music", "Festival", "Outdoor"],
    price: 149,
    isFeatured: true,
    maxAttendees: 8000,
    organizer: {
      name: "Melody Productions",
      logo: "https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg"
    },
    attendees: 5000,
    socialLinks: {
      instagram: "melodyfest_rw"
    },
    requirements: ["Valid ID required", "No outside food/drinks"]
  },
  // ... (other events with similar enhancements)
  {
    id: "6",
    title: "Photography Workshop",
    description: "Develop your photography skills...",
    shortDescription: "Enhance your photography skills...",
    date: "2025-06-28",
    time: "10:00 AM",
    endTime: "04:00 PM",
    location: "Urban Arts Center, KN 12 Ave, Nyarugenge, Kigali",
    coordinates: { lat: -1.9508, lng: 30.0615 },
    image: "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg",
    darkModeImage: "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg", // Darker photography image
    category: "Arts",
    tags: ["Workshop", "Beginner Friendly", "Hands-on"],
    price: 150,
    isFeatured: false,
    isOnline: false,
    maxAttendees: 30,
    organizer: {
      name: "Creative Lens Academy",
      logo: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg"
    },
    attendees: 25,
    requirements: ["Bring your own camera", "Comfortable walking shoes"]
  }
];