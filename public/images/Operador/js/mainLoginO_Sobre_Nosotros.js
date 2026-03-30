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
