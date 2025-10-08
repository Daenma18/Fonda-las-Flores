// CARRITO DE COMPRAS
// Variables para el carrito
let cart = JSON.parse(localStorage.getItem('fondaLasFloresCart')) || [];

/**
 * Función para agregar productos al carrito CON GRUPACIÓN
 * @param {string} name - Nombre del producto
 * @param {number} price - Precio del producto (si es 0, buscará en la base de datos)
 * @param {string} category - Categoría del producto
 * @param {string} pedidoId - ID para agrupar pedidos (opcional)
 */
function addToCart(name, price, category, pedidoId = null) {
    // SIEMPRE buscar el precio actualizado en la base de datos
    let finalPrice = price;
    const products = JSON.parse(localStorage.getItem('fondaLasFloresProducts')) || [];
    const product = products.find(p => p.name === name && p.category === category);
    
    if (product) {
        finalPrice = product.price; // Usar siempre el precio de la base de datos
    } else {
        finalPrice = price; // Usar precio por defecto solo si no se encuentra
        console.warn(`⚠️ Producto no encontrado en BD: ${name} (${category}), usando precio por defecto: $${price}`);
    }
    
    // Si no se proporciona pedidoId, crear uno nuevo
    const actualPedidoId = pedidoId || 'pedido_' + Date.now();
    
    const existingItem = cart.find(item => 
        item.name === name && 
        item.category === category && 
        item.pedidoId === actualPedidoId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: finalPrice,
            category: category,
            quantity: 1,
            pedidoId: actualPedidoId
        });
    }

    localStorage.setItem('fondaLasFloresCart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} agregado al carrito`);
}

/**
 * Función para actualizar el contador del carrito
 */
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

/**
 * Función para mostrar notificaciones de confirmación
 * @param {string} message - Mensaje a mostrar en la notificación
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Funciones para abrir y cerrar el modal del carrito
 */
