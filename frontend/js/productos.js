async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        const data = await response.json();
        console.log('Datos recibidos del servidor:', data);

        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <h2>Productos</h2>
            <button class="btn btn-success" onclick="mostrarModalAgregarProducto()">Agregar Producto</button>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Marca</th>
                            <th>Talla</th>
                            <th>Género</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(producto => `
                            <tr>
                                <td>
                                    <img src="${producto.imagen}" 
                                         alt="${producto.nombre}" 
                                         width="50" 
                                         height="50">
                                </td>
                                <td>${producto.nombre || ''}</td>
                                <td>${producto.descripcion || ''}</td>
                                <td>${producto.precioUnitario ? producto.precioUnitario.toFixed(2) : '0.00'}</td>
                                <td>${producto.marca || ''}</td>
                                <td>${producto.tallaPrenda || ''}</td>
                                <td>${producto.genero || ''}</td>
                                <td>${producto.stock || 0}</td>
                                <td>${producto.categoria ? producto.categoria.nombre : ''}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="abrirModalEditarProducto(${producto.idProducto})">Editar</button>
                                    <button class="btn btn-danger" onclick="abrirModalEliminarProducto(${producto.idProducto})">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showError('Error al cargar productos: ' + error.message);
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

async function abrirModalEditarProducto(id) {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const modal = document.getElementById('myModal');
        const titulo = document.getElementById('titulo-modal-cris');
        const contenido = document.getElementById('contenido-modal-cris');

        if (!modal || !titulo || !contenido) {
            throw new Error('Elementos del modal no encontrados');
        }

        titulo.textContent = 'Editar Producto';
        contenido.innerHTML = '';

        const response = await fetch(`/api/productos/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del producto');
        }

        const producto = await response.json();

        const formHtml = `
            <form id="producto-form">
                <input type="hidden" id="producto-id" value="${producto.idProducto}">
                <div class="form-group">
                    <label for="producto-imagen">Imagen:</label>
                    <input type="file" id="producto-imagen" class="form-control" accept="image/*">
                    <div id="imagen-preview" style="margin-top: 10px;">
                        ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" width="100" height="100">` : ''}
                    </div>
                </div>
                <div class="form-group">
                    <label for="producto-nombre">Nombre:</label>
                    <input type="text" id="producto-nombre" class="form-control" value="${producto.nombre}" required>
                </div>
                <div class="form-group">
                    <label for="producto-descripcion">Descripción:</label>
                    <textarea id="producto-descripcion" class="form-control">${producto.descripcion || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="producto-precio">Precio Unitario:</label>
                    <input type="number" id="producto-precio" class="form-control" value="${producto.precioUnitario}" required>
                </div>
                <div class="form-group">
                    <label for="producto-marca">Marca:</label>
                    <input type="text" id="producto-marca" class="form-control" value="${producto.marca || ''}">
                </div>
                <div class="form-group">
                    <label for="producto-talla">Talla:</label>
                    <input type="text" id="producto-talla" class="form-control" value="${producto.tallaPrenda || ''}">
                </div>
                <div class="form-group">
                    <label for="producto-genero">Género:</label>
                    <select id="producto-genero" class="form-control">
                        <option value="">Seleccione...</option>
                        <option value="Masculino" ${producto.genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                        <option value="Femenino" ${producto.genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
                        <option value="Unisex" ${producto.genero === 'Unisex' ? 'selected' : ''}>Unisex</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="producto-stock">Stock:</label>
                    <input type="number" id="producto-stock" class="form-control" value="${producto.stock}" required>
                </div>
                <div class="form-group">
                    <label for="producto-categoria">Categoría:</label>
                    <select id="producto-categoria" class="form-control">
                        ${await obtenerCategoriasSelect(producto.categoria)}
                    </select>
                </div>
                
                <button type="button" id="btn-guardar" class="btn btn-primary">Guardar Cambios</button>
            </form>
        `;

        contenido.innerHTML = formHtml;
        modal.style.display = 'block';
        document.getElementById('btn-guardar').onclick = actualizarProducto;

    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        showError('Error al abrir el modal de edición');
    }
}

async function actualizarProducto(event) {
    try {
        event.preventDefault();

        const form = document.getElementById('producto-form');
        if (!form) throw new Error('Formulario no encontrado');

        const id = parseInt(document.getElementById('producto-id').value);
        if (!id || isNaN(id)) throw new Error('ID de producto no válido');

        // Obtener valores del formulario
        const nombre = document.getElementById('producto-nombre').value.trim();
        const descripcion = document.getElementById('producto-descripcion').value.trim();
        const precio = parseFloat(document.getElementById('producto-precio').value);
        const marca = document.getElementById('producto-marca').value.trim();
        const talla = document.getElementById('producto-talla').value.trim();
        const genero = document.getElementById('producto-genero').value.trim();
        const stock = parseInt(document.getElementById('producto-stock').value);
        const categoria = parseInt(document.getElementById('producto-categoria').value);

        // Validar campos requeridos
        if (!nombre || isNaN(precio) || isNaN(stock) || !categoria) {
            throw new Error('Por favor complete todos los campos requeridos');
        }

        // Validar que el precio sea positivo
        if (precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }

        // Validar que el stock sea no negativo
        if (stock < 0) {
            throw new Error('El stock no puede ser negativo');
        }

        // Preparar los datos del producto
        const productoData = {
            nombre,
            descripcion: descripcion || '',
            precioUnitario: precio,
            marca: marca || '',
            tallaPrenda: talla || '',
            genero: genero || '',
            stock,
            idCategoria: categoria
        };

        // Hacer la petición PUT
        const response = await fetch(`/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        // Mostrar mensaje de éxito y cerrar modal
        showError('Producto actualizado exitosamente');
        const modal = document.getElementById('myModal');
        if (modal) modal.style.display = 'none';

        // Forzar la actualización de la lista
        await cargarProductos();
        
        // Limpiar el formulario
        if (form) {
            form.reset();
        }

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        showError(error.message);
    }
}

async function mostrarModalAgregarProducto() {
    try {
        // Obtener las categorías primero
        const opcionesCategorias = await obtenerCategoriasSelect();

        // Crear el HTML del formulario
        const formHtml = `
            <form id="producto-form">
                <div class="form-group">
                    <label for="producto-imagen">Imagen:</label>
                    <input type="file" id="producto-imagen" class="form-control" accept="image/*" required>
                </div>
                <div class="form-group">
                    <label for="producto-nombre">Nombre:</label>
                    <input type="text" id="producto-nombre" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="producto-descripcion">Descripción:</label>
                    <textarea id="producto-descripcion" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label for="producto-precio">Precio:</label>
                    <input type="number" id="producto-precio" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="producto-marca">Marca:</label>
                    <input type="text" id="producto-marca" class="form-control">
                </div>
                <div class="form-group">
                    <label for="producto-talla">Talla:</label>
                    <input type="text" id="producto-talla" class="form-control">
                </div>
                <div class="form-group">
                    <label for="producto-genero">Género:</label>
                    <select id="producto-genero" class="form-control">
                        <option value="">Seleccione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="producto-stock">Stock:</label>
                    <input type="number" id="producto-stock" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="producto-categoria">Categoría:</label>
                    <select id="producto-categoria" class="form-control">
                        ${opcionesCategorias}
                    </select>
                </div>
                <button type="button" id="btn-guardar" class="btn btn-primary">Guardar</button>
            </form>
        `;

        abrirModal('Nuevo Producto', formHtml);
        document.getElementById('btn-guardar').onclick = guardarProducto;
    } catch (error) {
        console.error('Error al mostrar modal:', error);
        showError('Error al cargar el formulario');
    }
}

async function eliminarProducto(id) {
    try {
        // Hacer la petición DELETE
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el producto');
        }

        // Mostrar mensaje de éxito
        showError('Producto eliminado exitosamente');

        // Cerrar el modal
        const modal = document.getElementById('myModal');
        if (modal) modal.style.display = 'none';

        // Recargar la lista de productos
        await cargarProductos();

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showError(error.message);
    }
}

