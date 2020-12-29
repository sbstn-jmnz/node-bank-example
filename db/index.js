const { Pool } = require("pg");
const Cursor = require('pg-cursor')

const config = {
  user: 'sbstn',
  password: 'ruby',
  host: 'localhost',
  port: 5432,
  database: 'bank'
}

const pool = new Pool(config);

module.exports = {
  getClient: () => pool.connect(),
  end: () => pool.end(),
  Cursor
}