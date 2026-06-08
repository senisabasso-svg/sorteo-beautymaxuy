const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./lib/db');
const {
  WHATSAPP_BUSINESS,
  buildWhatsAppUrl,
  buildParticipanteMessage,
  buildGanadorMessage,
} = require('./lib/whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'soldada';

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sorteo-beautymax-session',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));

function requireAdmin(req, res, next) {
  if (req.session?.admin) return next();
  res.status(401).json({ error: 'No autorizado' });
}

function enrichParticipante(participante) {
  const mensaje = buildParticipanteMessage(participante);
  return {
    ...participante,
    whatsapp_url: buildWhatsAppUrl(participante.celular, mensaje),
    whatsapp_business_url: buildWhatsAppUrl(WHATSAPP_BUSINESS, mensaje),
  };
}

app.post('/api/participantes', (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const direccion = String(req.body.direccion || '').trim();
  const ciudad = String(req.body.ciudad || '').trim();
  const celular = String(req.body.celular || '').trim();

  if (!nombre || !direccion || !ciudad || !celular) {
    return res.status(400).json({ error: 'Completá todos los campos.' });
  }

  const participante = db.createParticipante({ nombre, direccion, ciudad, celular });
  const enriched = enrichParticipante(participante);

  res.status(201).json({
    participante: enriched,
    whatsapp_url: enriched.whatsapp_business_url,
  });
});

app.post('/api/admin/login', (req, res) => {
  const usuario = String(req.body.usuario || '').trim();
  const clave = String(req.body.clave || '');

  if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
    req.session.admin = true;
    return res.json({ ok: true });
  }

  res.status(401).json({ error: 'Usuario o clave incorrectos.' });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/admin/session', (req, res) => {
  res.json({ authenticated: Boolean(req.session?.admin) });
});

app.get('/api/participantes', requireAdmin, (_req, res) => {
  const participantes = db.getAllParticipantes().map(enrichParticipante);
  res.json({
    total: participantes.length,
    participantes,
  });
});

app.post('/api/sorteo', requireAdmin, (_req, res) => {
  const total = db.getParticipantesCount();

  if (total === 0) {
    return res.status(400).json({ error: 'No hay participantes registrados.' });
  }

  const ganador = db.pickRandomWinner();
  const enriched = enrichParticipante(ganador);
  const mensajeGanador = buildGanadorMessage(ganador);

  res.json({
    total,
    ganador: {
      ...enriched,
      whatsapp_ganador_url: buildWhatsAppUrl(ganador.celular, mensajeGanador),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
