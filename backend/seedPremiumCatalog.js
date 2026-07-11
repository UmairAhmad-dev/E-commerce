import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Verify path to your Product model

dotenv.config();

const bulkCatalog = [
  // ==========================================
  // 👔 PREMIUM MEN'S COLLECTION (8 ITEMS)
  // ==========================================
  { name: "Premium Royal Blue Linen Kurta", category: "mens", image: "https://images.unsplash.com/photo-1597983073492-bc2401854645?w=500", new_price: 80, old_price: 110 },
  { name: "Traditional Hand-Embroidered Sherwani", category: "mens", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500", new_price: 240, old_price: 320 },
  { name: "Classic Cotton White Shalwar Kameez", category: "mens", image: "https://images.unsplash.com/photo-1626306642735-3c126ecad6da?w=500", new_price: 95, old_price: 140 },
  { name: "Midnight Black Formal Waistcoat", category: "mens", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", new_price: 65, old_price: 90 },
  { name: "Vintage Tailored Herringbone Blazer", category: "mens", image: "https://images.unsplash.com/photo-1598808503742-dd34bd0392b5?w=500", new_price: 145, old_price: 200 },
  { name: "Urban Khaki Slim-Fit Chinos", category: "mens", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500", new_price: 40, old_price: 55 },
  { name: "Casual Denim Button-Down Shirt", category: "mens", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500", new_price: 45, old_price: 65 },
  { name: "Minimalist Charcoal Sweatshirt", category: "mens", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500", new_price: 50, old_price: 70 },

  // ==========================================
  // 👗 ELEGANT WOMEN'S COLLECTION (8 ITEMS)
  // ==========================================
  { name: "Crimson Silk Festive Anarkali Suit", category: "womens", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500", new_price: 160, old_price: 220 },
  { name: "Pastel Mint Embroidered Kurti", category: "womens", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", new_price: 45, old_price: 65 },
  { name: "Floral Summer Georgette Maxi Dress", category: "womens", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500", new_price: 70, old_price: 100 },
  { name: "Classic Cashmere Knitted Cardigan", category: "womens", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500", new_price: 85, old_price: 120 },
  { name: "Tailored Ivory Work Office Blazer", category: "womens", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500", new_price: 90, old_price: 130 },
  { name: "High-Waisted Sleek Pleated Trousers", category: "womens", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500", new_price: 50, old_price: 75 },
  { name: "Bohemian Indigo Cotton Tunic", category: "womens", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500", new_price: 55, old_price: 80 },
  { name: "Monochrome Minimalist Wrap Dress", category: "womens", image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500", new_price: 75, old_price: 110 },

  // ==========================================
  // 🧸 VIBRANT KIDS COLLECTION (8 ITEMS)
  // ==========================================
  { name: "Junior Soft Denim Jumper Set", category: "kids", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500", new_price: 35, old_price: 50 },
  { name: "Organic Cotton Graphic Hoodie", category: "kids", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500", new_price: 40, old_price: 55 },
  { name: "Toddler Miniature Tuxedo Outfit", category: "kids", image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=500", new_price: 70, old_price: 100 },
  { name: "Bright Pastel Summer Dress", category: "kids", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500", new_price: 30, old_price: 45 },
  { name: "Cozy Fleece Winter Tracks Pack", category: "kids", image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=500", new_price: 45, old_price: 60 },
  { name: "Kids Canvas Casual Play Shoes", category: "kids", image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=500", new_price: 25, old_price: 35 },
  { name: "Striped Nautica Sailor Tee", category: "kids", image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=500", new_price: 20, old_price: 30 },
  { name: "Infant Fleece Pajama Onesy", category: "kids", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500", new_price: 18, old_price: 25 }
];

const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Syncing with MongoDB Atlas cluster variables...");

    // Fetch highest auto-increment tracking key inside database collections
    const lastItem = await Product.findOne().sort({ id: -1 });
    let trackerId = lastItem ? lastItem.id + 1 : 1;

    const pipelinePayload = bulkCatalog.map((item, index) => ({
      ...item,
      id: trackerId + index,
      date: new Date()
    }));

    await Product.insertMany(pipelinePayload);
    console.log(`✨ Success! Inserted ${pipelinePayload.length} premium catalog units cleanly into the cluster.`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Operational Pipeline Failure Seeding Data:", error);
    process.exit(1);
  }
};

runSeeder();