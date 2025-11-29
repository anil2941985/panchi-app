// pages/api/mockCommunity.js

export default function handler(req, res) {
  const reviews = [
    {
      id: 1,
      name: "Riya (Solo Traveller)",
      location: "Varanasi",
      emoji: "🛶",
      review:
        "Sunrise boat ride was magical. Best time is 5:45–6:15 AM. Crowds light & weather pleasant.",
      tip: "Book local guide near Assi Ghat for ₹300.",
      rating: 4.8,
      travelType: "solo"
    },
    {
      id: 2,
      name: "Arjun (Biker)",
      location: "Jaipur → Udaipur Ride",
      emoji: "🏍️",
      review:
        "Highway smooth overall. Avoid toll near Kishangarh due to construction. Great chai stops every 50 km.",
      tip: "Start early to avoid truck traffic.",
      rating: 4.6,
      travelType: "biker"
    },
    {
      id: 3,
      name: "Ankit (Backpacker)",
      location: "Goa Hostels (Anjuna)",
      emoji: "🏖️",
      review:
        "Great vibes, lots of travellers. Hostels getting full quickly. Beach shacks open till late.",
      tip: "Weekdays cheapest for stays.",
      rating: 4.7,
      travelType: "backpacker"
    },
    {
      id: 4,
      name: "Priya & Saurabh (Couple)",
      location: "Manali",
      emoji: "❄️",
      review:
        "Snow at Solang Valley was amazing. Rohtang route clear in mornings. Traffic bad after 3 PM.",
      tip: "Rent jackets from Mall Road instead of buying.",
      rating: 4.9,
      travelType: "couple"
    },
    {
      id: 5,
      name: "Family Trip",
      location: "Rishikesh",
      emoji: "🏞️",
      review:
        "Rafting instructors were very friendly. Safe even for kids above 12. Clean river stretch.",
      tip: "Avoid weekends—crowded.",
      rating: 4.5,
      travelType: "family"
    }
  ];

  res.status(200).json(reviews);
}
