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


// slider seccion_02 /primicia

const slider = document.querySelector('.slider-center-large');
const slides = Array.from(slider.querySelectorAll('.item'));
let current = 0;

function updateSlider() {
  const total = slides.length;
  slides.forEach(s => s.classList.remove('small-left','small-right','large','small'));

  const left  = (current - 1 + total) % total;
  const center= current;
  const right = (current + 1) % total;

  slides[left].classList.add('small-left', 'small');
  slides[center].classList.add('large');
  slides[right].classList.add('small-right', 'small');
}

updateSlider();
setInterval(() => {
  current = (current + 1) % slides.length;
  updateSlider();
}, 6000);

//  fin slider seccion_02/primicia


// sliders seccion_02

document.querySelectorAll('.slider').forEach(slider => {
    const contenedorItems = slider.querySelector('.contenedor_items');
    const btnPrev        = slider.querySelector('.atras_btn');
    const btnNext        = slider.querySelector('.adelante_btn');
    const items          = slider.querySelectorAll('.visible');
    const visibleCount   = 4;
    let indice           = 0;
    const totalItems     = items.length;
    const anchoItem      = items[0].offsetWidth;
  
    function actualizar() {
      const desplaz = -(indice * anchoItem);
      contenedorItems.style.transform = `translateX(${desplaz}px)`;
      if (indice === 0) {
        btnPrev.classList.add('desactivado');
      } else {
        btnPrev.classList.remove('desactivado');
      }
    
      if (indice >= totalItems - visibleCount) {
        btnNext.classList.add('desactivado');
      } else {
        btnNext.classList.remove('desactivado');
      }
    }
  
    btnNext.addEventListener('click', () => {
      if (indice < totalItems - visibleCount) {
        indice++;
        actualizar();
      }
    });
    btnPrev.addEventListener('click', () => {
      if (indice > 0) {
        indice--;
        actualizar();
      }
    });
  
    setInterval(() => {
      if (indice < totalItems - visibleCount) {
        indice++;
      } else {
        clearInterval;
      }
      actualizar();
    }, 10000);
  
    // Estado inicial
    actualizar();
  });
// fin slider_01/seccion_02
