// Event listeners para cerrar modales
document.addEventListener('DOMContentLoaded', () => {
    // Cerrar modal al hacer clic en "x"
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', cerrarModalCliente);
    });

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modal-clientes-vendedores');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalCliente();
            }
        });
    }

    // Cerrar modal al presionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModalCliente();
        }
    });
});

/* -------------------------------------------------------------------------- */
// clientes.js
// Constantes
const ENDPOINTCLI = '/api/clientes';
const CONTENEDORCLI = 'contenidoVacio';

// Función para cargar el formulario
async function cargarFormularioCliente() {
    try {
        // Asegurarse de que la ruta sea correcta
        const response = await fetch('../pages/form_create_clientes.html');
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
        mostrarErrorCliente('Error al cargar el formulario');
        throw error;
    }
}

// Funciones principales
async function cargarClientes() {
    try {
        const response = await fetch(ENDPOINTCLI);
        const data = await response.json();
        mostrarClientes(data);
    } catch (error) {
        mostrarErrorCliente('Error al cargar clientes');
    }
}
/*  ...........................*/
async function cargarDatosCliente(id) {
    try {
        const response = await fetch(`${ENDPOINTCLI}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del cliente');
        }
        
        const cliente = await response.json();
        
        // Llenar el formulario
        const form = document.getElementById('clienteFormNew');
        if (!form) {
            throw new Error('Formulario no encontrado');
        }
        
        form.nombre.value = cliente.nombre;
        form.NIT.value = cliente.NIT;
        form.direccion.value = cliente.direccion;
        form.telefono.value = cliente.telefono;
        form.email.value = cliente.email;
        
        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Editar Cliente';
        }
        
        // Establecer el ID del cliente en el formulario
        form.dataset.clienteId = cliente.idCliente;
        
    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
        mostrarErrorCliente('Error al cargar datos del cliente');
        throw error;
    }
}


function mostrarClientes(clientes) {
    const contenedor = document.getElementById(CONTENEDORCLI);
    contenedor.innerHTML = `
    <div class="cabezeraVacio">
        <span><img src="images/clientes.png" alt="Clientes"><h2>GestionarClientes</h2></span>
        <button class="btn" onclick="abrirModalCliente()"><img src="images/mas.png" alt="Clientes">Nuevo Cliente</button>
    </div>
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>NIT</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes.map(cliente => filaCliente(cliente)).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function filaCliente(cliente) {
    return `
        <tr>
            <td>${cliente.nombre || 'N/A'}</td>
            <td>${cliente.NIT || 'N/A'}</td>
            <td>${cliente.direccion || 'N/A'}</td>
            <td>${cliente.telefono || 'N/A'}</td>
            <td>${cliente.email || 'N/A'}</td>
            <td>
                <button class="btn" onclick="abrirModalEditarCliente(${cliente.idCliente})">Editar</button>
                <button class="btn-eliminar" onclick="abrirModalEliminarCliente(${cliente.idCliente})">Eliminar</button>
            </td>
        </tr>
    `;
}

function abrirModalCliente() {
    try {
        // Limpiar el formulario
        const form = document.getElementById('clienteFormNew');
        if (form) {
            form.reset();
            form.dataset.clienteId = '';
        }

        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Nuevo Cliente';
        }

        // Cargar el formulario
        cargarFormularioCliente();
    } catch (error) {
        console.error('Error al abrir modal:', error);
        mostrarErrorCliente('Error al abrir el modal');
    }
}

function abrirModalEditarCliente(id) {
    try {
        // Limpiar el formulario y establecer el ID
        const form = document.getElementById('clienteFormNew');
        if (form) {
            form.reset();
            form.dataset.clienteId = id;
        }

        // Actualizar el título del modal
        const tituloModal = document.getElementById('titulo-modal-lu');
        if (tituloModal) {
            tituloModal.textContent = 'Cargando datos...';
        }

        // Cargar el formulario
        cargarFormularioCliente()
            .then(() => cargarDatosCliente(id))
            .catch(error => {
                console.error('Error:', error);
                mostrarErrorCliente('Error al cargar el formulario');
                cerrarModalCliente();
            });
    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        mostrarErrorCliente('Error al abrir el modal de edición');
    }
}


function abrirModalEliminarCliente(id) {
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
                <p>¿Está seguro que desea eliminar este cliente?</p>
                <div class="botones-eliminar-modal">
                    <button id="btn-confirmar-eliminar" class="btn btn-primary" onclick="eliminarCliente(${id})">Aceptar</button>
                    <button class="btn btn-secondary" onclick="cerrarModalCliente()">Cancelar</button>
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
        mostrarErrorCliente('Error al abrir el modal de eliminación');
    }
}

function cerrarModalCliente() {
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

async function eliminarCliente(id) {
    try {
        const response = await fetch(`${ENDPOINTCLI}/${id}`, {
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
            mensajeDiv.textContent = 'Cliente eliminado exitosamente';
            modalContent.appendChild(mensajeDiv);
            
            // Esperar 2 segundos antes de cerrar
            setTimeout(() => {
                cargarClientes();
                cerrarModalCliente();
            }, 2000);
        } else {
            throw new Error('Error al eliminar el cliente');
        }
    } catch (error) {
        mostrarError(error.message);
        console.error('Error:', error);
    }
}

function guardarCliente(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('clienteFormNew');
        const clienteId = form.dataset.clienteId;
        
        const cliente = {
            nombre: document.getElementById('nombre').value,
            NIT: document.getElementById('NIT').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value
        };

        const url = clienteId ? `${ENDPOINTCLI}/${clienteId}` : ENDPOINTCLI;
        const method = clienteId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el cliente');
            }
            return response.json();
        })
        .then(() => {
            // Mostrar mensaje dentro del modal
            const modalContent = document.getElementById('contenido-modal-lu');
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = 'modal-message success-message';
            mensajeDiv.textContent = 'Cliente guardado exitosamente';
            modalContent.appendChild(mensajeDiv);
            
            // Esperar 2 segundos antes de cerrar
            setTimeout(() => {
                cerrarModalCliente();
                cargarClientes();
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarErrorCliente('Error al guardar el cliente');
        });
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        mostrarErrorCliente('Error al procesar el formulario');
    }
}

function mostrarMensajeCliente(mensaje) {
    const contenedor = document.getElementById(CONTENEDORCLI);
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'success-message';
    mensajeDiv.textContent = mensaje;
    contenedor.insertBefore(mensajeDiv, contenedor.firstChild);
    
    setTimeout(() => mensajeDiv.remove(), 5000);
}

function mostrarErrorCliente(mensaje) {
    const contenedor = document.getElementById(CONTENEDORCLI);
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'error-message';
    mensajeDiv.textContent = mensaje;
    contenedor.insertBefore(mensajeDiv, contenedor.firstChild);
    
    setTimeout(() => mensajeDiv.remove(), 3000);
}

window.cargarClientes = cargarClientes;
