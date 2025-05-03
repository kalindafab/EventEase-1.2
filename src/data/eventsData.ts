export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  price: number;
  isFeatured: boolean;
  organizer: {
    name: string;
    logo: string;
  };
  attendees: number;
}

export const eventsData: Event[] = [
  {
    id: "1",
    title: "TechConnect Conference 2025",
    description: "Join us for the most anticipated tech conference of the year, where industry leaders and innovators gather to share insights on emerging technologies. Experience hands-on workshops, engaging panel discussions, and unparalleled networking opportunities with professionals from around the globe. This year's focus includes AI, blockchain, cloud computing, and more cutting-edge technologies that are shaping our future.",
    shortDescription: "The premier tech conference featuring industry leaders and cutting-edge technology demos.",
    date: "2025-05-15",
    time: "09:00 AM - 06:00 PM",
    location: "Kigali Convention Center",
    image: "https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Tech",
    price: 299,
    isFeatured: true,
    organizer: {
      name: "TechInnovate Group",
      logo: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    attendees: 1500
  },
  {
    id: "2",
    title: "Summer Music Festival",
    description: "Experience the ultimate summer music festival featuring top artists across multiple genres. Dance under the stars as renowned DJs and bands perform live on three different stages. Enjoy delicious food from gourmet food trucks, refreshing drinks, and interactive art installations throughout the festival grounds. Don't miss the chance to create unforgettable memories with friends and fellow music lovers.",
    shortDescription: "A weekend of amazing music performances, food, and unforgettable experiences.",
    date: "2025-07-10",
    time: "03:00 PM - 11:00 PM",
    location: "Sunshine Park, Kicukiro",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Music",
    price: 149,
    isFeatured: true,
    organizer: {
      name: "Melody Productions",
      logo: "https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    attendees: 5000
  },
  {
    id: "3",
    title: "Culinary Masterclass",
    description: "Elevate your cooking skills in this exclusive masterclass led by Michelin-starred chef Isabella Martinez. Learn the secrets of gourmet cooking as Chef Martinez guides you through preparing a multi-course meal featuring seasonal ingredients and innovative techniques. The intimate setting allows for personalized instruction and the opportunity to ask questions throughout the demonstration. After the class, enjoy the fruits of your labor with a communal dining experience.",
    shortDescription: "Learn gourmet cooking techniques from Michelin-starred Chef Isabella Martinez.",
    date: "2025-06-05",
    time: "06:30 PM - 09:30 PM",
    location: "Gourmet Kitchen Studio, Rwamagana",
    image: "https://images.pexels.com/photos/18531641/pexels-photo-18531641/free-photo-of-chef-preparing-food.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Food & Drinks",
    price: 199,
    isFeatured: false,
    organizer: {
      name: "Culinary Arts Institute",
      logo: "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    attendees: 30
  },
  {
    id: "4",
    title: "Startup Pitch Night",
    description: "Witness the next generation of innovators at our Startup Pitch Night! Ten promising startups will pitch their groundbreaking ideas to a panel of venture capitalists and industry experts. Each startup has just five minutes to make their case, followed by Q&A with the judges. Attendees will vote for their favorite, with the audience choice winner receiving special recognition. Network with entrepreneurs, investors, and tech enthusiasts in a dynamic and inspiring environment.",
    shortDescription: "Watch innovative startups pitch to investors and network with entrepreneurs.",
    date: "2025-04-22",
    time: "06:00 PM - 09:00 PM",
    location: "Innovation Hub, Rubavu",
    image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Business",
    price: 25,
    isFeatured: false,
    organizer: {
      name: "Venture Forward",
      logo: "https://images.pexels.com/photos/936137/pexels-photo-936137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    attendees: 200
  },
  {
    id: "5",
    title: "Yoga & Wellness Retreat",
    description: "Escape the hustle and bustle of everyday life with our weekend wellness retreat in the serene mountains. Join experienced instructors for daily yoga and meditation sessions suitable for all levels. Nourish your body with organic, plant-based meals prepared by our in-house nutritionist. Enjoy guided nature walks, workshops on mindfulness practices, and ample free time to reflect and recharge. All accommodations and meals are included in this all-inclusive retreat experience.",
    shortDescription: "A weekend of yoga, meditation, and wellness activities in a beautiful mountain setting.",
    date: "2025-08-15",
    time: "All Day",
    location: "Mountain Serenity Resort, Musanze",
    image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Wellness",
    price: 499,
    isFeatured: true,
    organizer: {
      name: "Mindful Living Co.",
      logo: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    attendees: 50
  },
  {
    id: "6",
    title: "Photography Workshop",
    description: "Develop your photography skills in this comprehensive workshop led by award-winning photographer James Wilson. Whether you're a beginner or looking to refine your technique, this hands-on workshop covers everything from camera basics to advanced composition and lighting. The day includes both classroom instruction and a guided photo walk through scenic locations. Bring your own camera equipment (all types welcome) and prepare to see the world through a new lens as you capture stunning images under expert guidance.",
    shortDescription: "Enhance your photography skills with guidance from award-winning professionals.",
    date: "2025-06-28",
    time: "10:00 AM - 04:00 PM",
    location: "Urban Arts Center, Nyarugenge",
    image: "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Arts",
    price: 150,
    isFeatured: false,
    organizer: {
      name: "Creative Lens Academy",
      logo: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    attendees: 25
  }
];