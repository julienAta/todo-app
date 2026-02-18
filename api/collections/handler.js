import { neon } from "@neondatabase/serverless";

let sql;
let initialized = false;

function getSQL() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

async function ensureTable() {
  if (initialized) return;
  const db = getSQL();
  await db`CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    collection TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  )`;
  await db`CREATE INDEX IF NOT EXISTS idx_items_collection ON items (collection)`;
  initialized = true;
}

function genId() {
  return Date.now().toString(16) + Math.random().toString(16).slice(2, 10);
}

function formatItem(row) {
  return { id: row.id, ...row.data, createdAt: row.created_at, updatedAt: row.updated_at };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    await ensureTable();
    const db = getSQL();

    const url = new URL(req.url);
    // Path: /api/collections/:collection[/:idOrAction]
    const parts = url.pathname.replace(/^\/api\/collections\//, "").split("/").filter(Boolean);
    const collection = parts[0];
    const idOrAction = parts[1];

    if (!collection) return json({ error: "collection required" }, 400);

    // POST /api/collections/:collection/seed
    if (req.method === "POST" && idOrAction === "seed") {
      const existing = await db`SELECT id FROM items WHERE collection = ${collection} LIMIT 1`;
      if (existing.length > 0) return json({ seeded: 0, skipped: true });
      const body = await req.json();
      const rows = body.items || [];
      for (const raw of rows) {
        const id = raw.id || genId();
        const data = Object.fromEntries(Object.entries(raw).filter(([k]) => k !== "id"));
        await db`INSERT INTO items (id, collection, data) VALUES (${id}, ${collection}, ${JSON.stringify(data)})`;
      }
      return json({ seeded: rows.length, skipped: false });
    }

    // GET /api/collections/:collection — list all
    if (req.method === "GET" && !idOrAction) {
      const rows = await db`SELECT * FROM items WHERE collection = ${collection} ORDER BY created_at`;
      return json(rows.map(formatItem));
    }

    // GET /api/collections/:collection/:id — get one
    if (req.method === "GET" && idOrAction) {
      const rows = await db`SELECT * FROM items WHERE id = ${idOrAction} AND collection = ${collection}`;
      if (rows.length === 0) return json({ error: "not found" }, 404);
      return json(formatItem(rows[0]));
    }

    // POST /api/collections/:collection — create
    if (req.method === "POST" && !idOrAction) {
      const body = await req.json();
      const id = body.id || genId();
      const data = body.data || {};
      const rows = await db`INSERT INTO items (id, collection, data) VALUES (${id}, ${collection}, ${JSON.stringify(data)}) RETURNING *`;
      return json(formatItem(rows[0]), 201);
    }

    // PUT /api/collections/:collection/:id — update
    if (req.method === "PUT" && idOrAction) {
      const body = await req.json();
      const existing = await db`SELECT * FROM items WHERE id = ${idOrAction} AND collection = ${collection}`;
      if (existing.length === 0) return json({ error: "not found" }, 404);
      const merged = { ...existing[0].data, ...body.data };
      const rows = await db`UPDATE items SET data = ${JSON.stringify(merged)}, updated_at = now() WHERE id = ${idOrAction} RETURNING *`;
      return json(formatItem(rows[0]));
    }

    // DELETE /api/collections/:collection/:id — delete one
    if (req.method === "DELETE" && idOrAction) {
      const existing = await db`SELECT id FROM items WHERE id = ${idOrAction} AND collection = ${collection}`;
      if (existing.length === 0) return json({ error: "not found" }, 404);
      await db`DELETE FROM items WHERE id = ${idOrAction}`;
      return json({ deleted: idOrAction });
    }

    // DELETE /api/collections/:collection — clear
    if (req.method === "DELETE" && !idOrAction) {
      const result = await db`DELETE FROM items WHERE collection = ${collection}`;
      return json({ cleared: result.count || 0 });
    }

    return json({ error: "method not allowed" }, 405);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export const config = { runtime: "edge" };