async function obtenerCategoriasSelect(seleccionado = '') {
    try {
        const response = await fetch('/api/categorias');
        const categorias = await response.json();
        return categorias.map(categoria => `
            <option value="${categoria.idCategoria}" ${categoria.idCategoria === seleccionado ? 'selected' : ''}>
                ${categoria.nombre}
            </option>
        `).join('');
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        return '<option value="">Error al cargar categorías</option>';
    }
}

async function guardarProducto() {
    try {
        // Obtener valores del formulario
        const nombre = document.getElementById('producto-nombre').value.trim();
        const descripcion = document.getElementById('producto-descripcion').value.trim();
        const precio = parseFloat(document.getElementById('producto-precio').value);
        const marca = document.getElementById('producto-marca').value.trim();
        const talla = document.getElementById('producto-talla').value.trim();
        const genero = document.getElementById('producto-genero').value.trim();
        const stock = parseInt(document.getElementById('producto-stock').value);
        const categoria = parseInt(document.getElementById('producto-categoria').value);

        // Validar campos requeridos
        if (!nombre) {
            throw new Error('Por favor ingrese un nombre');
        }
        if (isNaN(precio) || precio <= 0) {
            throw new Error('Por favor ingrese un precio válido mayor a 0');
        }
        if (isNaN(stock) || stock < 0) {
            throw new Error('Por favor ingrese un stock válido');
        }
        if (!categoria) {
            throw new Error('Por favor seleccione una categoría');
        }

        // Preparar los datos del producto
        const productoData = {
            nombre,
            descripcion: descripcion || '',
            precioUnitario: precio,
            marca: marca || '',
            tallaPrenda: talla || '',
            genero: genero || '',
            stock,
            idCategoria: categoria,
            imagen: 'default-image.png'  // Usar una imagen por defecto
        };

        // Hacer la petición POST
        try {
            const response = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(productoData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', {
                    status: response.status,
                    message: errorData.message,
                    data: errorData
                });
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            throw error;
        }

        // Mostrar mensaje de éxito y cerrar modal
        showError('Producto guardado exitosamente');
        const modal = document.getElementById('myModal');
        if (modal) modal.style.display = 'none';

        // Recargar la lista de productos
        cargarProductos();

    } catch (error) {
        console.error('Error al guardar el producto:', error);
        showError(error.message);
    }
}

