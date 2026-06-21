import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

try {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("✅ Connected");

  const [rows] = await conn.query("SELECT NOW()");
  console.log(rows);

  await conn.end();
} catch (err) {
  console.error("❌ Error");
  console.error(err);
}