function openCartModal() {
    document.getElementById('cartModal').style.display = 'flex';
    updateCartDisplay();
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

/**
 * Funciones para abrir y cerrar el modal del formulario
 */
function openCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

/**
 * Función para mostrar los productos en el modal del carrito CON AGRUPACIÓN
 */
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotal.textContent = 'Total: $0.00 MXN';
    } else {
        let total = 0;
        
        // Agrupar items por pedidoId
        const pedidos = {};
        cart.forEach((item, index) => {
            if (!pedidos[item.pedidoId]) {
                pedidos[item.pedidoId] = [];
            }
            pedidos[item.pedidoId].push({...item, originalIndex: index});
        });

        // Mostrar cada pedido como grupo separado
        Object.values(pedidos).forEach((pedido, pedidoIndex) => {
            // Agregar separador entre pedidos (excepto el primero)
            if (pedidoIndex > 0) {
                const separator = document.createElement('div');
                separator.className = 'pedido-separator';
                separator.textContent = '─── Pedido adicional ───';
                separator.style.cssText = 'border-top: 2px dashed #ccc; margin: 1rem 0; padding: 0.5rem 0; font-style: italic; color: #666; text-align: center;';
                cartItems.appendChild(separator);
            }
            
            // Mostrar items de este pedido
            pedido.forEach(itemData => {
                const item = itemData;
                const index = itemData.originalIndex;
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.name}</strong> (${item.category})
                        <div>Cantidad:
                            <button onclick="changeQuantity(${index}, ${item.quantity - 1})">-</button>
                            ${item.quantity}
                            <button onclick="changeQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div>$${itemTotal.toFixed(2)} MXN</div>
                `;
                cartItems.appendChild(cartItemElement);
            });
        });
        
        cartTotal.textContent = `Total: $${total.toFixed(2)} MXN`;
    }
}

/**
 * Función para cambiar la cantidad de un producto en el carrito
 * @param {number} index - Índice del producto en el arreglo del carrito
 * @param {number} newQuantity - La nueva cantidad
 */
function changeQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQuantity;
    }
    localStorage.setItem('fondaLasFloresCart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

/**
 * Función que se ejecuta al hacer clic en "Realizar Pedido"
 */
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos primero.');
        return;
    }
    // Cierra el modal del carrito y abre el modal del formulario
    closeCartModal();
    openCheckoutModal();
}

/**
 * Función para procesar el pedido y enviar el mensaje de WhatsApp CON AGRUPACIÓN
 */
function processOrder() {
    // Obtener los datos del formulario
    const name = document.getElementById('user-name').value;
    const address = document.getElementById('user-address').value;
    const phone = document.getElementById('user-phone').value;
    const payment = document.getElementById('user-payment').value;

    if (!name || !address || !phone || !payment) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
    }

    let message = `¡Hola, me gustaría hacer un pedido! Aquí está la información:\n\n`;

    // Agrupar items por pedidoId para el mensaje
    const pedidos = {};
    cart.forEach((item, index) => {
        const pedidoId = item.pedidoId || 'sin_grupo';
        if (!pedidos[pedidoId]) {
            pedidos[pedidoId] = [];
        }
        pedidos[pedidoId].push(item);
    });

    // Mostrar cada pedido como grupo separado en el mensaje
    Object.values(pedidos).forEach((pedido, pedidoIndex) => {
        // Agregar separador entre pedidos (excepto el primero)
        if (pedidoIndex > 0) {
            message += `\n─── Pedido adicional ───\n`;
        }
        
        // Mostrar items de este pedido
        pedido.forEach(item => {
            message += `• ${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
    });

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    message += `\n*Total: $${subtotal.toFixed(2)} MXN*\n\n`;
    message += `--- Datos del cliente ---\n`;
    message += `*Nombre:* ${name}\n`;
    message += `*Dirección:* ${address}\n`;
    message += `*Teléfono:* ${phone}\n`;
    message += `*Forma de pago:* ${payment}\n`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Número de teléfono de la fonda
    const phoneNumber = "524461445561";

    // Abrir WhatsApp con el mensaje predefinido
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    // Vaciar el carrito y cerrar los modales
    cart = [];
    localStorage.setItem('fondaLasFloresCart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    closeCheckoutModal();
}

// CHATBOT MEJORADO - FONDA LAS FLORES
let chatbotState = {
    currentStep: 'welcome',
    orderInProgress: false,
    orderItems: [],
    userData: {}
};

function toggleChatbot() {
    const box = document.getElementById('chatbot-box');
    if (box.style.display === 'flex') {
        box.style.display = 'none';
    } else {
        box.style.display = 'flex';
        // Enfocar el input cuando se abre el chatbot
        setTimeout(() => {
            const input = document.getElementById("chatbot-input");
            if (input) input.focus();
        }, 100);
        
        // Mostrar mensaje de bienvenida si es la primera vez
        const messages = document.getElementById("chatbot-messages");
        if (messages.children.length <= 1) {
            showWelcomeMessage();
        }
    }
}

function closeChatbot() {
    document.getElementById('chatbot-box').style.display = 'none';
    // Resetear estado del chatbot
    chatbotState = {
        currentStep: 'welcome',
        orderInProgress: false,
        orderItems: [],
        userData: {}
    };
}

function showWelcomeMessage() {
    const messages = document.getElementById("chatbot-messages");
    const welcomeDiv = document.createElement("div");
    welcomeDiv.classList.add("bot-message");
    welcomeDiv.innerHTML = `
        ¡Hola! 👋 Soy el asistente virtual de <strong>Fonda Las Flores</strong>.<br><br>
        ¿En qué puedo ayudarte hoy? Puedo:
        <br>• 📋 Mostrarte nuestro <strong>menú</strong>
        <br>• 🕐 Informarte sobre <strong>horarios</strong>
        <br>• 📍 Darte nuestra <strong>ubicación</strong>
        <br>• 🛒 Ayudarte a <strong>hacer un pedido</strong>
        <br>• 💰 Consultar <strong>precios</strong>
        <br><br>
        <small>Escribe lo que necesites o selecciona una opción rápida:</small>
        <div class="quick-buttons">
            <button class="quick-btn" onclick="handleQuickAction('menu')">📋 Ver Menú</button>
            <button class="quick-btn" onclick="handleQuickAction('order')">🛒 Hacer Pedido</button>
            <button class="quick-btn" onclick="handleQuickAction('hours')">🕐 Horarios</button>
            <button class="quick-btn" onclick="handleQuickAction('location')">📍 Ubicación</button>
        </div>
    `;
    messages.appendChild(welcomeDiv);
    messages.scrollTop = messages.scrollHeight;
}

function handleQuickAction(action) {
    switch(action) {
        case 'menu':
            showMenu();
            break;
        case 'order':
            startOrderProcess();
            break;
        case 'hours':
            showHours();
            break;
        case 'location':
            showLocation();
            break;
    }
}

function sendChat() {
    const input = document.getElementById("chatbot-input");
    const userMessage = input.value.trim().toLowerCase();
    const messages = document.getElementById("chatbot-messages");

    if (userMessage === "") return;

    // Mostrar mensaje del usuario
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-message");
    userDiv.textContent = userMessage;
    messages.appendChild(userDiv);

    // Limpiar el input
    input.value = "";

    // Procesar el mensaje según el estado actual
    if (chatbotState.orderInProgress) {
        handleOrderFlow(userMessage);
    } else {
        handleGeneralQuery(userMessage);
    }

    messages.scrollTop = messages.scrollHeight;
    
    // Enfocar el input después de enviar
    setTimeout(() => {
        input.focus();
    }, 100);
}

function handleGeneralQuery(message) {
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");

    // Palabras clave para diferentes consultas
    if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas tardes')) {
        botDiv.innerHTML = `¡Hola! 😊 ¿En qué puedo ayudarte hoy?`;
    }
    else if (message.includes('menú') || message.includes('menu') || message.includes('platillos')) {
        showMenu();
        return;
    }
    else if (message.includes('horario') || message.includes('hora') || message.includes('abren') || message.includes('cierran')) {
        showHours();
        return;
    }
    else if (message.includes('ubicación') || message.includes('dirección') || message.includes('donde') || message.includes('dónde')) {
        showLocation();
        return;
    }
    else if (message.includes('pedido') || message.includes('orden') || message.includes('comprar') || message.includes('ordenar')) {
        startOrderProcess();
        return;
    }
    else if (message.includes('precio') || message.includes('cuánto') || message.includes('cuesta')) {
        showPrices();
        return;
    }
    else if (message.includes('teléfono') || message.includes('telefono') || message.includes('contacto')) {
        botDiv.innerHTML = `📞 Nuestro teléfono es: <strong>(441) 1157720</strong><br>
                           También puedes contactarnos por WhatsApp: <a href="https://wa.me/524461445561" target="_blank" class="whatsapp-link">📱 Abrir WhatsApp</a>`;
    }
    else if (message.includes('gracias') || message.includes('thanks')) {
        botDiv.innerHTML = `¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?`;
    }
    else if (message.includes('adiós') || message.includes('chao') || message.includes('bye')) {
        botDiv.innerHTML = `¡Hasta luego! 👋 Que tengas un excelente día. ¡Te esperamos en Fonda Las Flores!`;
    }
    else {
        botDiv.innerHTML = `🤔 No estoy seguro de entenderte completamente. Puedo ayudarte con:
            <br>• 📋 <strong>Menú completo</strong>
            <br>• 🛒 <strong>Hacer pedidos</strong>
            <br>• 🕐 <strong>Horarios</strong>
            <br>• 📍 <strong>Ubicación</strong>
            <br>• 💰 <strong>Precios</strong>
            <br><br>
            <small>¿Qué te gustaría saber?</small>`;
    }

    messages.appendChild(botDiv);
}

// MODIFICADA: Ahora usa precios actualizados desde la base de datos
function showMenu() {
    const products = JSON.parse(localStorage.getItem('fondaLasFloresProducts')) || [];
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    // Agrupar productos por categoría
    const categories = {};
    products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = [];
        }
        categories[product.category].push(product);
    });
    
    let menuHTML = `
        📋 <strong>MENÚ FONDA LAS FLORES</strong><br><br>
    `;
    
    // Mostrar productos por categoría
    Object.keys(categories).forEach(category => {
        menuHTML += `<strong>${getCategoryIcon(category)} ${category}</strong><br>`;
        
        categories[category].forEach(product => {
            menuHTML += `• ${product.name} - $${product.price.toFixed(2)}<br>`;
        });
        
        menuHTML += `<br>`;
    });
    
    menuHTML += `
        <div class="quick-buttons">
            <button class="quick-btn" onclick="startOrderProcess()">🛒 Hacer Pedido</button>
            <button class="quick-btn" onclick="showPrices()">💰 Ver Precios</button>
        </div>
    `;
    
    botDiv.innerHTML = menuHTML;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

