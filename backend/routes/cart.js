const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

// POST /api/cart/add - Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, error: `Only ${product.stock} items in stock` });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    res.json({ success: true, message: `${product.name} added to cart`, cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/cart/:userId - View cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');
    if (!cart) return res.json({ success: true, items: [], totalAmount: 0 });
    res.json({ success: true, items: cart.items, totalAmount: cart.totalAmount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/cart/remove/:userId/:itemId - Remove item
router.delete('/remove/:userId/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    res.json({ success: true, message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cart/checkout - Checkout
router.post('/checkout', async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Check stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `${item.product.name} has only ${item.product.stock} in stock`,
        });
      }
    }

    // Create order
    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalAmount,
      status: 'confirmed',
      paymentStatus: 'paid',
    });
    await order.save();

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({ success: true, message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
