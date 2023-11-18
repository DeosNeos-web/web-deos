document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const categoryDropdown = document.getElementById('category-dropdown');  // Modificado
    const cardContainer = document.getElementById('cardContainer');
    const cartIcon = document.getElementById('cart-icon');
    const cartContent = document.getElementById('cart-content');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('total-value');
    const payButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    let cards = [];
    let cartItems = [];
    let isCartVisible = false;

    // Cargar datos del carrito desde localStorage
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        showCart(); // Mostrar el carrito al cargar la página
    }

    // Desmarcar todos los checkboxes excepto el de 'all' al cargar la página
    categoryDropdown.addEventListener('change', () => {
        filterCards();
    });

    searchInput.addEventListener('input', () => {
        filterCards();
    });

    function filterCards() {
        const selectedCategory = categoryDropdown.value;

        const searchTerm = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const category = card.classList[1];
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const isCategorySelected = selectedCategory === 'all' || selectedCategory === category;
            const isTitleMatching = cardTitle.includes(searchTerm) || searchTerm === '';

            card.style.display = isCategorySelected && isTitleMatching ? 'block' : 'none';
        });
    }

    // ... (código del carrusel)

    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            showProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));

    function showProducts(products) {
        cardContainer.innerHTML = '';
        cards = [];

        products.forEach(product => {
            const card = createProductCard(product);
            cardContainer.appendChild(card);
            cards.push(card);
        });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('card', product.category.toLowerCase());

        const img = document.createElement('img');
        img.src = `Peluches_en_linea/${product.imagePath}`;
        img.alt = product.name;

        const title = document.createElement('h3');
        title.textContent = product.name;

        const price = document.createElement('p');
        price.classList.add('precio');
        price.setAttribute('data-price', product.price.toFixed(0));
        price.textContent = `Precio: $${product.price.toFixed(0)}`;

        const form = document.createElement('form');
        form.classList.add('add-to-cart-form');

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityInput.min = 1;

        const addButton = document.createElement('button');
        addButton.type = 'button';  // Cambiado de 'submit' a 'button'
        addButton.classList.add('add-to-cart');
        addButton.textContent = 'Agregar al carrito';

        addButton.addEventListener('click', function () {
            const productName = title.textContent;
            const productPrice = parseFloat(price.getAttribute('data-price'));
            const quantity = parseInt(quantityInput.value);

            if (!isNaN(quantity) && quantity > 0) {
                addToCart({ name: productName, price: productPrice, quantity: quantity });
            } else {
                console.error('Cantidad no válida:', quantity);
                showErrorNotification('Por favor, ingrese una cantidad válida y positiva.');
            }
        });

        form.appendChild(quantityInput);
        form.appendChild(addButton);

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(form);

        return card;
    }

    function addToCart(product) {
        console.log('Añadiendo al carrito:', product);

        // Convertir la cantidad a un número y verificar si es un número válido y positivo
        const parsedQuantity = parseInt(product.quantity, 10);

        if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
            const existingItemIndex = cartItems.findIndex(item => item.name === product.name);

            if (existingItemIndex !== -1) {
                // Actualizar la cantidad del artículo existente
                cartItems[existingItemIndex].quantity += parsedQuantity;
                cartItems[existingItemIndex].totalPrice = product.price * cartItems[existingItemIndex].quantity;
            } else {
                // Añadir un nuevo artículo al carrito
                const newItem = { name: product.name, quantity: parsedQuantity, totalPrice: product.price * parsedQuantity };
                cartItems.push(newItem);
            }

            showAddToCartNotification(product.name, parsedQuantity);
            showCart();
            saveCartToLocalStorage();
        } else {
            console.error('Cantidad no válida:', product.quantity);
            showErrorNotification('Por favor, ingrese una cantidad válida y positiva.');
        }
    }

    function showAddToCartNotification(productName, quantity) {
        const notification = document.createElement('div');
        notification.classList.add('notification-message', 'show');
        notification.textContent = `${quantity} ${productName}${quantity > 1 ? 's' : ''} ha sido agregado al carrito.`;

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    function showCart() {
        console.log('Mostrando carrito:', cartItems);

        cartList.innerHTML = '';
        cartItems.forEach(item => {
            const listItem = document.createElement('li');

            // Verificar si item.totalPrice es null o NaN y manejarlo adecuadamente
            const totalPrice = (!isNaN(item.totalPrice) && item.totalPrice !== null) ? item.totalPrice.toFixed(0) : 0;

            listItem.textContent = `${item.quantity} - ${item.name} - $${totalPrice}`;

            const removeCheckbox = document.createElement('input');
            removeCheckbox.type = 'checkbox';
            removeCheckbox.classList.add('remove-from-cart-checkbox');
            removeCheckbox.addEventListener('change', () => {
                if (removeCheckbox.checked) {
                    // Preguntar al usuario para confirmar la eliminación
                    const confirmDelete = confirm(`¿Eliminar ${item.quantity} ${item.name}${item.quantity > 1 ? 's' : ''} del carrito?`);

                    if (confirmDelete) {
                        item.markedForRemoval = true;
                    } else {
                        removeCheckbox.checked = false;
                        item.markedForRemoval = false;
                    }
                } else {
                    item.markedForRemoval = false;
                }
            });

            listItem.appendChild(removeCheckbox);
            cartList.appendChild(listItem);
        });

        // Calcular el total solo de los elementos que no están marcados para eliminación
        const total = cartItems.reduce((acc, item) => acc + (item.markedForRemoval ? 0 : (!isNaN(item.totalPrice) ? item.totalPrice : 0)), 0);
        console.log('Total del carrito:', total);
        cartTotal.textContent = `Total: $${total.toFixed(0)}`;

        if (isCartVisible) {
            cartContent.style.display = 'block';
        } else {
            cartContent.style.display = 'none';
        }
    }

    // Crear función para limpiar el carrito
    function clearCart() {
        cartItems = [];
        saveCartToLocalStorage();
        showCart(); // Mostrar el carrito actualizado
    }

    payButton.textContent = 'Pagar';
    payButton.classList.add('pay-button');

    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-from-cart');
    deleteButton.addEventListener('click', () => handleDeleteFromCart());

    payButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Por favor, agregue al menos un elemento al carrito antes de proceder al pago.');
        } else {
            cartItems = cartItems.filter(item => !item.markedForRemoval);
            alert('Procesando el pago. ¡Gracias por tu compra!');
            clearCart(); // Limpiar el carrito después de pagar
            window.location.reload(); // Recargar la página
        }
    });

    cartContent.appendChild(payButton);
    cartContent.appendChild(deleteButton);

    cartIcon.addEventListener('click', () => {
        isCartVisible = !isCartVisible;
        showCart();
    });

    document.addEventListener('click', event => {
        if (!cartContent.contains(event.target) && !cartIcon.contains(event.target)) {
            isCartVisible = false;
            showCart();
        }
    });

    cardContainer.addEventListener('submit', function (event) {
        event.preventDefault();

        if (event.target.classList.contains('add-to-cart-form')) {
            const card = event.target.closest('.card');
            const productName = card.querySelector('h3').textContent;
            const productPrice = parseFloat(card.querySelector('.precio').getAttribute('data-price'));
            const quantity = parseInt(event.target.querySelector('input').value);

            if (!isNaN(quantity) && quantity > 0) {
                addToCart({ name: productName, price: productPrice, quantity: quantity });
            } else {
                console.error('Cantidad no válida:', quantity);

                // Mostrar una notificación de error
                showErrorNotification('Por favor, ingrese una cantidad válida y positiva.');
            }
        }
    });

    // Guardar datos del carrito en localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Manejar la eliminación de elementos del carrito
    function handleDeleteFromCart() {
        cartItems = cartItems.filter(item => !item.markedForRemoval);
        showCart();
        saveCartToLocalStorage();
    }

    // Agregar función para mostrar notificaciones de error
    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification-message', 'error');
        notification.textContent = message;

        document.body.appendChild(notification);
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
            document.body.removeChild(notification);
        }, 3000);
    }
});
