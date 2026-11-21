const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - List all products (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter).limit(Number(limit));
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });

    const products = await query;
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/search?q=keyword - Search products
router.get('/search', async (req, res) => {
  try {
    const { q, maxBudget } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Search query required' });

    const filter = { $text: { $search: q } };
    if (maxBudget) filter.price = { $lte: Number(maxBudget) };

    const products = await Product.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id/availability - Check stock
router.get('/:id/availability', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('name stock price');
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({
      success: true,
      name: product.name,
      inStock: product.stock > 0,
      stock: product.stock,
      price: product.price,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
