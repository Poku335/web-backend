const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/product', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM product');
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


router.get('/product/search', async (req, res) => {
  try {
    const searchQuery = req.query.q; 
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    
    const [rows] = await db.promise().query(
      'SELECT * FROM product WHERE product_name LIKE ?',
      [`%${searchQuery}%`]
    );
    res.json(rows || []);
  } catch (error) {
    console.error('Error searching product:', error);
    res.status(500).json({ error: 'Failed to search product' });
  }
});

router.post('/product', upload.single('img'), async (req, res) => {
  try {
    const { product_name, price, qty } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.promise().query(
      'INSERT INTO product (product_name, price, qty, img) VALUES (?, ?, ?, ?)',
      [product_name, price, qty, img]
    );
    res.status(201).json({ product_id: result.insertId, product_name, price, qty, img });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.put('/product/:id', upload.single('img'), async (req, res) => {
  try {
    const { product_name, price, qty } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : req.body.img;

    const [result] = await db.promise().query(
      'UPDATE product SET product_name = ?, price = ?, qty = ?, img = ? WHERE product_id = ?',
      [product_name, price, qty, img, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/product/:id', async (req, res) => {
  try {
    const [result] = await db.promise().query('DELETE FROM product WHERE product_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
