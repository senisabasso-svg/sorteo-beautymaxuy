const ADMIN_USER = 'admin';
const ADMIN_PASS = 'soldada';
const SESSION_KEY = 'sorteo_admin_auth';

const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');
const totalParticipantes = document.getElementById('total-participantes');
const clientesList = document.getElementById('clientes-list');
const clientesEmpty = document.getElementById('clientes-empty');
const tabButtons = document.querySelectorAll('.tabs__btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const btnSortear = document.getElementById('btn-sortear');
const countdown = document.getElementById('countdown');
const ganador = document.getElementById('ganador');
const btnRepetirSorteo = document.getElementById('btn-repetir-sorteo');
const sorteoError = document.getElementById('sorteo-error');

function showLoginError(message) {
  loginError.hidden = !message;
  loginError.textContent = message || '';
}

function showSorteoError(message) {
  sorteoError.hidden = !message;
  sorteoError.textContent = message || '';
}

function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

function setAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(SESSION_KEY, '1');
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }

  loginScreen.hidden = value;
  dashboard.hidden = !value;
  btnLogout.hidden = !value;
}

function loadParticipantes() {
  totalParticipantes.textContent = '0';
  clientesList.innerHTML = '';
  clientesEmpty.hidden = false;
  clientesEmpty.textContent =
    'Los participantes llegan por WhatsApp. Este panel ya no consulta el backend.';
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

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showLoginError('');

  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value;

  if (usuario !== ADMIN_USER || clave !== ADMIN_PASS) {
    showLoginError('Usuario o clave incorrectos.');
    return;
  }

  setAuthenticated(true);
  loadParticipantes();
});

btnLogout.addEventListener('click', () => {
  setAuthenticated(false);
  loginForm.reset();
});

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
  showSorteoError(
    'El sorteo automático está desactivado. Los participantes llegan por WhatsApp.'
  );
});

btnRepetirSorteo.addEventListener('click', () => {
  resetSorteoView();
});

if (isAuthenticated()) {
  setAuthenticated(true);
  loadParticipantes();
} else {
  setAuthenticated(false);
}
