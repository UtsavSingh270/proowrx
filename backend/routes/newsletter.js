const express = require('express');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.json({ message: 'You are already subscribed', subscriber: existing });
    }

    const subscriber = await NewsletterSubscriber.create({
      email,
      source: req.body.source || 'website_footer',
    });

    return res.status(201).json({ message: 'Subscription saved', subscriber });
  } catch (error) {
    if (error?.code === 11000) {
      return res.json({ message: 'You are already subscribed' });
    }
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    return res.json(subscribers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });
    return res.json({ message: 'Subscriber deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
