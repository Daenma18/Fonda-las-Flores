// CARRITO DE COMPRAS
// Variables para el carrito
let cart = JSON.parse(localStorage.getItem('fondaLasFloresCart')) || [];

// Función para inicializar productos si no existen
function initializeProducts() {
    if (!localStorage.getItem('fondaLasFloresProducts')) {
        console.log('🔄 Inicializando productos desde carrito.js...');
        
        const initialProducts = [
            // Moles (2 productos)
            { id: 1, name: "Pollo en Mole Poblano", category: "Moles", price: 120 },
            { id: 2, name: "Costilla de Puerco en Salsa Verde", category: "Moles", price: 130 },
            
            // Caldos (3 productos)
            { id: 3, name: "Caldo de Pollo", category: "Caldo de Pollo/Res", price: 80 },
            { id: 4, name: "Caldo de Res", category: "Caldo de Pollo/Res", price: 90 },
            { id: 5, name: "Menudo (Pancita)", category: "Menudo", price: 85 },
            
            // Para Preparar (5 productos)
            { id: 6, name: "Milanesa de Pollo", category: "Para Preparar", price: 95 },
            { id: 7, name: "Milanesa de Res", category: "Para Preparar", price: 110 },
            { id: 8, name: "Huevos a la Mexicana", category: "Para Preparar", price: 70 },
            { id: 9, name: "Filete de Pescado Empanizado", category: "Para Preparar", price: 120 },
            { id: 10, name: "Bistec de Res Encebollado", category: "Para Preparar", price: 115 },
            
            // Tacos/Gorditas (5 productos base)
            { id: 11, name: "Gorditas de Migajas", category: "Tacos/Gorditas", price: 65 },
            { id: 12, name: "Gorditas", category: "Tacos/Gorditas", price: 25 },
            { id: 13, name: "Sopes", category: "Tacos/Gorditas", price: 70 },
            { id: 14, name: "Quesadillas", category: "Tacos/Gorditas", price: 60 },
            { id: 15, name: "Tacos", category: "Tacos/Gorditas", price: 15 },
            
            // Tortas/Hamburguesas (13 productos)
            { id: 16, name: "Torta de Milanesa de Res", category: "Tortas/Hamburguesas", price: 90 },
            { id: 17, name: "Torta de Pierna Adobada", category: "Tortas/Hamburguesas", price: 85 },
            { id: 18, name: "Torta de Jamón", category: "Tortas/Hamburguesas", price: 70 },
            { id: 19, name: "Torta de Chorizo", category: "Tortas/Hamburguesas", price: 75 },
            { id: 20, name: "Torta de Chilaquiles", category: "Tortas/Hamburguesas", price: 80 },
            { id: 21, name: "Hamburguesa Clásica", category: "Tortas/Hamburguesas", price: 85 },
            { id: 22, name: "Hamburguesa Especial", category: "Tortas/Hamburguesas", price: 120 },
            { id: 23, name: "Sincronizadas", category: "Tortas/Hamburguesas", price: 75 },
            { id: 24, name: "Sincronizadas Especiales", category: "Tortas/Hamburguesas", price: 90 },
            { id: 25, name: "Sándwich de Pollo", category: "Tortas/Hamburguesas", price: 65 },
            { id: 26, name: "Sándwich Club", category: "Tortas/Hamburguesas", price: 95 },
            { id: 27, name: "Salchipapas", category: "Tortas/Hamburguesas", price: 80 },
            { id: 28, name: "Salchipapas Especiales", category: "Tortas/Hamburguesas", price: 110 },
            
            // Bebidas (9 productos)
            { id: 29, name: "Licuados", category: "Bebidas", price: 35 },
            { id: 30, name: "Limonada", category: "Bebidas", price: 25 },
            { id: 31, name: "Naranjada", category: "Bebidas", price: 30 },
            { id: 32, name: "Vaso de Leche", category: "Bebidas", price: 20 },
            { id: 33, name: "Café de Olla", category: "Bebidas", price: 25 },
            { id: 34, name: "Agua para Nescafé", category: "Bebidas", price: 15 },
            { id: 35, name: "Jugo de Naranja Natural", category: "Bebidas", price: 40 },
            { id: 36, name: "Refresco", category: "Bebidas", price: 30 },
            { id: 37, name: "Agua de Sabor del Día", category: "Bebidas", price: 25 }
        ];
        
        localStorage.setItem('fondaLasFloresProducts', JSON.stringify(initialProducts));
        console.log('✅ 37 productos inicializados correctamente');
    }
    return JSON.parse(localStorage.getItem('fondaLasFloresProducts')) || [];
}

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
        <br>• 📋 Mostrarte nuestro <strong>menú completo</strong> (37 platillos)
        <br>• 🕐 Informarte sobre <strong>horarios</strong>
        <br>• 📍 Darte nuestra <strong>ubicación</strong>
        <br>• 🛒 Ayudarte a <strong>hacer un pedido</strong>
        <br>• 💰 Consultar <strong>precios</strong>
        <br><br>
        <small>Escribe lo que necesites o selecciona una opción rápida:</small>
        <div class="quick-buttons">
            <button class="quick-btn" onclick="handleQuickAction('menu')">📋 Ver Menú Completo</button>
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
            <br>• 📋 <strong>Menú completo (37 platillos)</strong>
            <br>• 🛒 <strong>Hacer pedidos</strong>
            <br>• 🕐 <strong>Horarios</strong>
            <br>• 📍 <strong>Ubicación</strong>
            <br>• 💰 <strong>Precios</strong>
            <br><br>
            <small>¿Qué te gustaría saber?</small>`;
    }

    messages.appendChild(botDiv);
}

// FUNCIÓN MEJORADA: Ahora muestra TODAS las categorías y 37 productos
function showMenu() {
    // Asegurarse de que los productos estén inicializados
    const products = initializeProducts();
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
        📋 <strong>MENÚ COMPLETO - FONDA LAS FLORES</strong><br>
        <small>${products.length} deliciosos platillos disponibles</small><br><br>
    `;
    
    // Mostrar TODAS las categorías y productos
    Object.keys(categories).forEach(category => {
        menuHTML += `<strong>${getCategoryIcon(category)} ${category.toUpperCase()}</strong><br>`;
        
        categories[category].forEach(product => {
            menuHTML += `• ${product.name} - <strong>$${product.price.toFixed(2)}</strong><br>`;
        });
        
        menuHTML += `<br>`;
    });
    
    menuHTML += `
        <em>💡 ¿Listo para ordenar? Selecciona "Hacer Pedido" para comenzar.</em>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="startOrderProcess()">🛒 Hacer Pedido</button>
            <button class="quick-btn" onclick="showPrices()">💰 Ver Precios</button>
            <button class="quick-btn" onclick="toggleChatbot()">❌ Cerrar Menú</button>
        </div>
    `;
    
    botDiv.innerHTML = menuHTML;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

