const PARTICIPANTES = Array.isArray(window.PARTICIPANTES) ? window.PARTICIPANTES : [];

const totalParticipantes = document.getElementById('total-participantes');
const clientesList = document.getElementById('clientes-list');
const clientesEmpty = document.getElementById('clientes-empty');
const tabButtons = document.querySelectorAll('.tabs__btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const btnExcel = document.getElementById('btn-excel');
const btnSortear = document.getElementById('btn-sortear');
const countdown = document.getElementById('countdown');
const countdownNumber = document.getElementById('countdown-number');
const ganador = document.getElementById('ganador');
const ganadorNombre = document.getElementById('ganador-nombre');
const ganadorDireccion = document.getElementById('ganador-direccion');
const ganadorCiudad = document.getElementById('ganador-ciudad');
const ganadorCelular = document.getElementById('ganador-celular');
const ganadorWhatsapp = document.getElementById('ganador-whatsapp');
const btnRepetirSorteo = document.getElementById('btn-repetir-sorteo');
const sorteoError = document.getElementById('sorteo-error');

function showSorteoError(message) {
  sorteoError.hidden = !message;
  sorteoError.textContent = message || '';
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function exportExcel() {
  if (PARTICIPANTES.length === 0) {
    alert('No hay participantes para exportar.');
    return;
  }

  const rows = [
    ['#', 'Nombre', 'Dirección', 'Ciudad', 'Celular'],
    ...PARTICIPANTES.map((p, i) => [
      String(i + 1),
      p.nombre || '',
      p.direccion || '',
      p.ciudad || '',
      p.celular || '',
    ]),
  ];

  const cells = rows
    .map(
      (row) =>
        `<Row>${row
          .map((value) => `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`)
          .join('')}</Row>`
    )
    .join('');

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Participantes">
  <Table>${cells}</Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `participantes-beautymax-${date}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function normalizePhone(celular) {
  const digits = String(celular || '').replace(/\D/g, '');

  if (digits.startsWith('598') && digits.length >= 11) return digits;
  if (digits.startsWith('0')) return `598${digits.slice(1)}`;
  if (digits.length === 8 || digits.length === 9) return `598${digits}`;
  return digits;
}

function buildWhatsAppUrl(celular, nombre) {
  const phone = normalizePhone(celular);
  const mensaje = [
    `*¡Felicitaciones! Ganaste el sorteo BeautyMax*`,
    '',
    `Hola ${nombre},`,
    'Resultaste ganador/a del kit completo de Organic Pro.',
    'Por favor respondenos para coordinar la entrega de tu premio.',
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
}

function loadParticipantes() {
  totalParticipantes.textContent = String(PARTICIPANTES.length);
  clientesList.innerHTML = '';

  if (PARTICIPANTES.length === 0) {
    clientesEmpty.hidden = false;
    return;
  }

  clientesEmpty.hidden = true;

  PARTICIPANTES.forEach((participante, index) => {
    const item = document.createElement('article');
    item.className = 'cliente-card';
    const waUrl = buildWhatsAppUrl(participante.celular, participante.nombre);
    item.innerHTML = `
      <div class="cliente-card__info">
        <h3>${index + 1}. ${escapeHtml(participante.nombre)}</h3>
        <p><strong>Dirección:</strong> ${escapeHtml(participante.direccion)}</p>
        <p><strong>Ciudad:</strong> ${escapeHtml(participante.ciudad)}</p>
        <p><strong>Celular:</strong> ${escapeHtml(participante.celular)}</p>
      </div>
      <a class="btn btn--whatsapp" href="${waUrl}" target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
    `;
    clientesList.appendChild(item);
  });
}

function activateTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle('tabs__btn--active', button.dataset.tab === tabName);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('tab-panel--active', panel.id === `tab-${tabName}`);
  });
}

function resetSorteoView() {
  countdown.hidden = true;
  ganador.hidden = true;
  btnSortear.hidden = false;
  showSorteoError('');
}

function pickRandomWinner() {
  const index = Math.floor(Math.random() * PARTICIPANTES.length);
  return PARTICIPANTES[index];
}

function showWinner(winner) {
  ganadorNombre.textContent = winner.nombre;
  ganadorDireccion.textContent = winner.direccion;
  ganadorCiudad.textContent = winner.ciudad;
  ganadorCelular.textContent = winner.celular;
  ganadorWhatsapp.href = buildWhatsAppUrl(winner.celular, winner.nombre);
  ganador.hidden = false;
}

function runCountdown(onComplete) {
  let current = 3;
  countdown.hidden = false;
  countdownNumber.textContent = String(current);

  const interval = setInterval(() => {
    current -= 1;

    if (current > 0) {
      countdownNumber.textContent = String(current);
      return;
    }

    clearInterval(interval);
    countdown.hidden = true;
    onComplete();
  }, 1000);
}

btnExcel.addEventListener('click', exportExcel);

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activateTab(button.dataset.tab);
    if (button.dataset.tab === 'sorteo') {
      resetSorteoView();
    }
  });
});

btnSortear.addEventListener('click', () => {
  resetSorteoView();

  if (PARTICIPANTES.length === 0) {
    showSorteoError('No hay participantes cargados para sortear.');
    return;
  }

  btnSortear.hidden = true;

  runCountdown(() => {
    showWinner(pickRandomWinner());
  });
});

btnRepetirSorteo.addEventListener('click', () => {
  resetSorteoView();
});

loadParticipantes();
