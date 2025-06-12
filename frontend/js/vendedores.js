// Event listeners para cerrar modales
document.addEventListener('DOMContentLoaded', () => {
    // Cerrar modal al hacer clic en "x"
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', cerrarModalVendedor);
    });

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modal-clientes-vendedores');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalVendedor();
            }
        });
    }

    // Cerrar modal al presionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModalVendedor();
        }
    });
});

/* -------------------------------------------------------------------------- */
// vendedores.js
// Constantes
const ENDPOINTVEN = '/api/vendedores';
const CONTENEDORVEN = 'contenidoVacio';

// Función para cargar el formulario
async function cargarFormularioVendedor() {
    try {
        const response = await fetch('/pages/form_create_vendedores.html');
        if (!response.ok) {
            throw new Error('Error al cargar el formulario');
        }
        
        const html = await response.text();
        const contenidoModal = document.getElementById('contenido-modal-lu');
        
        if (!contenidoModal) {
            throw new Error('No se encontró el contenedor para el formulario');
        }
        
        contenidoModal.innerHTML = html;
        
        // Mostrar el modal
        const modal = document.getElementById('modal-lu');
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar el formulario:', error);
        mostrarErrorVendedor('Error al cargar el formulario');
        throw error;
    }
}

// Función principal para cargar vendedores
async function cargarVendedores() {
    try {
        const response = await fetch(ENDPOINTVEN);
        const data = await response.json();
        mostrarVendedores(data);
    } catch (error) {
        mostrarErrorVendedor('Error al cargar vendedores');
    }
}