// FUNCIÓN MEJORADA: Muestra precios de todas las categorías
function showPrices() {
    const products = initializeProducts();
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
        💰 <strong>PRECIOS ACTUALIZADOS - TODAS LAS CATEGORÍAS</strong><br><br>
    `;
    
    // Mostrar TODAS las categorías con algunos productos destacados
    Object.keys(categories).forEach(category => {
        const categoryProducts = categories[category];
        pricesHTML += `<strong>${getCategoryIcon(category)} ${category}:</strong><br>`;
        
        // Mostrar todos los productos de la categoría
        categoryProducts.forEach(product => {
            pricesHTML += `• ${product.name} - $${product.price.toFixed(2)}<br>`;
        });
        
        pricesHTML += `<br>`;
    });
    
    pricesHTML += `
        <em>💡 ¿Te interesa algún platillo en específico? Puedo ayudarte a agregarlo a tu pedido.</em>
        
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

// FUNCIÓN MEJORADA: Muestra TODAS las categorías disponibles
function startOrderProcess() {
    // Asegurarse de que los productos estén inicializados
    initializeProducts();
    
    chatbotState.orderInProgress = true;
    chatbotState.currentStep = 'asking_category';
    
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    botDiv.innerHTML = `
        🛒 <strong>¡EMPEZCEMOS TU PEDIDO!</strong><br><br>
        
        Te ayudo a agregar productos a tu carrito. Selecciona una categoría:<br><br>
        
        <div class="quick-buttons">
            <button class="quick-btn" onclick="showCategoryProducts('Moles')">🍛 Moles</button>
            <button class="quick-btn" onclick="showCategoryProducts('Caldo de Pollo/Res')">🍲 Caldos</button>
            <button class="quick-btn" onclick="showCategoryProducts('Menudo')">🥣 Menudo</button>
            <button class="quick-btn" onclick="showCategoryProducts('Para Preparar')">👨‍🍳 Para Preparar</button>
            <button class="quick-btn" onclick="showCategoryProducts('Tacos/Gorditas')">🌮 Tacos/Gorditas</button>
            <button class="quick-btn" onclick="showCategoryProducts('Tortas/Hamburguesas')">🥪 Tortas/Hamburguesas</button>
            <button class="quick-btn" onclick="showCategoryProducts('Bebidas')">🥤 Bebidas</button>
        </div>
        <br>
        <small>O escribe el nombre exacto del platillo que deseas ordenar</small>
    `;
    
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
}

// FUNCIÓN MEJORADA: Muestra TODOS los productos de cada categoría
function showCategoryProducts(category) {
    const products = initializeProducts();
    const categoryProducts = products.filter(p => p.category === category);
    
    const messages = document.getElementById("chatbot-messages");
    const botDiv = document.createElement("div");
    botDiv.classList.add("bot-message");
    
    if (categoryProducts.length === 0) {
        botDiv.innerHTML = `
            <strong>${getCategoryIcon(category)} ${category}</strong><br><br>
            <p>⚠️ No hay productos disponibles en esta categoría en este momento.</p>
            <p>Por favor selecciona otra categoría.</p>
        `;
    } else {
        let productsHTML = `
            <strong>${getCategoryIcon(category)} ${category}</strong><br>
            <small>${categoryProducts.length} productos disponibles</small><br><br>
        `;
        
        categoryProducts.forEach(product => {
            productsHTML += `
                <div class="product-item" style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
                    <strong>${product.name}</strong><br>
                    <span>Precio: <strong>$${product.price.toFixed(2)}</strong></span><br>
                    <button class="add-to-cart-btn" onclick="addProductToCart('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${category.replace(/'/g, "\\'")}')" style="background: var(--accent-color); color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-top: 5px; font-weight: bold;">
                        ➕ Agregar al Carrito
                    </button>
                </div>
            `;
        });
        
        productsHTML += `
            <br>
            <div class="quick-buttons">
                <button class="quick-btn" onclick="startOrderProcess()">📋 Ver Otras Categorías</button>
                <button class="quick-btn" onclick="finishOrder()">✅ Terminar Pedido</button>
                <button class="quick-btn" onclick="openCartModal(); closeChatbot();">🛒 Ver Carrito Actual</button>
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
    // Inicializar productos primero
    initializeProducts();
    
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
window.initializeProducts = initializeProducts;