const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TYPE user_status AS ENUM ('user', 'member', 'admin');

CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR ( 255 ) NOT NULL,
last_name VARCHAR ( 255 ) NOT NULL,
username VARCHAR ( 50 ) UNIQUE NOT NULL,
password VARCHAR ( 255 ) NOT NULL,
status user_status NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS messages(
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title VARCHAR ( 255 ) NOT NULL,
text TEXT NOT NULL,
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
`;

const main = async () => {
  console.log("...seeding");
  const client = new Client({
    connectionString: process.env.DATABASE_CONNECTION,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
};

main();