// Función para cargar datos de vendedor
async function cargarDatosVendedor(id) {
    try {
        const response = await fetch(`${ENDPOINTVEN}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del vendedor');
        }
        
        const vendedor = await response.json();
        
        // Llenar el formulario
        const form = document.getElementById('vendedorFormNew');
        if (!form) {
            throw new Error('Formulario no encontrado');
        }
        
        form.nombre.value = vendedor.nombre;
        form.direccion.value = vendedor.direccion;
        form.telefono.value = vendedor.telefono;
        form.email.value = vendedor.email;
        form.codVendedor.value = vendedor.codVendedor;
        
        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Editar Vendedor';
        }
        
        // Establecer el ID del vendedor en el formulario
        form.dataset.vendedorId = vendedor.idVendedor;
        
    } catch (error) {
        console.error('Error al cargar datos del vendedor:', error);
        mostrarErrorVendedor('Error al cargar datos del vendedor');
        throw error;
    }
}

// Función para mostrar vendedores
function mostrarVendedores(vendedores) {    
    const contenedor = document.getElementById(CONTENEDORVEN);
    contenedor.innerHTML = `
    <div class="cabezeraVacio">
        <span><img src="images/gestionarVendedores.png" alt="Vendedores"><h2>Gestionar Vendedores</h2></span>
        <button class="btn" onclick="abrirModalVendedor()"><img src="images/mas.png" alt="Vendedores">Nuevo Vendedor</button>
    </div>
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Código</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${vendedores.map(vendedor => filaVendedor(vendedor)).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Función para crear fila de vendedor
function filaVendedor(vendedor) {
    return `
        <tr>
            <td>${vendedor.nombre || 'N/A'}</td>
            <td>${vendedor.direccion || 'N/A'}</td>
            <td>${vendedor.telefono || 'N/A'}</td>
            <td>${vendedor.email || 'N/A'}</td>
            <td>${vendedor.codVendedor || 'N/A'}</td>
            <td>
                <button class="btn" onclick="abrirModalEditarVendedor(${vendedor.idVendedor})">Editar</button>
                <button class="btn-eliminar" onclick="abrirModalEliminarVendedor(${vendedor.idVendedor})">Eliminar</button>
            </td>
        </tr>
    `;
}

// Función para abrir modal
function abrirModalVendedor() {
    try {
        // Limpiar el formulario
        const form = document.getElementById('vendedorFormNew');
        if (form) {
            form.reset();
            form.dataset.vendedorId = '';
        }

        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Nuevo Vendedor';
        }

        // Cargar el formulario
        cargarFormularioVendedor();
    } catch (error) {
        console.error('Error al abrir modal:', error);
        mostrarErrorVendedor('Error al abrir el modal');
    }
}

// Función para abrir modal de edición
function abrirModalEditarVendedor(id) {
    try {
        // Limpiar el formulario y establecer el ID
        const form = document.getElementById('vendedorFormNew');
        if (form) {
            form.reset();
            form.dataset.vendedorId = id;
        }

        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Cargando datos...';
        }

        // Cargar el formulario
        cargarFormularioVendedor()
            .then(() => cargarDatosVendedor(id))
            .catch(error => {
                console.error('Error:', error);
                mostrarErrorVendedor('Error al cargar el formulario');
                cerrarModalVendedor();
            });
    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        mostrarErrorVendedor('Error al abrir el modal de edición');
    }
}

// Función para abrir modal de eliminación
function abrirModalEliminarVendedor(id) {
    try {
        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Confirmar eliminación';
        }

        // Cargar el modal de confirmación
        const contenidoModal = document.getElementById('contenido-modal-lu');
        if (contenidoModal) {
            contenidoModal.innerHTML = `
                <p>¿Está seguro que desea eliminar este vendedor?</p>
                <div class="botones-eliminar-modal">
                    <button id="btn-confirmar-eliminar" class="btn btn-primary" onclick="eliminarVendedor(${id})">Aceptar</button>
                    <button class="btn btn-secondary" onclick="cerrarModalVendedor()">Cancelar</button>
                </div>
            `;
        }

        // Mostrar el modal
        const modal = document.getElementById('modal-lu');
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al abrir modal de eliminación:', error);
        mostrarErrorVendedor('Error al abrir el modal de eliminación');
    }
}

// Función para cerrar modal
function cerrarModalVendedor() {
    const modal = document.getElementById('modal-lu');
    if (modal) {
        modal.style.display = 'none';
        
        // Limpiar el contenido del modal
        const contenidoModal = document.getElementById('contenido-modal-lu');
        if (contenidoModal) {
            contenidoModal.innerHTML = '';
        }
    }
}

// Función para eliminar vendedor
async function eliminarVendedor(id) {
    try {
        const response = await fetch(`${ENDPOINTVEN}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Mostrar mensaje dentro del modal
            const modalContent = document.getElementById('contenido-modal-lu');
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = 'modal-message success-message';
            mensajeDiv.textContent = 'Vendedor eliminado exitosamente';
            modalContent.appendChild(mensajeDiv);
            
            // Esperar 2 segundos antes de cerrar
            setTimeout(() => {
                window.cargarVendedores();
                cerrarModalVendedor();
            }, 2000);
        } else {
            throw new Error('Error al eliminar el vendedor');
        }
    } catch (error) {
        mostrarErrorVendedor(error.message);
        console.error('Error:', error);
    }
}

// Función para guardar vendedor
function guardarVendedor(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('vendedorFormNew');
        const vendedorId = form.dataset.vendedorId;
        
        const vendedor = {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            codVendedor: document.getElementById('codVendedor').value
        };

        const url = vendedorId ? `${ENDPOINTVEN}/${vendedorId}` : ENDPOINTVEN;
        const method = vendedorId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendedor)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el vendedor');
            }
            return response.json();
        })
        .then(() => {
            // Mostrar mensaje dentro del modal
            const modalContent = document.getElementById('contenido-modal-lu');
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = 'modal-message success-message';
            mensajeDiv.textContent = 'Vendedor guardado exitosamente';
            modalContent.appendChild(mensajeDiv);
            
            // Esperar 2 segundos antes de cerrar
            setTimeout(() => {
                cerrarModalVendedor();
                window.cargarVendedores();
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarErrorVendedor('Error al guardar el vendedor');
        });
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        mostrarErrorVendedor('Error al procesar el formulario');
    }
}

// Función para mostrar mensaje
function mostrarMensajeVendedor(mensaje) {
    const contenedor = document.getElementById(CONTENEDORVEN);
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'success-message';
    mensajeDiv.textContent = mensaje;
    contenedor.insertBefore(mensajeDiv, contenedor.firstChild);
    
    setTimeout(() => mensajeDiv.remove(), 5000);
}

// Función para mostrar error
function mostrarErrorVendedor(mensaje) {
    const contenedor = document.getElementById(CONTENEDORVEN);
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'error-message';
    mensajeDiv.textContent = mensaje;
    contenedor.insertBefore(mensajeDiv, contenedor.firstChild);
    
    setTimeout(() => mensajeDiv.remove(), 3000);
}

// Llamar a la función para cargar el módulo de vendedores
// No llamamos aquí, ya que se llama desde principal.js
// window.cargarVendedores();
window.cargarVendedores = cargarVendedores;
