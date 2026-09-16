import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import { categories, products } from './catalog.js';

const seed = async () => {
  await connectDatabase();
  await Category.bulkWrite(categories.map((item) => ({
    updateOne: { filter: { slug: item.slug }, update: { $set: item }, upsert: true }
  })));
  await Product.bulkWrite(products.map((item) => ({
    updateOne: { filter: { sku: item.sku }, update: { $set: item }, upsert: true }
  })));
  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  await disconnectDatabase();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await disconnectDatabase();
  process.exit(1);
});