function abrirModal(titulo, contenido) {
    const modal = document.getElementById('myModal');
    const tituloModal = document.getElementById('titulo-modal-cris');
    const contenidoModal = document.getElementById('contenido-modal-cris');

    if (!modal || !tituloModal || !contenidoModal) {
        showError('Error: Elementos del modal no encontrados');
        return;
    }

    tituloModal.textContent = titulo;
    contenidoModal.innerHTML = contenido;
    modal.style.display = 'block';
}

async function abrirModalEliminarProducto(id) {
    try {
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
        titulo.textContent = 'Eliminar Producto';
        
        // Limpiar el contenido
        contenido.innerHTML = '';

        // Obtener los datos del producto
        const response = await fetch(`/api/productos/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del producto');
        }

        const producto = await response.json();

        // Crear el contenido del modal
        const contenidoHtml = `
            <div class="alert alert-danger">
                <h4>¿Está seguro de eliminar este producto?</h4>
                <p>Nombre: ${producto.nombre}</p>
                <p>Esta acción no se puede deshacer.</p>
            </div>
            <button type="button" id="btn-confirmar" class="btn btn-danger">Confirmar Eliminación</button>
            <button type="button" id="btn-cancelar" class="btn btn-secondary">Cancelar</button>
        `;

        // Insertar el contenido en el modal
        contenido.innerHTML = contenidoHtml;
        modal.style.display = 'block';

        // Configurar eventos de los botones
        document.getElementById('btn-confirmar').onclick = () => eliminarProducto(id);
        document.getElementById('btn-cancelar').onclick = () => {
            modal.style.display = 'none';
        };

    } catch (error) {
        console.error('Error al abrir modal de eliminación:', error);
        showError('Error al abrir el modal de eliminación');
    }
}

function cerrarModalProductoCategoria() {
    const modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'none';
}

var modal = document.getElementById("myModal");
var closeBtn = document.getElementsByClassName("close")[0];

closeBtn.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};