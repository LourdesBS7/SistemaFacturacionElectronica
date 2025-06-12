async function cargarCategorias() {
    try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
            throw new Error('Error al cargar categorías');
        }
        const data = await response.json();
        console.log('Datos recibidos del servidor:', data);
        
        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <h2>Categorías</h2>
            <button class="btn btn-success" onclick="mostrarModalAgregarCategoria()">Agregar Categoría</button>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(categoria => `
                            <tr>
                                <td>${categoria.nombre}</td>
                                <td>${categoria.descripcion}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="abrirModalEditar(${categoria.idCategoria})">Editar</button>
                                    <button class="btn btn-danger" onclick="abrirModalEliminar(${categoria.idCategoria})">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        showError('Error al cargar categorías: ' + error.message);
    }
}

// Función para mostrar mensaje de error
function showError(mensaje) {
    const contenedor = document.getElementById('contenidoVacio');
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'error-message';
    mensajeDiv.textContent = mensaje;
    contenedor.insertBefore(mensajeDiv, contenedor.firstChild);
    
    setTimeout(() => mensajeDiv.remove(), 5000);
}

// var asente = "asc";

async function abrirModalEditar(id) {
    try {
        console.log('Abriendo modal de edición para ID:', id);
        // Esperar un momento para asegurar que los elementos estén disponibles
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Obtener el modal
        const modal = document.getElementById('myModal');
        const titulo = document.getElementById('titulo-modal-cris');
        const contenido = document.getElementById('contenido-modal-cris');
        
        if (!modal || !titulo || !contenido) {
            throw new Error('Elementos del modal no encontrados');
        }
        
        // Actualizar título
        titulo.textContent = 'Editar Categoría';
        
        // Limpiar el contenido
        contenido.innerHTML = '';
        
        // Obtener los datos de la categoría antes de mostrar el modal
        const response = await fetch(`/api/categorias/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos de la categoría');
        }
        
        const categoria = await response.json();
        
        // Crear el formulario
        const formHtml = `
            <form id="categoria-form">
                <input type="hidden" id="categoria-id" value="${categoria.idCategoria}">
                <div class="form-group">
                    <label for="categoria-nombre">Nombre:</label>
                    <input type="text" id="categoria-nombre" class="form-control" value="${categoria.nombre}" required>
                </div>
                <div class="form-group">
                    <label for="categoria-descripcion">Descripción:</label>
                    <textarea id="categoria-descripcion" class="form-control">${categoria.descripcion}</textarea>
                </div>
                <button type="button" id="btn-guardar" class="btn btn-primary">Guardar Cambios</button>
            </form>
        `;
        
        // Insertar el formulario en el contenido
        contenido.innerHTML = formHtml;
        
        // Mostrar el modal
        modal.style.display = 'block';
        
        // Configurar el evento del botón de guardar
        document.getElementById('btn-guardar').onclick = actualizarCategoria;
        
    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        showError('Error al abrir el modal de edición');
    }
}

// Función para actualizar una categoría existente
async function actualizarCategoria(event) {
    try {
        event.preventDefault();
        
        // Obtener el formulario
        const form = document.getElementById('categoria-form');
        if (!form) {
            throw new Error('Formulario no encontrado');
        }
        
        // Obtener el ID
        const idElement = document.getElementById('categoria-id');
        if (!idElement) {
            throw new Error('ID de categoría no encontrado');
        }
        
        const id = parseInt(idElement.value);
        if (!id || isNaN(id)) {
            throw new Error('ID de categoría no válido');
        }
        
        // Obtener los valores del formulario
        const nombre = document.getElementById('categoria-nombre').value.trim();
        const descripcion = document.getElementById('categoria-descripcion').value.trim();
        
        if (!nombre) {
            throw new Error('Por favor ingrese un nombre para la categoría');
        }
        
        // Hacer la petición PUT
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                descripcion
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la categoría');
        }
        
        // Mostrar mensaje de éxito
        showError('Categoría actualizada exitosamente');
        
        // Cerrar el modal y recargar la lista
        const modal = document.getElementById('myModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        cargarCategorias();
        
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        showError(error.message);
    }
}

// Función para mostrar modal de nueva categoría
function mostrarModalAgregarCategoria() {
    const formHtml = `
        <form id="categoria-form">
            <div class="form-group">
                <label for="categoria-nombre">Nombre:</label>
                <input type="text" id="categoria-nombre" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="categoria-descripcion">Descripción:</label>
                <textarea id="categoria-descripcion" class="form-control"></textarea>
            </div>
            <button type="button" id="btn-guardar" class="btn btn-primary">Guardar</button>
        </form>
    `;
    
    abrirModal('Nueva Categoría', formHtml);
    
    // Configurar el evento del botón de guardar
    document.getElementById('btn-guardar').onclick = guardarCategoria;
}

// Función para abrir modal de confirmación de eliminación
function abrirModalEliminar(id) {
    const modal = document.getElementById('myModal');
    const titulo = document.getElementById('titulo-modal-cris');
    const contenido = document.getElementById('contenido-modal-cris');
    
    if (!modal || !titulo || !contenido) {
        showError('Error: Elementos del modal no encontrados');
        return;
    }
    
    titulo.textContent = 'Confirmar Eliminación';
    
    // Crear el contenido del modal de confirmación
    const confirmHtml = `
        <div class="confirm-content">
            <p>¿Está seguro que desea eliminar esta categoría?</p>
            <div class="btn-group">
                <button type="button" class="btn btn-danger" id="btn-confirmar-eliminar">Eliminar</button>
                <button type="button" class="btn btn-secondary" onclick="cerrarModalProductoCategoria()">Cancelar</button>
            </div>
        </div>
    `;
    
    contenido.innerHTML = confirmHtml;
    
    // Configurar el evento del botón de confirmar eliminación
    const btnConfirmar = document.getElementById('btn-confirmar-eliminar');
    if (btnConfirmar) {
        btnConfirmar.onclick = () => eliminarCategoria(id);
    }
    
    modal.style.display = 'block';
}

// Función para eliminar una categoría
async function eliminarCategoria(id) {
    try {
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la categoría');
        }

        // Mostrar mensaje de éxito
        showError('Categoría eliminada exitosamente');
        
        // Cerrar el modal y recargar la lista
        const modal = document.getElementById('myModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        cargarCategorias();
        
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        showError(error.message);
    }
}

async function guardarCategoria() {
    const nombre = document.getElementById('categoria-nombre').value;
    const descripcion = document.getElementById('categoria-descripcion').value;
    
    if (!nombre) {
        showError('Por favor ingrese un nombre para la categoría');
        return;
    }
    
    try {
        const response = await fetch('/api/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                descripcion
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al guardar la categoría');
        }
        
        // Cerrar el modal
        cerrarModalProductoCategoria();
        
        // Recargar las categorías
        cargarCategorias();
    } catch (error) {
        console.error('Error al guardar la categoría:', error);
        showError('Error al guardar la categoría: ' + error.message);
    }
}

var modal = document.getElementById("myModal");
var openModalBtn = document.getElementById("openModalBtn");
var closeBtn = document.getElementsByClassName("close")[0];

mostrar = function () {
  modal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
