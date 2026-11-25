 // 1. Manejo de Pestañas
        function switchTab(event, tabId) {
            const tabs = document.querySelectorAll('.tab-content');
            const buttons = document.querySelectorAll('.tab-btn');

            tabs.forEach(tab => tab.classList.remove('active'));
            buttons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        // 2. Lógica del Carrito de Compras
        let cart = [];

        function addToCart(productName, price) {
            cart.push({ name: productName, price: price });
            updateCart();
            alert(`"${productName}" se ha añadido al carrito.`);
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }

        function updateCart() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');

            cartCount.innerText = cart.length;
            cartItems.innerHTML = '';

            let total = 0;

            if (cart.length === 0) {
                cartItems.innerHTML = '<li style="color: var(--text-muted); text-align: center;">El carrito está vacío.</li>';
            } else {
                cart.forEach((item, index) => {
                    total += item.price;
                    const li = document.createElement('li');
                    li.className = 'cart-item';
                    li.innerHTML = `
                        <span>${item.name} - $${item.price} USD</span>
                        <button onclick="removeFromCart(${index})">✕</button>
                    `;
                    cartItems.appendChild(li);
                });
            }

            cartTotal.innerText = `Total: $${total} USD`;
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            modal.classList.toggle('open');
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu pedido! Nos pondremos en contacto contigo para completar la transacción.');
            cart = [];
            updateCart();
            toggleCart();
        }

        // 3. Filtro de Juegos
        function filterGames() {
            const input = document.getElementById('gameSearch').value.toLowerCase();
            const cards = document.querySelectorAll('.game-card');

            cards.forEach(card => {
                const name = card.getAttribute('data-name');
                if (name.includes(input)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // 4. Formulario de Contacto
       // 5. Conexión con el backend (ngrok -> MySQL)
// Si reinicias ngrok (plan gratis), la URL cambia: actualízala aquí.
const BACKEND_URL = 'https://backup-roulette-unrated.ngrok-free.dev';

const API_HEADERS = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
};

async function handleSignUp(event) {
    event.preventDefault();

    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('signup-password').value;
    const messageDiv = document.getElementById('signup-message');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/api/signup`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({ identifier, password })
        });
        const data = await response.json();

        if (response.ok) {
            messageDiv.style.color = '#3fb950';
            messageDiv.textContent = '¡Cuenta creada con éxito! Ya puedes iniciar sesión.';
            document.getElementById('signup-form').reset();
        } else {
            messageDiv.style.color = '#f85149';
            messageDiv.textContent = data.message || 'Error al registrarse.';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.style.color = '#f85149';
        messageDiv.textContent = 'Error de conexión con el servidor.';
    } finally {
        submitBtn.disabled = false;
    }
}

async function handleSignIn(event) {
    event.preventDefault();

    const identifier = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('signin-message');
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.disabled = true;

    try {
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({ identifier, password })
        });
        const data = await response.json();

        if (response.ok) {
            messageDiv.style.color = '#3fb950';
            messageDiv.textContent = '¡Bienvenido!';
            document.getElementById('signin-form').reset();
        } else {
            messageDiv.style.color = '#f85149';
            messageDiv.textContent = data.message || 'Credenciales incorrectas.';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.style.color = '#f85149';
        messageDiv.textContent = 'Error de conexión con el servidor.';
    } finally {
        submitBtn.disabled = false;
    }
}
// 6. Sesión (Sign In / Sign Out)
function updateAuthUI() {
    const user = sessionStorage.getItem('mccainUser');
    const signinBtn = document.getElementById('btn-signin');
    const signupBtn = document.getElementById('btn-signup');
    const signoutBtn = document.getElementById('btn-signout');

    if (user) {
        signinBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        signoutBtn.style.display = 'inline-block';
        signoutBtn.textContent = `Sign Out (${user})`;
    } else {
        signinBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        signoutBtn.style.display = 'none';
    }
}

function signOut() {
    sessionStorage.removeItem('mccainUser');
    updateAuthUI();

    // Volver a la pestaña principal
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('consolas').classList.add('active');
    document.querySelector('.tab-btn').classList.add('active');

    alert('Sesión cerrada.');
}

// Revisa si ya había sesión al cargar la página
document.addEventListener('DOMContentLoaded', updateAuthUI);