// MODIFICADA: Ahora usa precios actualizados desde la base de datos
function showPrices() {
    const products = JSON.parse(localStorage.getItem('fondaLasFloresProducts')) || [];
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    // Agrupar productos por categoría
    const categories = {};
    products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = [];
        }
        categories[product.category].push(product);
    });
    
    let pricesHTML = `
        💰 <strong>PRECIOS ACTUALIZADOS</strong><br><br>
    `;
    
    // Mostrar algunos productos destacados de cada categoría
    Object.keys(categories).slice(0, 4).forEach(category => {
        const categoryProducts = categories[category];
        pricesHTML += `<strong>${category}:</strong><br>`;
        
        // Mostrar máximo 3 productos por categoría
        categoryProducts.slice(0, 3).forEach(product => {
            pricesHTML += `• ${product.name} - $${product.price.toFixed(2)}<br>`;
        });
        
        pricesHTML += `<br>`;
    });
    
    pricesHTML += `
        <em>💡 ¿Te interesa algún platillo en específico? Puedo darte más detalles.</em>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="showMenu()">📋 Ver Menú Completo</button>
            <button class="quick-btn" onclick="startOrderProcess()">🛒 Ordenar Ahora</button>
        </div>
    `;
    
    botDiv.innerHTML = pricesHTML;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showHours() {
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    botDiv.innerHTML = `
        🕐 <strong>HORARIOS DE ATENCIÓN</strong><br><br>
        
        <strong>Lunes a Domingo:</strong><br>
        • 8:00 AM - 8:00 PM<br><br>
        
        <strong>Servicio a Domicilio:</strong><br>
        • 9:00 AM - 7:30 PM<br><br>
        
        <em>📍 Mariano Matamoros #2, Centro, Jalpan de Serra, Qro.</em><br><br>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="showLocation()">📍 Ver Ubicación</button>
            <button class="quick-btn" onclick="startOrderProcess()">🛒 Ordenar Ahora</button>
        </div>
    `;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showLocation() {
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    botDiv.innerHTML = `
        📍 <strong>UBICACIÓN FONDA LAS FLORES</strong><br><br>
        
        <strong>Dirección:</strong><br>
        Mariano Matamoros #2, Centro<br>
        Jalpan de Serra, Querétaro<br><br>
        
        <strong>Teléfono:</strong> (441) 1157720<br><br>
        
        <em>¡Te esperamos! 🏠</em><br><br>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="openMaps()">🗺️ Abrir en Maps</button>
            <button class="quick-btn" onclick="showHours()">🕐 Ver Horarios</button>
        </div>
    `;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function openMaps() {
    const address = "Mariano Matamoros #2, Centro, Jalpan de Serra, Querétaro";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
}

function startOrderProcess() {
    chatbotState.orderInProgress = true;
    chatbotState.currentStep = 'asking_category';
    
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    botDiv.innerHTML = `
        🛒 <strong>¡GENIAL! VAMOS A HACER TU PEDIDO</strong><br><br>
        
        Te ayudo a agregar productos a tu carrito. ¿Qué categoría te interesa?<br><br>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="showCategoryProducts('Moles')">🍛 Moles</button>
            <button class="quick-btn" onclick="showCategoryProducts('Caldo de Pollo/Res')">🍲 Caldos</button>
            <button class="quick-btn" onclick="showCategoryProducts('Tacos/Gorditas')">🌮 Tacos/Gorditas</button>
            <button class="quick-btn" onclick="showCategoryProducts('Tortas/Hamburguesas')">🥪 Tortas</button>
            <button class="quick-btn" onclick="showCategoryProducts('Bebidas')">🥤 Bebidas</button>
        </div>
        <br>
        <small>O escribe el nombre del platillo que deseas</small>
    `;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

// MODIFICADA: Ahora usa precios actualizados desde la base de datos
function showCategoryProducts(category) {
    const products = JSON.parse(localStorage.getItem('fondaLasFloresProducts')) || [];
    const categoryProducts = products.filter(p => p.category === category);
    
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    if (categoryProducts.length === 0) {
        botDiv.innerHTML = `
            <strong>${category}</strong><br><br>
            <p>No hay productos disponibles en esta categoría.</p>
        `;
    } else {
        let productsHTML = `
            <strong>${category}</strong><br><br>
        `;
        
        categoryProducts.forEach(product => {
            productsHTML += `
                <div class="product-item">
                    <strong>${product.name}</strong> - $${product.price.toFixed(2)}<br>
                    <button class="add-to-cart-btn" onclick="addProductToCart('${product.name}', ${product.price}, '${category}')">
                        ➕ Agregar al Carrito
                    </button>
                </div>
                <br>
            `;
        });
        
        productsHTML += `
            <div class="quick-buttons">
                <button class="quick-btn" onclick="startOrderProcess()">📋 Otra Categoría</button>
                <button class="quick-btn" onclick="finishOrder()">✅ Terminar Pedido</button>
            </div>
        `;
        
        botDiv.innerHTML = productsHTML;
    }
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function addProductToCart(name, price, category) {
    // Usar la función existente addToCart
    addToCart(name, price, category);
    
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    botDiv.innerHTML = `✅ <strong>${name}</strong> agregado al carrito!<br>
                       <small>Puedes continuar agregando productos o terminar tu pedido.</small>`;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function finishOrder() {
    chatbotState.orderInProgress = false;
    
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    botDiv.innerHTML = `
        🎉 <strong>¡PEDIDO LISTO!</strong><br><br>
        
        Has agregado productos a tu carrito. Ahora puedes:<br><br>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="openCartModal(); closeChatbot();">🛒 Ver Carrito</button>
            <button class="quick-btn" onclick="startOrderProcess()">➕ Agregar Más</button>
        </div>
        <br>
        <small>También puedes hacer tu pedido directamente por WhatsApp:</small><br>
        <a href="https://wa.me/524461445561" target="_blank" class="whatsapp-link">📱 Ordenar por WhatsApp</a>
    `;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function handleOrderFlow(message) {
    // Función para manejar el flujo de pedidos (puedes expandirla según necesites)
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    botDiv.innerHTML = `🤖 Estoy procesando tu pedido. Por ahora, usa los botones para seleccionar productos.`;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChat();
    }
}

// NUEVA FUNCIÓN: Para obtener iconos de categoría
function getCategoryIcon(category) {
    const icons = {
        'Moles': '🍛',
        'Caldo de Pollo/Res': '🍲',
        'Para Preparar': '👨‍🍳',
        'Tacos/Gorditas': '🌮',
        'Tortas/Hamburguesas': '🥪',
        'Bebidas': '🥤',
        'Menudo': '🥣'
    };
    return icons[category] || '🍽️';
}

/**
 * Función para abrir el modal de imagen ampliada
 * @param {string} src - Ruta de la imagen a mostrar
 */
function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = src;
        modal.style.display = 'flex';
        
        // Prevenir que el modal se cierre al hacer clic en la imagen
        modalImage.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

/**
 * Función para cerrar el modal de imagen ampliada
 */
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// CÓDIGO ESPECÍFICO PARA EL CARRUSEL DEL INDEX
function initMainCarousel() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    
    // Verificar que existe el carrusel del index
    if (carouselItems.length === 0) return;
    
    let currentIndex = 0;
    let carouselInterval;

    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        carouselDots.forEach(dot => dot.classList.remove('active'));
        
        if (index >= carouselItems.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = carouselItems.length - 1;
        } else {
            currentIndex = index;
        }
        
        carouselItems[currentIndex].classList.add('active');
        carouselDots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetCarouselInterval();
        });
    });

    function startCarouselInterval() {
        carouselInterval = setInterval(nextSlide, 5000);
    }

    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        startCarouselInterval();
    }

    showSlide(currentIndex);
    startCarouselInterval();

    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startCarouselInterval();
        });
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Inicializar solo el carrusel del index
    initMainCarousel();

    // Configurar eventos para el carrito
    const cartButton = document.querySelector('.cart-button');
    if(cartButton) {
        cartButton.addEventListener('click', openCartModal);
    }
    
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartModal);
    }
    
    const closeCheckoutBtn = document.querySelector('.close-checkout');
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    }

    // Configurar evento para el botón "Realizar Pedido" en el modal del carrito
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Configurar evento para el botón "Hacer Pedido" en el modal del formulario
    const orderBtn = document.getElementById('checkout-form')?.querySelector('button[type="button"]');
    if (orderBtn) {
        orderBtn.addEventListener('click', processOrder);
    }

    // Configurar eventos para el chatbot (solo si existe en esta página)
    const chatbotButton = document.querySelector('.chatbot-button');
    if (chatbotButton) {
        chatbotButton.addEventListener('click', toggleChatbot);
    }

    const closeChatbotBtn = document.querySelector('.close-chatbot');
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', closeChatbot);
    }

    const chatbotInput = document.getElementById('chatbot-input');
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', handleChatInput);
    }

    // Cerrar modal de imagen al hacer clic fuera (solo si existe)
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }
});

// Hacer las funciones disponibles globalmente para los onclick en HTML
window.addToCart = addToCart;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.closeCheckoutModal = closeCheckoutModal;
window.changeQuantity = changeQuantity;
window.toggleChatbot = toggleChatbot;
window.sendChat = sendChat;
window.handleChatInput = handleChatInput;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.handleQuickAction = handleQuickAction;
window.showMenu = showMenu;
window.showPrices = showPrices;
window.showHours = showHours;
window.showLocation = showLocation;
window.openMaps = openMaps;
window.startOrderProcess = startOrderProcess;
window.showCategoryProducts = showCategoryProducts;
window.addProductToCart = addProductToCart;
window.finishOrder = finishOrder;