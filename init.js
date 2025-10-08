// init.js - Inicialización de datos
(function() {
    console.log('🔄 Ejecutando init.js...');
    
    // Verificar si ya existen los productos
    if (!localStorage.getItem('fondaLasFloresProducts')) {
        console.log('📦 Creando datos iniciales...');
        
        const initialProducts = [
            // moles (2 productos)
            { id: 1, name: "Pollo en Mole Poblano", category: "Moles", price: 120 },
            { id: 2, name: "Costilla de Puerco en Salsa Verde", category: "Moles", price: 130 },
            
            // caldos (3 productos)
            { id: 3, name: "Caldo de Pollo", category: "Caldo de Pollo/Res", price: 80 },
            { id: 4, name: "Caldo de Res", category: "Caldo de Pollo/Res", price: 90 },
            { id: 5, name: "Menudo (Pancita)", category: "Menudo", price: 85 },
            
            // preparar (5 productos)
            { id: 6, name: "Milanesa de Pollo", category: "Para Preparar", price: 95 },
            { id: 7, name: "Milanesa de Res", category: "Para Preparar", price: 110 },
            { id: 8, name: "Huevos a la Mexicana", category: "Para Preparar", price: 70 },
            { id: 9, name: "Filete de Pescado Empanizado", category: "Para Preparar", price: 120 },
            { id: 10, name: "Bistec de Res Encebollado", category: "Para Preparar", price: 115 },
            
            // tacos-gorditas (5 productos base)
            { id: 11, name: "Gorditas de Migajas", category: "Tacos/Gorditas", price: 65 },
            { id: 12, name: "Gorditas", category: "Tacos/Gorditas", price: 25 },
            { id: 13, name: "Sopes", category: "Tacos/Gorditas", price: 70 },
            { id: 14, name: "Quesadillas", category: "Tacos/Gorditas", price: 60 },
            { id: 15, name: "Tacos", category: "Tacos/Gorditas", price: 15 },
            
            // tortas-hamburguesas (13 productos)
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
            
            // bebidas (9 productos)
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
        console.log('✅ Datos iniciales creados en localStorage - 37 productos');
        
        // También inicializar el carrito vacío si no existe
        if (!localStorage.getItem('fondaLasFloresCart')) {
            localStorage.setItem('fondaLasFloresCart', JSON.stringify([]));
            console.log('🛒 Carrito inicializado');
        }
    } else {
        console.log('ℹ️ Los productos ya están inicializados en localStorage');
    }
})();