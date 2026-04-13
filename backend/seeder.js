const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  // ── MOBILES ──
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever. A17 Pro chip, 48MP camera system, titanium design, and Action button. Up to 29 hours video playback.',
    price: 1199.99,
    category: 'Mobiles',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    countInStock: 30,
    rating: 4.9,
    numReviews: 245,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and titanium frame for ultimate performance.',
    price: 1099.99,
    category: 'Mobiles',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
    countInStock: 25,
    rating: 4.8,
    numReviews: 189,
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC charging. 0 to 100% in 26 minutes.',
    price: 799.99,
    category: 'Mobiles',
    brand: 'OnePlus',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80',
    countInStock: 40,
    rating: 4.7,
    numReviews: 132,
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Google Tensor G3 chip, best-in-class AI features, 50MP camera with Magic Eraser, 7 years of OS updates.',
    price: 899.99,
    category: 'Mobiles',
    brand: 'Google',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    countInStock: 20,
    rating: 4.6,
    numReviews: 98,
  },

  // ── LAPTOPS ──
  {
    name: 'Apple MacBook Air M3',
    description: 'Supercharged by M3 chip. Up to 18 hours battery, 15.3" Liquid Retina display, fanless design. The world\'s best consumer laptop.',
    price: 1299.99,
    category: 'Laptops',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80',
    countInStock: 18,
    rating: 4.9,
    numReviews: 312,
  },
  {
    name: 'Dell XPS 15 OLED',
    description: '13th Gen Intel Core i9, NVIDIA RTX 4070, 15.6" 3.5K OLED touch display, 64GB RAM, 1TB SSD. Creator powerhouse.',
    price: 2199.99,
    category: 'Laptops',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
    countInStock: 12,
    rating: 4.7,
    numReviews: 87,
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'AMD Ryzen 9, RTX 4060, 14" QHD 165Hz display, AniMe Matrix LED lid. The ultimate gaming ultrabook.',
    price: 1599.99,
    category: 'Laptops',
    brand: 'ASUS',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
    countInStock: 15,
    rating: 4.8,
    numReviews: 156,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Ultra-light business laptop at just 1.12kg. Intel Core i7, 16GB RAM, 14" IPS display, military-grade durability.',
    price: 1449.99,
    category: 'Laptops',
    brand: 'Lenovo',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
    countInStock: 22,
    rating: 4.6,
    numReviews: 74,
  },

  // ── ELECTRONICS ──
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with 8 microphones. 30-hour battery, multipoint connection, crystal clear hands-free calling.',
    price: 349.99,
    category: 'Electronics',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    countInStock: 45,
    rating: 4.9,
    numReviews: 520,
  },
  {
    name: 'Samsung 65" 4K QLED TV',
    description: 'Quantum Dot technology, 4K AI upscaling, Object Tracking Sound, built-in Alexa. Transform your living room.',
    price: 1299.99,
    category: 'Electronics',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500&q=80',
    countInStock: 10,
    rating: 4.7,
    numReviews: 203,
  },
  {
    name: 'Apple iPad Pro 12.9" M2',
    description: 'M2 chip, Liquid Retina XDR display, ProMotion 120Hz, Apple Pencil hover, Thunderbolt connectivity.',
    price: 1099.99,
    category: 'Electronics',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    countInStock: 28,
    rating: 4.8,
    numReviews: 167,
  },
  {
    name: 'Sony PlayStation 5',
    description: 'Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    price: 499.99,
    category: 'Electronics',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&q=80',
    countInStock: 8,
    rating: 4.9,
    numReviews: 890,
  },

  // ── CLOTHING ──
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original jean since 1873. Straight fit, button fly, sits at waist. 100% cotton denim, pre-washed for softness.',
    price: 59.99,
    category: 'Clothing',
    brand: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
    countInStock: 80,
    rating: 4.5,
    numReviews: 340,
  },
  {
    name: 'Nike Dri-FIT Training T-Shirt',
    description: 'Sweat-wicking fabric keeps you dry and comfortable. Lightweight, breathable mesh. Perfect for gym or casual wear.',
    price: 34.99,
    category: 'Clothing',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    countInStock: 120,
    rating: 4.4,
    numReviews: 215,
  },
  {
    name: 'The North Face Puffer Jacket',
    description: '700-fill goose down insulation, water-repellent finish, packable design. Warmth without the bulk.',
    price: 249.99,
    category: 'Clothing',
    brand: 'The North Face',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80',
    countInStock: 35,
    rating: 4.7,
    numReviews: 128,
  },

  // ── FOOTWEAR ──
  {
    name: 'Nike Air Max 270',
    description: 'Max Air unit in the heel for all-day comfort. Breathable mesh upper, foam midsole. Iconic silhouette for street style.',
    price: 149.99,
    category: 'Footwear',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    countInStock: 60,
    rating: 4.6,
    numReviews: 380,
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'BOOST midsole returns energy with every step. Primeknit+ upper adapts to your foot. Best running shoe of the year.',
    price: 189.99,
    category: 'Footwear',
    brand: 'Adidas',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
    countInStock: 45,
    rating: 4.7,
    numReviews: 290,
  },

  // ── KITCHEN ──
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 6-quart capacity. 70% faster cooking.',
    price: 89.99,
    category: 'Kitchen',
    brand: 'Instant Pot',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
    countInStock: 55,
    rating: 4.7,
    numReviews: 1240,
  },
  {
    name: 'Nespresso Vertuo Next Coffee Machine',
    description: 'Brew 5 cup sizes with one touch. Centrifusion technology, 30-second heat-up, automatic capsule ejection.',
    price: 179.99,
    category: 'Kitchen',
    brand: 'Nespresso',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
    countInStock: 38,
    rating: 4.6,
    numReviews: 445,
  },

  // ── BOOKS ──
  {
    name: 'Atomic Habits — James Clear',
    description: 'The #1 New York Times bestseller. Tiny changes, remarkable results. A proven framework for building good habits and breaking bad ones.',
    price: 16.99,
    category: 'Books',
    brand: 'Penguin Random House',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    countInStock: 200,
    rating: 4.9,
    numReviews: 3200,
  },
  {
    name: 'The Alchemist — Paulo Coelho',
    description: 'A magical story about following your dreams. Over 65 million copies sold worldwide. A timeless classic.',
    price: 13.99,
    category: 'Books',
    brand: 'HarperCollins',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    countInStock: 150,
    rating: 4.8,
    numReviews: 2100,
  },

  // ── SPORTS ──
  {
    name: 'Bowflex SelectTech 552 Dumbbells',
    description: 'Adjusts from 5 to 52.5 lbs. Replaces 15 sets of weights. Dial system changes weight in seconds. Space-saving design.',
    price: 429.99,
    category: 'Sports',
    brand: 'Bowflex',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    countInStock: 20,
    rating: 4.8,
    numReviews: 567,
  },
  {
    name: 'Yoga Mat Premium 6mm',
    description: 'Non-slip surface, eco-friendly TPE material, 6mm cushioning for joints. Includes carrying strap. 183cm × 61cm.',
    price: 39.99,
    category: 'Sports',
    brand: 'Gaiam',
    image: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=500&q=80',
    countInStock: 90,
    rating: 4.5,
    numReviews: 412,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await User.deleteMany();
    await Product.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });

    const products = sampleProducts.map((p) => ({ ...p, createdBy: admin._id }));
    await Product.insertMany(products);

    console.log(`✅ Seeded ${products.length} products successfully!`);
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('User:  john@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
