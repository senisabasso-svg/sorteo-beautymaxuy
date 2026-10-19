const WHATSAPP_BUSINESS = '59897428888';

function normalizePhone(celular) {
  const digits = celular.replace(/\D/g, '');

  if (digits.startsWith('598') && digits.length >= 11) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `598${digits.slice(1)}`;
  }

  if (digits.length === 8 || digits.length === 9) {
    return `598${digits}`;
  }

  return digits;
}

function buildWhatsAppUrl(phone, message) {
  const normalized = normalizePhone(phone);
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

function buildParticipanteMessage(participante) {
  return [
    '*Participante desde web*',
    '',
    `*Nombre:* ${participante.nombre}`,
    `*Dirección:* ${participante.direccion}`,
    `*Ciudad:* ${participante.ciudad}`,
    `*Celular:* ${participante.celular}`,
  ].join('\n');
}

function buildGanadorMessage(ganador, premio = 'beautymax') {
  const premios = {
    beautymax: {
      titulo: '*¡Felicitaciones! Ganaste el sorteo BeautyMax*',
      detalle: 'Resultaste ganador/a del kit completo de Organic Pro.',
    },
    febros: {
      titulo: '*¡Felicitaciones! Ganaste el sorteo Febros*',
      detalle: 'Resultaste ganador/a de una web para tu salón.',
    },
  };

  const copia = premios[premio] || premios.beautymax;

  return [
    copia.titulo,
    '',
    `Hola ${ganador.nombre},`,
    copia.detalle,
    'Por favor respondenos para coordinar la entrega de tu premio.',
  ].join('\n');
}

module.exports = {
  WHATSAPP_BUSINESS,
  normalizePhone,
  buildWhatsAppUrl,
  buildParticipanteMessage,
  buildGanadorMessage,
};
