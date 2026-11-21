const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/agoraToken');

// POST /api/agora/token - Generate Agora RTC token
router.post('/token', (req, res) => {
  try {
    const { channelName, uid = 0 } = req.body;
    if (!channelName) {
      return res.status(400).json({ success: false, error: 'Channel name required' });
    }

    const token = generateToken(channelName, uid);
    res.json({ success: true, token, channelName, uid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/agora/webhook - Agora Agent Webhook (receives agent actions)
router.post('/webhook', async (req, res) => {
  try {
    const { action, parameters, userId } = req.body;
    console.log(`🤖 Agent Action: ${action}`, parameters);

    let result;

    switch (action) {
      case 'search_products': {
        const Product = require('../models/Product');
        const filter = { $text: { $search: parameters.query } };
        if (parameters.maxBudget) filter.price = { $lte: parameters.maxBudget };
        const products = await Product.find(filter).limit(5);
        result = { products: products.map(p => ({ name: p.name, price: p.price, rating: p.rating, id: p._id })) };
        break;
      }

      case 'check_availability': {
        const Product = require('../models/Product');
        const product = await Product.findById(parameters.productId);
        result = product
          ? { name: product.name, inStock: product.stock > 0, stock: product.stock, price: product.price }
          : { error: 'Product not found' };
        break;
      }

      case 'add_to_cart': {
        const Cart = require('../models/Cart');
        const Product = require('../models/Product');
        const product = await Product.findById(parameters.productId);
        if (!product) { result = { error: 'Product not found' }; break; }

        let cart = await Cart.findOne({ userId }) || new Cart({ userId, items: [] });
        cart.items.push({ product: parameters.productId, quantity: parameters.quantity || 1, price: product.price });
        await cart.save();
        result = { message: `${product.name} added to cart`, totalAmount: cart.totalAmount };
        break;
      }

      case 'view_cart': {
        const Cart = require('../models/Cart');
        const cart = await Cart.findOne({ userId }).populate('items.product');
        result = cart
          ? { items: cart.items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.price })), total: cart.totalAmount }
          : { items: [], total: 0 };
        break;
      }

      default:
        result = { error: `Unknown action: ${action}` };
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
