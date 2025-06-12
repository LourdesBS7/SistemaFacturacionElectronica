//const Factura = require("../../models/Factura");

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en la página principal
    if (document.getElementById('contenidoVacio')) {
        cargarFacturas();
    }
});


async function cargarFacturas() {
    try {
        const response = await fetch('/api/facturas');
        if (!response.ok) {
            throw new Error('Error al cargar las facturas');
        }
        const facturas = await response.json();

        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <h2>Listado de Facturas</h2>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Vendedor</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${facturas.map(factura => `
                            <tr>
                                <td>${factura.codigoPV || 'N/A'}</td>
                                <td>${new Date(factura.fechaEmision).toLocaleDateString()}</td>
                                <td>${factura.titularCliente || 'N/A'}</td>
                                <td>${factura.Vendedor?.nombre || 'N/A'}</td>
                                <td>$${factura.total.toFixed(2)}</td>
                                <td><span class="estado-badge ${factura.estado.toLowerCase()}">${factura.estado}</span></td>
                                <td>
                                    <button class="btn btn-primary" onclick="verFactura(${factura.idFactura})">Ver</button>
                                    <button class="btn btn-secondary" onclick="editarFactura(${factura.idFactura})">Editar</button>
                                    <button class="btn btn-danger" onclick="eliminarFactura(${factura.idFactura})">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Agregar estilos para los estados
        const style = document.createElement('style');
        style.innerHTML = `
            .estado-badge {
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8em;
                font-weight: bold;
            }
            .estado-badge.emitida {
                background-color: #d4edda;
                color: #155724;
            }
            .estado-badge.anulada {
                background-color: #f8d7da;
                color: #721c24;
            }
            .estado-badge.borrador {
                background-color: #fff3cd;
                color: #856404;
            }
            .btn-danger {
                background-color: #dc3545;
                color: white;
            }
        `;
        document.head.appendChild(style);

    } catch (error) {
        console.error('Error al cargar facturas:', error);
        mostrarError('Error al cargar facturas: ' + error.message);
    }
}


async function verFactura(id) {
    try {
        // 1. Obtener los datos básicos de la factura (incluyendo items con eager loading)
        const facturaResponse = await fetch(`/api/facturas/${id}?_embed=items`);
        if (!facturaResponse.ok) {
            throw new Error('Error al cargar los datos de la factura');
        }
        const factura = await facturaResponse.json();
        //imprimir factura en consola para depuración
        console.log('Factura obtenida:', factura);

        // Verificar que los items pertenecen a esta factura
        const items = factura.ItemFacturas || [];
        console.log('Items obtenidos:', items);

        // 2. Obtener información adicional de productos para cada item
        const itemsConProductos = await Promise.all(
            items.map(async item => {
                const productoResponse = await fetch(`/api/productos/${item.idProducto}`);
                if (productoResponse.ok) {
                    const producto = await productoResponse.json();
                    return { ...item, Producto: producto };
                }
                return { ...item, Producto: null };
            })
        );
        console.log('Items con productos:', itemsConProductos);

        // 3. Crear el modal con los datos obtenidos
        cargarEstilosModalFactura();
        const modalContent = `
            <div class="modal">
                <div class="modal-content factura-detalle">
                    <span class="close-modal" onclick="cerrarModal()">&times;</span>
                    
                    <div class="factura-header">
                        <h2>Factura #${factura.codigoPV || factura.idFactura}</h2>
                        <span class="estado-badge ${factura.estado.toLowerCase()}">${factura.estado}</span>
                    </div>
                    
                    <div class="factura-info">
                        <div class="info-section">
                            <h3>Información de la Factura</h3>
                            <p><strong>Fecha:</strong> ${new Date(factura.fechaEmision).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> $${(factura.total ?? 0).toFixed(2)}</p>
                            <p><strong>Impuestos:</strong> $${(factura.totalImpuestos ?? 0).toFixed(2)}</p>
                        </div>
                        
                        <div class="info-section">
                            <h3>Datos del Cliente</h3>
                            <p><strong>Nombre:</strong> ${factura.titularCliente || factura.Cliente?.nombre || 'N/A'}</p>
                            <p><strong>NIT:</strong> ${factura.nitcliente || factura.Cliente?.NIT || 'N/A'}</p>
                        </div>

                        <div class="info-section">
                            <h3>Datos del Vendedor</h3>
                            <p><strong>Nombre:</strong> ${factura.Vendedor?.nombre || 'N/A'}</p>
                            <p><strong>Código:</strong> ${factura.Vendedor?.codVendedor || 'N/A'}</p>
                            <p><strong>Telefono:</strong> ${factura.Vendedor?.telefono || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div class="factura-items">
                        <h3>Productos (${itemsConProductos.length})</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Código</th>
                                    <th>Cantidad</th>
                                    <th>P. Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsConProductos.map(item => `
                                    <tr>
                                        <td>${item.Producto?.nombre || 'Producto no disponible'}</td>
                                        <td>${item.Producto?.idProducto || 'N/A'}</td>
                                        <td>${item.cantidad}</td>
                                        <td>$${item.precioUnitario.toFixed(2)}</td>
                                        <td>$${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="factura-actions">
                        <button class="btn btn-secondary" onclick="cerrarModal()">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // 4. Mostrar el modal
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = modalContent;
        modalContainer.style.display = 'flex';

    } catch (error) {
        console.error('Error al cargar la factura:', error);
        mostrarError(`Error al cargar la factura: ${error.message}`);
    }
}


async function editarFactura(id) {
    try {
        // 1. Obtener datos de la factura con items incluidos
        const facturaResponse = await fetch(`/api/facturas/${id}?_embed=items`);
        if (!facturaResponse.ok) {
            throw new Error('Error al cargar los datos de la factura');
        }
        const factura = await facturaResponse.json();
        console.log('Datos de factura:', factura); // Para depuración

        // 2. Obtener datos relacionados (clientes, vendedores, productos)
        const [clientes, vendedores, productos] = await Promise.all([
            fetch('/api/clientes').then(res => res.ok ? res.json() : []),
            fetch('/api/vendedores').then(res => res.ok ? res.json() : []),
            fetch('/api/productos').then(res => res.ok ? res.json() : [])
        ]);

        // 3. Procesar items de la factura
        const items = factura.ItemFacturas || [];
        const itemsConProductos = await Promise.all(
            items.map(async item => {
                try {
                    const productoResponse = await fetch(`/api/productos/${item.idProducto}`);
                    if (productoResponse.ok) {
                        const producto = await productoResponse.json();
                        return { ...item, Producto: producto };
                    }
                    return { ...item, Producto: null };
                } catch (error) {
                    console.error(`Error al cargar producto ${item.idProducto}:`, error);
                    return { ...item, Producto: null };
                }
            })
        );

        // 4. Crear el modal de edición
        cargarEstilosModalFactura();
        const modalContent = `
            <div class="modal" id="editarFacturaModal">
                <div class="modal-content">
                    <span class="close-modal" onclick="cerrarModal()">&times;</span>
                    <h2>Editar Factura #${factura.codigoPV || factura.idFactura}</h2>
                    
                    <form id="formEditarFactura">
                        <div class="form-group">
                            <label>Fecha:</label>
                            <input type="date" id="fechaFactura" 
                                   value="${new Date(factura.fechaEmision).toISOString().split('T')[0]}" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label>Cliente:</label>
                            <select id="clienteFactura" required>
                                ${clientes.map(c => `
                                    <option value="${c.idCliente}" ${c.idCliente === factura.idCliente ? 'selected' : ''}>
                                        ${c.nombre} (NIT: ${c.NIT})
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Vendedor:</label>
                            <select id="vendedorFactura" required>
                                ${vendedores.map(v => `
                                    <option value="${v.idVendedor}" ${v.idVendedor === factura.idVendedor ? 'selected' : ''}>
                                        ${v.nombre} (Código: ${v.codVendedor})
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Estado:</label>
                            <select id="estadoFactura" required>
                                <option value="emitida" ${factura.estado === 'emitida' ? 'selected' : ''}>Emitida</option>
                                <option value="anulada" ${factura.estado === 'anulada' ? 'selected' : ''}>Anulada</option>
                                <option value="borrador" ${factura.estado === 'borrador' ? 'selected' : ''}>Borrador</option>
                            </select>
                        </div>
                        
                        <h3>Ítems de Factura</h3>
                        <div id="itemsContainer">
                            ${itemsConProductos.map((item, index) => `
                                <div class="item-row" data-index="${index}" data-item-id="${item.idItem || ''}">
                                    <select class="producto-item" required>
                                        <option value="">Seleccione un producto</option>
                                        ${productos.map(p => `
                                            <option value="${p.idProducto}" 
                                                    ${p.idProducto === item.idProducto ? 'selected' : ''}
                                                    data-precio="${p.precioUnitario}">
                                                ${p.nombre} ($${p.precioUnitario.toFixed(2)})
                                            </option>
                                        `).join('')}
                                    </select>
                                    <input type="number" class="cantidad-item" min="1" 
                                           value="${item.cantidad}" required>
                                    <span class="precio-item">$${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                                    <button type="button" class="btn-eliminar-item">Eliminar</button>
                                </div>
                            `).join('')}
                        </div>
                        
                        <button type="button" class="btn-agregar-item">+ Agregar Ítem</button>
                        
                        <div class="total-section">
                            <h4>Total: <span id="totalFactura">$${factura.total.toFixed(2)}</span></h4>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-guardar">Guardar Cambios</button>
                            <button type="button" class="btn-cancelar">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // 5. Mostrar modal
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = modalContent;
        modalContainer.style.display = 'flex';

        // 6. Después de mostrar el modal
        document.querySelector('.btn-agregar-item').addEventListener('click', agregarItemFacturacion);
        document.querySelector('.btn-cancelar').addEventListener('click', cerrarModal);

        document.getElementById('formEditarFactura').addEventListener('submit', function (e) {
            e.preventDefault();
            guardarFacturaEditada(factura.idFactura);
        });


        // 7. Configurar eventos
        configurarEventosFactura(id);


    } catch (error) {
        console.error('Error al editar factura:', error);
        mostrarError(`Error al editar factura: ${error.message}`);
    }
}


function configurarEventosFactura(facturaId) {
    document.querySelectorAll('.btn-eliminar-item').forEach((btn, index) => {
        btn.addEventListener('click', function () {
            const row = btn.closest('.item-row');
            const idItem = row.dataset.itemId;
            if (idItem) {
                // Ítem existente en la base de datos
                eliminarItemFacturaDB(idItem, row);
            } else {
                // Ítem nuevo, solo eliminar del DOM
                if (confirm('¿Eliminar este ítem nuevo?')) {
                    row.remove();
                    actualizarTotales();
                }
            }
        });
    });
}


async function agregarItemFacturacion() {
    try {
        const productosResponse = await fetch('/api/productos');
        if (!productosResponse.ok) throw new Error('Error al cargar productos');
        const productos = await productosResponse.json();

        const itemsContainer = document.getElementById('itemsContainer');
        const nuevoItem = document.createElement('div');
        // Asignar clase y data-index
        nuevoItem.classList.add('item-row');
        nuevoItem.setAttribute('data-index', itemsContainer.querySelectorAll('.item-row').length);

        const primerProducto = productos[0] || { precioUnitario: 0, idProducto: '', nombre: '' };

        nuevoItem.innerHTML = `
            <select class="producto-item" required>
                <option value="">Seleccione un producto</option>
                ${productos.map(p => `
                    <option value="${p.idProducto}" data-precio="${p.precioUnitario}">
                        ${p.nombre} ($${p.precioUnitario.toFixed(2)})
                    </option>
                `).join('')}
            </select>
            <input type="number" class="cantidad-item" min="1" value="1" required>
            <span class="precio-item">$${primerProducto.precioUnitario.toFixed(2)}</span>
            <button type="button" class="btn-eliminar-item">Eliminar</button>
            <span class="item-status">(New)</span>
        `;

        itemsContainer.appendChild(nuevoItem);

        // Configurar eventos
        nuevoItem.querySelector('.producto-item').addEventListener('change', function () {
            const selectedProduct = productos.find(p => p.idProducto == this.value);
            const precio = selectedProduct?.precioUnitario || 0;
            const cantidad = parseInt(nuevoItem.querySelector('.cantidad-item').value || 1);
            nuevoItem.querySelector('.precio-item').textContent = `$${(precio * cantidad).toFixed(2)}`;
            actualizarTotales();
        });

        nuevoItem.querySelector('.cantidad-item').addEventListener('change', function () {
            const productoId = nuevoItem.querySelector('.producto-item').value;
            const selectedProduct = productos.find(p => p.idProducto == productoId);
            const precio = selectedProduct?.precioUnitario || 0;
            const cantidad = parseInt(this.value || 1);
            nuevoItem.querySelector('.precio-item').textContent = `$${(precio * cantidad).toFixed(2)}`;
            actualizarTotales();
        });

        nuevoItem.querySelector('.btn-eliminar-item').addEventListener('click', function () {
            if (confirm('¿Eliminar este ítem nuevo?')) {
                nuevoItem.remove();
                actualizarTotales();
            }
        });

        actualizarTotales();

    } catch (error) {
        console.error('Error al agregar ítem:', error);
        mostrarError('Error al cargar productos para nuevo ítem');
    }
}


function eliminarItemFactura(index) {
    const item = document.querySelector(`.item-row[data-index="${index}"]`);
    if (item) {
        item.remove();
        actualizarTotales();

        // Reindexar los items restantes
        document.querySelectorAll('.item-row').forEach((item, newIndex) => {
            item.dataset.index = newIndex;
            item.querySelector('.btn-eliminar-item').setAttribute('onclick', `eliminarItemFactura(${newIndex})`);
        });
    }
}


function actualizarTotales() {
    const itemRows = document.querySelectorAll('.item-row');
    let total = 0;

    itemRows.forEach(row => {
        const productoSelect = row.querySelector('.producto-item');
        const cantidadInput = row.querySelector('.cantidad-item');
        const precioItem = row.querySelector('.precio-item');

        const precioUnitario = parseFloat(productoSelect.selectedOptions[0]?.dataset.precio || '0');
        const cantidad = parseInt(cantidadInput.value || '0');
        const subtotal = precioUnitario * cantidad;

        precioItem.textContent = `$${subtotal.toFixed(2)}`;
        total += subtotal;
    });

    document.getElementById('totalFactura').textContent = `$${total.toFixed(2)}`;
}


async function guardarFacturaEditada(id) {
    try {
        const itemsContainer = document.getElementById('itemsContainer');
        const itemRows = itemsContainer.querySelectorAll('.item-row');

        const itemsActualizar = [];
        const itemsNuevos = [];
        let hasErrors = false;

        // Validar y clasificar items
        itemRows.forEach(row => {
            const productoSelect = row.querySelector('.producto-item');
            const cantidadInput = row.querySelector('.cantidad-item');
            const itemId = row.dataset.itemId ? parseInt(row.dataset.itemId) : null;

            const productoId = parseInt(productoSelect.value);
            const cantidad = parseInt(cantidadInput.value);
            // Obtener el precio unitario del producto seleccionado
            const precioUnitario = parseFloat(productoSelect.selectedOptions[0]?.dataset.precio || '0');

            if (!productoId || isNaN(cantidad) || cantidad < 1) {
                row.style.border = '1px solid red';
                hasErrors = true;
                return;
            }

            const itemData = {
                idProducto: productoId,
                cantidad: cantidad,
                precioUnitario: precioUnitario // <-- Aquí se incluye el precio unitario
            };

            if (itemId) {
                itemsActualizar.push({
                    idItem: itemId,
                    ...itemData
                });
            } else {
                itemsNuevos.push(itemData);
            }
        });

        if (hasErrors) {
            throw new Error('Algunos ítems tienen datos inválidos');
        }

        if (itemsActualizar.length === 0 && itemsNuevos.length === 0) {
            throw new Error('Debe agregar al menos un producto a la factura');
        }

        // Calcular totales después de clasificar los ítems
        let total = 0;
        let totalImpuestos = 0;
        const porcentajeImpuesto = 0.13;

        [...itemsActualizar, ...itemsNuevos].forEach(item => {
            const subtotal = item.precioUnitario * item.cantidad;
            total += subtotal;
            totalImpuestos += subtotal * porcentajeImpuesto;
        });

        // 1. Actualizar la factura con los datos básicos
        const facturaData = {
            idCliente: parseInt(document.getElementById('clienteFactura').value),
            idVendedor: parseInt(document.getElementById('vendedorFactura').value),
            estado: document.getElementById('estadoFactura').value,
            codigoPV: document.querySelector('.codigo-pv')?.value || 'PV001',
            total: parseFloat(total.toFixed(2)),
            totalImpuestos: parseFloat(totalImpuestos.toFixed(2)),
            items: itemsActualizar,
        };

        console.log('Actualizando factura:', facturaData);

        const responseFactura = await fetch(`/api/facturas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(facturaData)
        });

        if (!responseFactura.ok) {
            throw new Error('Error al actualizar la factura');
        }

        // Llama a insertarItemsFactura para TODOS los ítems (nuevos y existentes)
        const todosLosItems = [...itemsActualizar, ...itemsNuevos];
        console.log('Items a insertar/actualizar:', todosLosItems); // Para depuración
        if (todosLosItems.length > 0) {
            console.log('Insertando/actualizando items:', todosLosItems);
            await insertarItemsFactura(id, todosLosItems);
        }

        mostrarMensaje('Factura actualizada correctamente');
        cargarFacturas();
        cerrarModal();

    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarError(`Error al guardar factura: ${error.message}`);
    }
}


async function insertarItemsFactura(facturaId, items) {
    try {
        for (const item of items) {
            // Incluye precioUnitario en el objeto enviado
            const itemData = {
                idFactura: facturaId,
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario // <-- Aquí se envía el precio unitario
            };

            if (item.idItem) {
                // Actualizar ítem existente
                const response = await fetch(`/api/items/${item.idItem}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al actualizar ítem');
                }
            } else {
                // Crear nuevo ítem
                const response = await fetch('/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al insertar nuevo ítem');
                }
            }
        }
        return true;
    } catch (error) {
        console.error('Error al insertar/actualizar items:', error);
        throw error;
    }
}


async function eliminarItemFacturaDB(idItem, rowElement) {
    if (!idItem) return; // Solo eliminar de la vista si es un ítem nuevo (sin id)
    if (!confirm('¿Está seguro que desea eliminar este ítem de la factura?')) return;
    try {
        const response = await fetch(`/api/items/${idItem}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar el ítem de la base de datos');
        rowElement.remove();
        actualizarTotales();
        mostrarMensaje('Ítem eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar ítem:', error);
        mostrarError('Error al eliminar ítem: ' + error.message);
    }
}


// Función auxiliar para cerrar el modal
function cerrarModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.style.display = 'none';
    modalContainer.innerHTML = '';
}


// Función auxiliar para mostrar errores
function mostrarError(mensaje) {
    const contenidoVacio = document.getElementById('contenidoVacio');
    contenidoVacio.innerHTML = `
        <div class="error-message">
            <p>${mensaje}</p>
        </div>
    `;
}


async function eliminarFactura(idFactura) {
    if (!confirm('¿Está seguro que desea eliminar esta factura?')) return;
    try {
        // 1. Obtener la factura con sus ítems asociados
        const facturaResponse = await fetch(`/api/facturas/${idFactura}?_embed=items`);
        if (!facturaResponse.ok) throw new Error('No se pudo obtener la factura');
        const factura = await facturaResponse.json();

        // 2. Obtener la lista de idItem de los ítems asociados a la factura
        const items = factura.ItemFacturas || [];
        const idItems = items.map(item => item.idItem);

        // 3. Eliminar cada ítem por su id
        for (const idItem of idItems) {
            const deleteItemResponse = await fetch(`/api/items/${idItem}`, { method: 'DELETE' });
            if (!deleteItemResponse.ok) throw new Error('No se pudo eliminar un ítem asociado');
        }

        // 4. Eliminar la factura
        const response = await fetch(`/api/facturas/${idFactura}`, { method: 'DELETE' });
        if (response.ok) {
            cargarFacturas();
            mostrarMensaje('Factura eliminada correctamente');
        } else {
            throw new Error('Error al eliminar la factura');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al eliminar factura: ' + error.message);
    }
}


function mostrarModalNuevaFactura() {
    // Implementar lógica para mostrar el modal de nueva factura
    console.log('Mostrar modal para nueva factura');
    // Aquí abrirías un modal con el formulario para crear una nueva factura
    abrirModalNuevaFactura();
}


// Funciones auxiliares
function mostrarError(mensaje) {
    const contenidoVacio = document.getElementById('contenidoVacio');
    contenidoVacio.innerHTML = `
        <div class="alert alert-danger">
            <p>${mensaje}</p>
        </div>
    `;
}


function mostrarMensaje(mensaje) {
    // Crear el contenedor de toasts si no existe
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }

    // Crear el toast
    const toast = document.createElement('div');
    toast.className = 'alert alert-success';
    toast.style.minWidth = '200px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    toast.style.borderRadius = '6px';
    toast.style.padding = '12px 20px';
    toast.style.background = '#d4edda';
    toast.style.color = '#155724';
    toast.style.fontWeight = 'bold';
    toast.style.opacity = '0.95';
    toast.innerHTML = `<p style="margin:0">${mensaje}</p>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
        // Si no quedan más toasts, eliminar el contenedor
        if (toastContainer.childElementCount === 0) {
            toastContainer.remove();
        }
    }, 3000);
}


// Funciones de modal (implementar según tu sistema de modales)
function abrirModalDetalleFactura(idFactura) {
    // Implementar lógica para obtener detalles y mostrar modal
    fetch(`/api/facturas/${idFactura}`)
        .then(response => response.json())
        .then(factura => {
            // Crear y mostrar el modal con los detalles
            cargarEstilosModalFactura();
            const modalContent = `
                <div class="modal">
                    <div class="modal-content">
                        <span class="close-modal" onclick="cerrarModal()">&times;</span>
                        <h2>Detalle de Factura #${factura.codigoPV}</h2>
                        <p><strong>Fecha:</strong> ${new Date(factura.fechaEmision).toLocaleDateString()}</p>
                        <p><strong>Cliente:</strong> ${factura.titularCliente}</p>
                        <p><strong>Vendedor:</strong> ${factura.Vendedor?.nombre}</p>
                        <p><strong>Estado:</strong> ${factura.estado}</p>
                        <h3>Productos:</h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${factura.Items?.map(item => `
                                    <tr>
                                        <td>${item.Producto?.nombre}</td>
                                        <td>${item.cantidad}</td>
                                        <td>$${item.precioUnitario.toFixed(2)}</td>
                                        <td>$${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <p><strong>Total:</strong> $${factura.total.toFixed(2)}</p>
                    </div>
                </div>
            `;

            document.getElementById('modal-container').innerHTML = modalContent;
            document.getElementById('modal-container').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error al cargar detalles de la factura');
        });
}


function cerrarModal() {
    document.getElementById('modal-container').style.display = 'none';
}


// function cargarEstilosModalFactura() {
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'css/facturasModal.css';
//     document.head.appendChild(link);
// }


// ---------------- Entorno de facturacion ----------------
async function crearFactura() {
    try {
        // Obtener datos necesarios para los selects
        const [clientes, vendedores, productos] = await Promise.all([
            fetch('/api/clientes').then(res => res.ok ? res.json() : []),
            fetch('/api/vendedores').then(res => res.ok ? res.json() : []),
            fetch('/api/productos').then(res => res.ok ? res.json() : [])
        ]);

        // Crear estructura HTML
        const contenidoVacio = document.getElementById('contenidoVacio');
        contenidoVacio.innerHTML = `
            <div class="factura-container">
                <div class="factura-form">
                    <h2>Nueva Factura</h2>
                    <form id="formCrearFactura">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Cliente:</label>
                                <select id="clienteFactura" required>
                                    <option value="">Seleccione un cliente</option>
                                    ${clientes.map(c => `
                                        <option value="${c.idCliente}" data-nit="${c.NIT}" data-nombre="${c.nombre}">
                                            ${c.nombre} (NIT: ${c.NIT})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Vendedor:</label>
                                <select id="vendedorFactura" required>
                                    <option value="">Seleccione un vendedor</option>
                                    ${vendedores.map(v => `
                                        <option value="${v.idVendedor}">
                                            ${v.nombre} (Código: ${v.codVendedor})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha Emisión:</label>
                                <input type="date" id="fechaFactura" required>
                            </div>
                            
                            <div class="form-group">
                                <label>NIT Emisor:</label>
                                <input type="text" id="nitEmisor" value="123456789" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Código PV:</label>
                                <input type="text" id="codigoPV" value="001-A" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Estado:</label>
                                <select id="estadoFactura" required>
                                    <option value="emitida">Emitida</option>
                                    <option value="borrador">Borrador</option>
                                </select>
                            </div>
                        </div>
                        
                        <h3>Ítems de Factura</h3>
                        <div id="itemsContainer" class="items-container"></div>
                        <button type="button" class="btn-agregar-item">+ Agregar Ítem</button>
                        <div class="form-actions">
                            <button type="submit" class="btn-guardar">Crear Factura</button>
                            <button type="button" class="btn-cancelar">Cancelar</button>
                        </div>
                    
                    </form>
                </div>
                
                <div class="factura-resumen">
                    <h3>Resumen de Factura</h3>
                    <div class="resumen-item">
                        <span>Subtotal:</span>
                        <span id="subtotalFactura">$0.00</span>
                    </div>
                    <div class="resumen-item">
                        <span>Impuestos (16%):</span>
                        <span id="impuestosFactura">$0.00</span>
                    </div>
                    <div class="resumen-item total">
                        <span>Total:</span>
                        <span id="totalFactura">$0.00</span>
                    </div>
                </div>
            </div>
        `;

        // Establecer fecha actual por defecto
        document.getElementById('fechaFactura').valueAsDate = new Date();

        // Configurar eventos
        document.getElementById('clienteFactura').addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            document.getElementById('nitEmisor').value = selectedOption.dataset.nit || '';
        });

        document.querySelector('.btn-agregar-item').addEventListener('click', () => agregarItemFacturacion(productos));
        document.getElementById('formCrearFactura').addEventListener('submit', guardarNuevaFactura);

        // Agregar primer item por defecto
        agregarItemFacturacion(productos);

    } catch (error) {
        console.error('Error al cargar formulario de creación:', error);
        mostrarError(`Error al cargar formulario: ${error.message}`);
    }
}


async function agregarItemFacturacion(productos) {
    const itemsContainer = document.getElementById('itemsContainer');
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'item-row';

    cargarEstilosModalFactura();
    nuevoItem.innerHTML = `
    <select class="producto-item" required>
        <option value="">Seleccione un producto</option>
        ${productos.map(p => `
            <option value="${p.idProducto}" data-precio="${p.precioUnitario}" data-stock="${p.stock}">
                ${p.nombre} ($${p.precioUnitario.toFixed(2)}) - Stock: ${p.stock}
            </option>
        `).join('')}
    </select>
    <input type="number" class="cantidad-item" min="1" value="1" required>
    <span class="precio-item">$${productos[0]?.precioUnitario?.toFixed(2) || '0.00'}</span>
    <span class="stock-item">Stock: ${productos[0]?.stock ?? 0}</span>
    <button type="button" class="btn-eliminar-item">Eliminar</button>
    `;

    itemsContainer.appendChild(nuevoItem);

    // Configurar eventos
    const productoSelect = nuevoItem.querySelector('.producto-item');
    const cantidadInput = nuevoItem.querySelector('.cantidad-item');
    const precioSpan = nuevoItem.querySelector('.precio-item');
    const stockSpan = nuevoItem.querySelector('.stock-item');
    const btnEliminar = nuevoItem.querySelector('.btn-eliminar-item');

    function actualizarStockYPrecio() {
        const selectedOption = productoSelect.selectedOptions[0];
        const precio = parseFloat(selectedOption?.dataset.precio || 0);
        const stockTotal = parseInt(selectedOption?.dataset.stock || 0);
        const cantidad = parseInt(cantidadInput.value || 1);
        precioSpan.textContent = `$${(precio * cantidad).toFixed(2)}`;
        const stockRestante = Math.max(stockTotal - cantidad, 0);
        stockSpan.textContent = `Stock disponible: ${stockRestante}`;
    }

    productoSelect.addEventListener('change', function () {
        cantidadInput.value = 1; // Reinicia la cantidad al cambiar de producto
        actualizarStockYPrecio();
        actualizarResumenFactura();
    });

    cantidadInput.addEventListener('input', function () {
        actualizarStockYPrecio();
        actualizarResumenFactura();
    });

    btnEliminar.addEventListener('click', function () {
        if (confirm('¿Eliminar este ítem?')) {
            nuevoItem.remove();
            actualizarResumenFactura();
        }
    });

    actualizarStockYPrecio();
    //configurarEventos();
    actualizarResumenFactura();
}


function actualizarResumenFactura() {
    let subtotal = 0;

    document.querySelectorAll('.item-row').forEach(row => {
        const productoSelect = row.querySelector('.producto-item');
        const cantidadInput = row.querySelector('.cantidad-item');

        if (productoSelect.value && cantidadInput.value) {
            const precio = parseFloat(productoSelect.selectedOptions[0]?.dataset.precio || 0);
            const cantidad = parseInt(cantidadInput.value);
            subtotal += precio * cantidad;
        }
    });

    const impuestos = subtotal * 0.16;
    const total = subtotal + impuestos;

    document.getElementById('subtotalFactura').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('impuestosFactura').textContent = `$${impuestos.toFixed(2)}`;
    document.getElementById('totalFactura').textContent = `$${total.toFixed(2)}`;
}


// Función para guardar la nueva factura
async function guardarNuevaFactura(e) {
    e.preventDefault();

    try {
        // Validar que haya al menos un ítem válido
        const items = [];

        document.querySelectorAll('.item-row').forEach(row => {
            const productoSelect = row.querySelector('.producto-item');
            const cantidadInput = row.querySelector('.cantidad-item');

            const productoId = parseInt(productoSelect.value);
            const cantidad = parseInt(cantidadInput.value);
            const precioUnitario = parseFloat(productoSelect.selectedOptions[0]?.dataset.precio);

            // Validar que los valores sean válidos y positivos
            if (
                productoId && !isNaN(productoId) &&
                cantidad && !isNaN(cantidad) && cantidad > 0 &&
                precioUnitario && !isNaN(precioUnitario) && precioUnitario > 0
            ) {
                items.push({
                    idProducto: productoId,
                    cantidad: cantidad,
                    precioUnitario: precioUnitario
                });
            }
        });

        if (items.length === 0) {
            throw new Error('Debe agregar al menos un producto válido');
        }

        // Calcular totales
        const subtotal = items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
        const totalImpuestos = subtotal * 0.13;
        const total = subtotal + totalImpuestos;
        console.log('Subtotal:', subtotal, 'Total Impuestos:', totalImpuestos, 'Total:', total);

        // Obtener datos del cliente seleccionado
        const clienteSelect = document.getElementById('clienteFactura');
        const clienteOption = clienteSelect.options[clienteSelect.selectedIndex];

        // 1. Primero crear la factura
        const facturaData = {
            nitcliente: parseInt(clienteOption.dataset.nit),
            titularCliente: clienteOption.dataset.nombre,
            fechaEmision: document.getElementById('fechaFactura').value,
            nitEmisor: document.getElementById('nitEmisor').value,
            codigoPV: document.getElementById('codigoPV').value,
            total: total,
            totalImpuestos: totalImpuestos,
            estado: document.getElementById('estadoFactura').value,
            idCliente: parseInt(clienteSelect.value),
            idVendedor: parseInt(document.getElementById('vendedorFactura').value)
        };

        console.log('Creando factura:', facturaData);
        const responseFactura = await fetch('/api/facturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(facturaData)
        });

        if (!responseFactura.ok) {
            const errorData = await responseFactura.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al crear la factura');
        }

        const facturaCreada = await responseFactura.json();
        console.log('Factura creada:', facturaCreada);

        // 2. Luego crear los items de la factura uno por uno
        const resultadosItems = [];
        for (const item of items) {
            try {
                const itemData = {
                    idFactura: facturaCreada.idFactura,
                    idProducto: item.idProducto,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario
                };

                console.log('Creando item:', itemData);
                const responseItem = await fetch('/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemData)
                });

                if (!responseItem.ok) {
                    throw new Error(`Error al crear item para producto ${item.idProducto}`);
                }

                resultadosItems.push(await responseItem.json());
            } catch (error) {
                console.error(`Error al crear item:`, error);
                // Continuar con los siguientes items pero registrar el error
                resultadosItems.push({ error: error.message });
            }
        }
        console.log('Resultados de creación de items:', resultadosItems);

        // Verificar si hubo errores en la creación de items
        const erroresItems = resultadosItems.filter(r => r.error);
        if (erroresItems.length > 0) {
            console.warn('Algunos items no se crearon correctamente:', erroresItems);
            mostrarMensaje(`Factura creada, pero ${erroresItems.length} items no se guardaron correctamente`);
        } else {
            mostrarMensaje('Factura creada correctamente con todos sus items');
        }
        
        verFactura(facturaCreada.id || facturaCreada.idFactura);
        crearFactura(); // Reiniciar el formulario para una nueva factura

    } catch (error) {
        console.error('Error en el proceso de creación:', error);
        mostrarError(`Error al crear factura: ${error.message}`);
    }
}


function cargarEstilosModalFactura() {
    // Evita cargar el mismo CSS varias veces
    if (!document.getElementById('facturasModalCss')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/facturasModal.css';
        link.id = 'facturasModalCss';
        document.head.appendChild(link);
    }
}