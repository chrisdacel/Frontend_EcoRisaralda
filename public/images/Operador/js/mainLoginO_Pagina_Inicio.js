// dropdown/menu hamburguesa

const toggleBtn = document.getElementById('img_dropdown');
  const menu = document.querySelector('.dropdown-info');

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  // Cierra el menú al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (!toggleBtn.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove('show');
    }
  });
  
// fin dropdown/menu hamburguesa


// Dropdown Busqueda
// se le da valor al elemento buscador y al input
const search = document.getElementById('buscador');
const dropdown = document.getElementById('search');

// se le agrega al boton un eventoq ue se activa cuando se hace click
search.addEventListener('click', () => {
  // esto valida el display del contendor del buscador cmabiando entre none y block
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  dropdown.style.opacity = dropdown.style.opacity === '1' ? '0' : '1';
});

// Fin dropdown busqueda

// flecha de regreso

// se le agrega a la pagina un evento cuando se hace scroll
window.onscroll = function() {
  // se toma el valor del elemento boton Arriba para trabajar con el
  const btn = document.getElementById("botonArriba");
  // condicional que valida su aparicion y desaparicion en la pagina
  // el boton se activa cuando se a escroleado como minimo 100px
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

// Volver arriba al hacer clic
document.getElementById("botonArriba").addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    // scroll suave
    behavior: "smooth"
  });
});

// fin flecha de regreso

// Slider_01/populares
const contenedor_slider = document.querySelector('.info_content');
const atras = document.getElementById('atras_btn');
const adelante = document.getElementById('adelante_btn');
// lista que almacenas todos los elementos con calse visible
const elementos=document.querySelectorAll('.visible');
// toma el valor de ancho de el elemento en la posicion 0 de la lista de elementos
const anchoItem = elementos[0].offsetWidth;

let indice = 0;
const visibleItems= 3;
const totalItems= document.querySelectorAll('.visible').length;
// para el auto-play
let intervalId;

// Función central: mueve el contenedor slider y actualiza las flechas
function actualizarCarousel() {
  // Mueve el carrusel
  const movimiento = -(indice * anchoItem);
  contenedor_slider.style.transform = `translateX(${movimiento}px)`;

  // Activa/desactiva flechas según posición
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

// Función para avanzar un paso
function goNext() {
  if (indice < totalItems - visibleItems) {
    indice++;
    actualizarCarousel();
  } else {
    // al llegar al final, detiene auto-play
    clearInterval(intervalId); 
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

// Iniciar auto-play cada 5 segundos o 5000 milisegundos
intervalId = setInterval(goNext, 5000);

// Primera llamada para configurar estado inicial
actualizarCarousel();

// fin slider_01/populares


//slider_02/Eventos
// Seleccionamos todos los bloques .event
const eventos    = document.querySelectorAll('.event');
// seleccionamos todos los elementos llamados dot 
const dots       = document.querySelectorAll('.dot');
// seleccionamos las flechas de navegacion
const nextBtn    = document.querySelector('.next');
const prevBtn    = document.querySelector('.prev');
// seleccionamos el indice con que vamos a trabajar
let indice_02    = 0;
// guardamos aquí el setInterval
let timer_02;    

function CambiarImagen(n) {
  // quitamos active de la slide y dot actual
  eventos[indice_02].classList.remove('active');
  dots[indice_02].classList.remove('active');
  // calculamos nuevo índice
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