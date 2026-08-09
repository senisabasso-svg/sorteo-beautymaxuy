const WHATSAPP_NUMBER = '59897428888';

const landing = document.getElementById('landing');
const formulario = document.getElementById('formulario');
const exito = document.getElementById('exito');
const btnParticipar = document.getElementById('btn-participar');
const btnVolver = document.getElementById('btn-volver');
const btnInicio = document.getElementById('btn-inicio');
const form = document.getElementById('participacion-form');
const formError = document.getElementById('form-error');

const screens = [landing, formulario, exito];

function showScreen(screen) {
  screens.forEach((item) => item.classList.remove('screen--active'));
  screen.classList.add('screen--active');
}

function setError(message) {
  if (!message) {
    formError.hidden = true;
    formError.textContent = '';
    return;
  }
  formError.hidden = false;
  formError.textContent = message;
}

btnParticipar.addEventListener('click', () => {
  showScreen(formulario);
  document.getElementById('nombre').focus();
});

btnVolver.addEventListener('click', () => {
  setError('');
  showScreen(landing);
});

btnInicio.addEventListener('click', () => {
  form.reset();
  setError('');
  showScreen(landing);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  setError('');

  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const celular = document.getElementById('celular').value.trim();

  const mensaje = [
    '*Participante desde web*',
    '',
    `*Nombre:* ${nombre}`,
    `*Dirección:* ${direccion}`,
    `*Ciudad:* ${ciudad}`,
    `*Celular:* ${celular}`,
  ].join('\n');

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  showScreen(exito);
});
