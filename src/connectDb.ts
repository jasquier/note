import path from "path";
import sqlite3, { Database } from "sqlite3";

let db: Database;
const dbPath: string = path.join(process.cwd(), "data", "data.db");

export function connectDb(databasePath: string = dbPath): Database {
  if (!db) db = new sqlite3.Database(databasePath);
  return db;
}
