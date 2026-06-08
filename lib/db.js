const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'sorteo.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    celular TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const insertParticipante = db.prepare(`
  INSERT INTO participantes (nombre, direccion, ciudad, celular)
  VALUES (@nombre, @direccion, @ciudad, @celular)
`);

const listParticipantes = db.prepare(`
  SELECT id, nombre, direccion, ciudad, celular, created_at
  FROM participantes
  ORDER BY created_at DESC
`);

const countParticipantes = db.prepare('SELECT COUNT(*) AS total FROM participantes');

const randomParticipante = db.prepare(`
  SELECT id, nombre, direccion, ciudad, celular, created_at
  FROM participantes
  ORDER BY RANDOM()
  LIMIT 1
`);

function createParticipante(data) {
  const result = insertParticipante.run(data);
  return getParticipanteById(result.lastInsertRowid);
}

function getParticipanteById(id) {
  return db.prepare(`
    SELECT id, nombre, direccion, ciudad, celular, created_at
    FROM participantes
    WHERE id = ?
  `).get(id);
}

function getAllParticipantes() {
  return listParticipantes.all();
}

function getParticipantesCount() {
  return countParticipantes.get().total;
}

function pickRandomWinner() {
  return randomParticipante.get() || null;
}

module.exports = {
  createParticipante,
  getAllParticipantes,
  getParticipantesCount,
  pickRandomWinner,
};
