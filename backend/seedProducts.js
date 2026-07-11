import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Verify path to your Product model

dotenv.config();

const sampleProducts = [
  // --- MEN'S SECTION ---
  { name: "Premium Designer Men Kurta", category: "mens", image: "https://images.unsplash.com/photo-1626306642735-3c126ecad6da?w=500", new_price: 85, old_price: 120 },
  { name: "Classic Cotton Casual Shirt", category: "mens", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500", new_price: 45, old_price: 60 },
  { name: "Slim Fit Urban Denim Jacket", category: "mens", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500", new_price: 70, old_price: 95 },
  { name: "Traditional Waistcoat Midnight Edition", category: "mens", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500", new_price: 90, old_price: 130 },

  // --- WOMEN'S SECTION ---
  { name: "Elegance Embroidered Anarkali Suite", category: "womens", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500", new_price: 120, old_price: 180 },
  { name: "Floral Summer Breeze Maxi Dress", category: "womens", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500", new_price: 55, old_price: 80 },
  { name: "Pastel Festive Kurti Wear", category: "womens", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", new_price: 40, old_price: 65 },
  { name: "Modern Tailored Casual Blazer", category: "womens", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500", new_price: 75, old_price: 110 },

  // --- KIDS SECTION ---
  { name: "Kids Denim Overalls Set", category: "kids", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500", new_price: 30, old_price: 45 },
  { name: "Junior Graphic Cotton Hoodie", category: "kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500", new_price: 35, old_price: 50 },
  { name: "Toddler Party Wear Suit", category: "kids", image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=500", new_price: 60, old_price: 85 },
  { name: "Bright Summer Short & Tee Pack", category: "kids", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500", new_price: 25, old_price: 35 }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("⚡ Connected to MongoDB Atlas for bulk injection...");

    // Get current total items to maintain accurate auto-increment sequence IDs
    const lastProduct = await Product.findOne().sort({ id: -1 });
    let startId = lastProduct ? lastProduct.id + 1 : 1;

    const formattedProducts = sampleProducts.map((product, index) => ({
      ...product,
      id: startId + index,
      date: new Date()
    }));

    await Product.insertMany(formattedProducts);
    console.log(`🎉 Successfully seeded ${formattedProducts.length} premium items into your catalog!`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();