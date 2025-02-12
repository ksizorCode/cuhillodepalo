document.addEventListener('DOMContentLoaded', () => {
  let dataLugares = []; // Aquí se almacenarán los datos del JSON
  const grid = document.getElementById('restaurant-grid');
  const searchInput = document.getElementById('search');
  const filterSelect = document.getElementById('filter');
  const initialSampleCount = 20; // Número de elementos a mostrar en la vista inicial

  // Función para crear una "card" a partir de un objeto "lugar" en un <li>
  function createCard(lugar) {
    // Se asume que cada objeto "lugar" tiene una propiedad única "id"
    let miHTML = `<li class="restaurant-card" data-id="${lugar.id}">`;
    
    // Imagen (si existe)
    if (lugar.imagen) {
      miHTML += `<img src="${lugar.imagen}" alt="${lugar.nombre}" style="width:100%;">`;
    }
    
    // Nombre, descripción y tipo
    miHTML += `<div class="info">
      <h2>${lugar.nombre}</h2>
      <div class="cosa">
        <p>${lugar.descripcion}</p>
        <p class="tipo">${lugar.tipo}</p>
      </div>
    </div>`;
    
    // Cierre del <li>
    miHTML += `</li>`;
    
    return miHTML;
  }

  // Función para renderizar las tarjetas según el filtro y búsqueda
  function renderCards() {
    // Elimina las tarjetas actuales
    grid.querySelectorAll('.restaurant-card').forEach(card => card.remove());

    // Obtiene el texto de búsqueda y el filtro seleccionado
    const searchQuery = searchInput.value.toLowerCase();
    const selectedFilter = filterSelect.value;

    // Filtra los datos según el nombre, descripción y tipo
    const filteredData = dataLugares.filter(lugar => {
      const matchSearch =
        lugar.nombre.toLowerCase().includes(searchQuery) ||
        lugar.descripcion.toLowerCase().includes(searchQuery);
      const matchFilter =
        selectedFilter === 'todos' ? true : lugar.tipo.toLowerCase() === selectedFilter;
      return matchSearch && matchFilter;
    });

    // Si es la vista inicial (sin búsqueda y con filtro "todos"), mostramos solo una muestra
    let dataToRender = filteredData;
    if (searchQuery === '' && selectedFilter === 'todos') {
      dataToRender = filteredData.slice(0, initialSampleCount);
    }

    // Crea y agrega un <li> por cada elemento a renderizar
    dataToRender.forEach(lugar => {
      const cardHTML = createCard(lugar);
      grid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Agrega event listener a cada tarjeta para redirigir a la página de detalles
    document.querySelectorAll('.restaurant-card').forEach(card => {
      card.addEventListener('click', () => {
        const restaurantId = card.getAttribute('data-id');
        // Redirige a detalles.html pasando el id en la URL
        window.location.href = `detalles.html?id=${restaurantId}`;
      });
    });
  }

  // Carga los datos desde el archivo JSON
  fetch('restaurantes.json')
    .then(response => response.json())
    .then(data => {
      dataLugares = data.lugares; // Se asume que el JSON tiene una propiedad "lugares"
      renderCards();
    })
    .catch(error => console.error('Error al cargar los datos:', error));

  // Añade event listeners para actualizar la lista al escribir o cambiar el filtro
  searchInput.addEventListener('input', renderCards);
  filterSelect.addEventListener('change', renderCards);
});