document.addEventListener('DOMContentLoaded', () => {
    let dataLugares = []; // Aquí se almacenarán los datos del JSON
    const grid = document.getElementById('restaurant-grid');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const initialSampleCount = 4; // Número de elementos a mostrar en la vista inicial
  
    // Función para crear una "card" a partir de un objeto "lugar" en un <li>
    function createCard(lugar) {
      // Construir el HTML de la tarjeta en una variable usando template literals
      let miHTML = `<li class="restaurant-card">`;
      
      // Imagen (si existe)
      if (lugar.imagen) {
        miHTML += `<img src="${lugar.imagen}" alt="${lugar.nombre}" style="width:100%;">`;
      }
      
      // Nombre, descripción y tipo
      miHTML += `<h2>${lugar.nombre}</h2>
        <p>${lugar.descripcion}</p>
        <p>Tipo: ${lugar.tipo}</p>`;
      
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
  
      // Se desactiva la reconfiguración de Masonry, ya que se usará CSS Flexbox para el layout.
      // (El código de Masonry se ha eliminado o comentado)
    }
  
    // Carga los datos desde el archivo JSON
    fetch('lugares.json')
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