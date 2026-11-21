const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 29990,
    category: 'Electronics',
    brand: 'Sony',
    stock: 25,
    rating: 4.8,
    features: ['Noise Cancelling', 'Bluetooth 5.2', '30hr Battery', 'Multipoint Connection'],
    tags: ['headphones', 'wireless', 'noise-cancelling', 'premium', 'sony'],
  },
  {
    name: 'boAt Rockerz 450 Headphones',
    description: 'Wireless bluetooth headphones with 15-hour playback and padded ear cushions',
    price: 1499,
    category: 'Electronics',
    brand: 'boAt',
    stock: 100,
    rating: 4.1,
    features: ['Bluetooth 5.0', '15hr Battery', 'Padded Cushions', 'Foldable'],
    tags: ['headphones', 'wireless', 'budget', 'boat'],
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple flagship smartphone with A17 Pro chip, titanium design, 48MP camera',
    price: 159900,
    category: 'Smartphones',
    brand: 'Apple',
    stock: 15,
    rating: 4.7,
    features: ['A17 Pro Chip', 'Titanium Design', '48MP Camera', 'USB-C', 'Action Button'],
    tags: ['phone', 'smartphone', 'apple', 'iphone', 'premium', 'flagship'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung flagship with Snapdragon 8 Gen 3, S Pen, 200MP camera, AI features',
    price: 129999,
    category: 'Smartphones',
    brand: 'Samsung',
    stock: 20,
    rating: 4.6,
    features: ['Snapdragon 8 Gen 3', 'S Pen', '200MP Camera', 'Galaxy AI', 'Titanium Frame'],
    tags: ['phone', 'smartphone', 'samsung', 'galaxy', 'premium', 'flagship'],
  },
  {
    name: 'Realme Narzo 70x',
    description: 'Budget smartphone with 120Hz display, 50MP camera, 5000mAh battery',
    price: 11999,
    category: 'Smartphones',
    brand: 'Realme',
    stock: 50,
    rating: 4.0,
    features: ['120Hz Display', '50MP Camera', '5000mAh Battery', '5G'],
    tags: ['phone', 'smartphone', 'realme', 'budget', '5g'],
  },
  {
    name: 'Nike Air Max 270',
    description: 'Lifestyle running shoes with Max Air unit for all-day comfort',
    price: 12995,
    category: 'Footwear',
    brand: 'Nike',
    stock: 40,
    rating: 4.4,
    features: ['Air Max Unit', 'Mesh Upper', 'Rubber Outsole'],
    tags: ['shoes', 'running', 'nike', 'sports', 'sneakers'],
  },
  {
    name: 'Puma RS-X Sneakers',
    description: 'Bold retro-inspired running sneakers with chunky sole and vibrant design',
    price: 7999,
    category: 'Footwear',
    brand: 'Puma',
    stock: 35,
    rating: 4.2,
    features: ['Chunky Sole', 'RS Cushioning', 'Retro Design'],
    tags: ['shoes', 'sneakers', 'puma', 'casual', 'retro'],
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop with Apple M3 chip, 18-hour battery, Liquid Retina display',
    price: 114900,
    category: 'Laptops',
    brand: 'Apple',
    stock: 10,
    rating: 4.9,
    features: ['M3 Chip', '18hr Battery', 'Liquid Retina', '8GB RAM', '256GB SSD'],
    tags: ['laptop', 'macbook', 'apple', 'ultrabook', 'premium'],
  },
  {
    name: 'HP Pavilion 15',
    description: 'Everyday laptop with Intel i5, 8GB RAM, 512GB SSD, 15.6" FHD display',
    price: 54990,
    category: 'Laptops',
    brand: 'HP',
    stock: 30,
    rating: 4.1,
    features: ['Intel i5', '8GB RAM', '512GB SSD', '15.6" FHD'],
    tags: ['laptop', 'hp', 'student', 'work', 'budget'],
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit jeans with stretch denim for comfortable all-day wear',
    price: 2999,
    category: 'Clothing',
    brand: 'Levi\'s',
    stock: 60,
    rating: 4.3,
    features: ['Slim Fit', 'Stretch Denim', 'Classic 5-Pocket'],
    tags: ['jeans', 'clothing', 'levis', 'denim', 'fashion'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibecart');
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${sampleProducts.length} products`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
