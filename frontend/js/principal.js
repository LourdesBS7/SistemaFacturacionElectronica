document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Mostrar información del usuario
    const userNameElement = document.querySelector('.nombre-usuario');
    userNameElement.textContent = user.nombre || 'Usuario';
    
    const tipoUsuarioElement = document.querySelector('#tipo-usuario');
    tipoUsuarioElement.textContent = user.tipo || 'Usuario';

    // Manejar botón de cerrar sesión
    const logoutButton = document.querySelector('.btn-salir');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    }

    // Manejar clics en enlaces del menú
    const menuLinks = document.querySelectorAll('.nav-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('href');
            switch (target) {
                case '#facturacion':
                    crearFactura();
                    break;
                case '#clientes':
                    cargarClientes();
                    break;
                case '#facturas':
                    cargarFacturas();
                    break;
                case '#categorias':
                    cargarCategorias();
                    break;
                case '#productos':
                    cargarProductos();
                    break;
                case '#clientes':
                    cargarClientes();
                    break;
                case '#vendedores':
                    cargarVendedores();
                    break;
            }
        });
    });
});

// async function cargarClientes() {
//     try {
//         const response = await fetch('/api/clientes');
//         if (!response.ok) {
//             throw new Error('Error al cargar clientes');
//         }
//         const data = await response.json();
        
//         const contenidoVacio = document.getElementById('contenidoVacio');
//         contenidoVacio.innerHTML = `
//             <h2>Clientes</h2>
//             <div class="table-container">
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>Nombre</th>
//                             <th>Documento</th>
//                             <th>Email</th>
//                             <th>Teléfono</th>
//                             <th>Dirección</th>
//                             <th>Acciones</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.map(cliente => `
//                             <tr>
//                                 <td>${cliente.nombre}</td>
//                                 <td>${cliente.documento}</td>
//                                 <td>${cliente.email}</td>
//                                 <td>${cliente.telefono}</td>
//                                 <td>${cliente.direccion}</td>
//                                 <td>
//                                     <button class="btn btn-primary" onclick="editarCliente(${cliente.id})">Editar</button>
//                                     <button class="btn btn-secondary" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
//                                 </td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>
//         `;
//     } catch (error) {
//         console.error('Error al cargar clientes:', error);
//         showError('Error al cargar clientes: ' + error.message);
//     }
// }


// async function cargarProductos() {
//     try {
//         const response = await fetch('/api/productos');
//         if (!response.ok) {
//             throw new Error('Error al cargar productos');
//         }
//         const data = await response.json();
        
//         const contenidoVacio = document.getElementById('contenidoVacio');
//         contenidoVacio.innerHTML = `
//             <h2>Productos</h2>
//             <div class="table-container">
//                 <table class="table">
//                     <thead>
//                         <tr>
//                             <th>Código</th>
//                             <th>Nombre</th>
//                             <th>Categoría</th>
//                             <th>Precio</th>
//                             <th>Stock</th>
//                             <th>Acciones</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.map(producto => `
//                             <tr>
//                                 <td>${producto.codigo}</td>
//                                 <td>${producto.nombre}</td>
//                                 <td>${producto.categoria.nombre}</td>
//                                 <td>${producto.precio}</td>
//                                 <td>${producto.stock}</td>
//                                 <td>
//                                     <button class="btn btn-primary" onclick="editarProducto(${producto.id})">Editar</button>
//                                     <button class="btn btn-secondary" onclick="eliminarProducto(${producto.id})">Eliminar</button>
//                                 </td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>
//         `;
//     } catch (error) {
//         console.error('Error al cargar productos:', error);
//         showError('Error al cargar productos: ' + error.message);
//     }
// }

/*async function cargarUsuarios() {
    try {
        const response = await fetch('/api/usuarios');
        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }
        const data = await response.json();
        
        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <h2>Usuarios</h2>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(usuario => `
                            <tr>
                                <td>${usuario.nombre}</td>
                                <td>${usuario.email}</td>
                                <td>${usuario.tipo}</td>
                                <td>${usuario.estado}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="editarUsuario(${usuario.id})">Editar</button>
                                    <button class="btn btn-secondary" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        showError('Error al cargar usuarios: ' + error.message);
    }
}

async function cargarVendedores() {
    try {
        const response = await fetch('/api/vendedores');
        if (!response.ok) {
            throw new Error('Error al cargar vendedores');
        }
        const data = await response.json();
        
        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <h2>Vendedores</h2>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(vendedor => `
                            <tr>
                                <td>${vendedor.nombre}</td>
                                <td>${vendedor.documento}</td>
                                <td>${vendedor.email}</td>
                                <td>${vendedor.telefono}</td>
                                <td>${vendedor.estado}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="editarVendedor(${vendedor.id})">Editar</button>
                                    <button class="btn btn-secondary" onclick="eliminarVendedor(${vendedor.id})">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar vendedores:', error);
        showError('Error al cargar vendedores: ' + error.message);
    }
}

async function cargarCategorias() {
    try {
        const response = await fetch('/api/categorias');
        if (!response.ok) {
            throw new Error('Error al cargar categorías');
        }
        const data = await response.json();
        
        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <h2>Categorías</h2>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(categoria => `
                            <tr>
                                <td>${categoria.codigo}</td>
                                <td>${categoria.nombre}</td>
                                <td>${categoria.descripcion}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="editarCategoria(${categoria.id})">Editar</button>
                                    <button class="btn btn-secondary" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
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

function showError(message) {
    const contenidoVacio = document.getElementById('contenidoVacio');
    contenidoVacio.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

// Funciones para manejar modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Funciones CRUD
async function editarCliente(id) {
    try {
        const response = await fetch(`/api/clientes/${id}`);
        const cliente = await response.json();
        openModal('editarClienteModal');
        // Llenar el formulario con los datos del cliente
    } catch (error) {
        console.error('Error al editar cliente:', error);
        showError('Error al editar cliente');
    }
}

async function eliminarCliente(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
            const response = await fetch(`/api/clientes/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                cargarClientes();
            } else {
                showError('Error al eliminar cliente');
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            showError('Error al eliminar cliente');
        }
    }
}*/

// Implementar funciones similares para los otros CRUDs (editarFactura, eliminarFactura, etc.)