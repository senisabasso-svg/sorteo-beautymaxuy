const WHATSAPP_NUMBER = '59897428888';

const landing = document.getElementById('landing');
const formulario = document.getElementById('formulario');
const btnParticipar = document.getElementById('btn-participar');
const btnVolver = document.getElementById('btn-volver');
const form = document.getElementById('participacion-form');

function showScreen(screen) {
  landing.classList.remove('screen--active');
  formulario.classList.remove('screen--active');
  screen.classList.add('screen--active');
}

btnParticipar.addEventListener('click', () => {
  showScreen(formulario);
  document.getElementById('nombre').focus();
});

btnVolver.addEventListener('click', () => {
  showScreen(landing);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

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
});
