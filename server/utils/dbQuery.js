import pool from "../config/db.js";

const dbQuery = async (text, params = []) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("❌ DB Query Error:", err.message);
    throw err;
  }
};

export default dbQuery;