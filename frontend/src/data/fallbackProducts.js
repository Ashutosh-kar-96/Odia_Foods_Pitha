export const fallbackProducts = [
  "Arisa Pitha",
  "Enduri Pitha",
  "Manda Pitha",
  "Kakara Pitha",
  "Poda Pitha",
  "Chakuli Pitha",
  "Chitau Pitha",
  "Chandrakanti Pitha",
  "Khira Gaintha",
  "Bela Pana",
  "Chhatua Pana",
  "Tanka Torani"
].map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  category: name.includes("Pana") || name.includes("Torani") ? "Pana" : name.includes("Khira") || name.includes("Chandrakanti") ? "Sweet" : "Pitha",
  short_description: "Authentic Odisha traditional food prepared with heritage recipes.",
  price: 99 + index * 20,
  availability: index % 4 === 0 ? "Seasonal" : "In Stock",
  shelf_life_days: index % 3 === 0 ? 2 : 7,
  festival_tag: index % 2 === 0 ? "Raja" : "Rath Yatra",
  image_url: "https://images.unsplash.com/photo-1605197183305-6e6f00598346?auto=format&fit=crop&w=900&q=80"
}));
