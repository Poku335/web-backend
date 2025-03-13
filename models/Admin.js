const db = require('../db');

const Admin = {
  login: (username, password, callback) => {
    db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], callback);
  }
};

module.exports = Admin;