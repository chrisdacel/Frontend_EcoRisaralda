// Dropdown Busqueda
const search = document.getElementById('buscador');
const dropdown = document.getElementById('search');

search.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  dropdown.style.opacity = dropdown.style.opacity === '1' ? '0' : '1';
});

// Fin dropdown busqueda

// Slider_01/populares
const contenedor_slider = document.querySelector('.info_content');
const atras = document.getElementById('atras_btn');
const adelante = document.getElementById('adelante_btn');
// lista que almacenas todos los elementos con clse visible
const elementos=document.querySelectorAll('.visible');
// toma el valor de ancho de el elemento en la posicion 0 de la lista de elementos
const anchoItem = elementos[0].offsetWidth;

let indice = 0;
const visibleItems= 3;
const totalItems= document.querySelectorAll('.visible').length;
let intervalId;// para el auto-play

// Función central: mueve el contenedor slider y actualiza las flechas
function actualizarCarousel() {
  // Mueve el carrusel
  const movimiento = -(indice * anchoItem);
  contenedor_slider.style.transform = `translateX(${movimiento}px)`;

  // 2) Activa/desactiva flechas según posición
  if (indice === 0) {
    atras.classList.add('desactivado');
  } else {
    atras.classList.remove('desactivado');
  }

  if (indice >= totalItems - visibleItems) {
    adelante.classList.add('desactivado');
  } else {
    adelante.classList.remove('desactivado');
  }
}

// Función para avanzar un paso (manual o auto)
function goNext() {
  if (indice < totalItems - visibleItems) {
    indice++;
    actualizarCarousel();
  } else {
    clearInterval(intervalId); // al llegar al final, detiene auto-play
  }
}

// Función para retroceder un paso
function goPrev() {
  if (indice > 0) {
    indice--;
    actualizarCarousel();
  }
}

// Eventos manuales
adelante.addEventListener('click', goNext);
atras.addEventListener('click', goPrev);

// Iniciar auto-play cada 3s
intervalId = setInterval(goNext, 3000);

// Primera llamada para configurar estado inicial
actualizarCarousel();

// fin slider_01/populares

//slider_02/Eventos

// Seleccionamos todos los bloques .event
const eventos    = document.querySelectorAll('.event');
const dots       = document.querySelectorAll('.dot');
const nextBtn    = document.querySelector('.next');
const prevBtn    = document.querySelector('.prev');
let indice_02    = 0;
let timer_02;    // guardamos aquí el setInterval

function CambiarImagen(n) {
  // quitamos active de la slide y dot actual
  eventos[indice_02].classList.remove('active');
  dots[indice_02].classList.remove('active');
  // calculamos nuevo índice (circular)
  indice_02 = (n + eventos.length) % eventos.length;
  // añadimos active a la slide y dot nuevo
  eventos[indice_02].classList.add('active');
  dots[indice_02].classList.add('active');
}

// autoplay: avanza cada 5s
function startAutoplay() {
  timer_02 = setInterval(() => {
    CambiarImagen(indice_02 + 1);
  }, 5000);
}

// reinicia el autoplay tras interacción
function resetAutoplay() {
  clearInterval(timer_02);
  startAutoplay();
}

// flechas
nextBtn.addEventListener('click', () => {
  CambiarImagen(indice_02 + 1);
  resetAutoplay();
});

prevBtn.addEventListener('click', () => {
  CambiarImagen(indice_02 - 1);
  resetAutoplay();
});

// dots
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    CambiarImagen(i);
    resetAutoplay();
  });
});

// arrancamos el autoplay al cargar
startAutoplay();

// Fin slider_02/Eventos