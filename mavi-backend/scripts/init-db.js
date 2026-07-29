// One-time database setup.
//
//   npm run db:init         (from the mavi-backend folder)
//
// Reads DATABASE_URL (and optional DATABASE_CA_CERT) from the environment and
// creates the tables the app needs. Safe to run more than once — every
// statement uses IF NOT EXISTS, so re-running changes nothing.
require("dotenv").config();
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set. Add it to mavi-backend/.env and retry.");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_CA_CERT
        ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
        : { rejectUnauthorized: false },
});

const statements = [
    `CREATE TABLE IF NOT EXISTS chat_leads (
        id          SERIAL PRIMARY KEY,
        name        TEXT NOT NULL,
        email       TEXT NOT NULL,
        company     TEXT,
        message     TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS idx_chat_leads_created_at ON chat_leads (created_at DESC)`,
];

(async () => {
    try {
        console.log("🔌 Connecting to the database...");
        for (const sql of statements) {
            await pool.query(sql);
        }
        console.log("✅ Done. The 'chat_leads' table is ready.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Database setup failed:", err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
