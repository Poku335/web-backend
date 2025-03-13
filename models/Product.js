const db = require('../db');

const Product = {
  getAll: (callback) => {
    db.query('SELECT * FROM product', callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO product SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE product SET ? WHERE product_id = ?', [data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM product WHERE product_id = ?', [id], callback);
  },
  search: (keyword, callback) => {
    db.query('SELECT * FROM product WHERE product_name LIKE ?', [`%${keyword}%`], callback);
  }
};

module.exports = Product;