
 const BASE_URL = 'https://backend-6-898a.onrender.com'
;

let page = 1;
const limit = 10;


// ===================== LOAD PRODUCTS =====================
async function loadProducts() {
  try {
    const res = await fetch(`${BASE_URL}/api/products?page=${page}&limit=${limit}`);
    const products = await res.json();
    const container = document.getElementById('products');

    products.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('product-card');
      div.innerHTML = `
        <h3>${p.title || 'Unnamed Product'}</h3>
        <p>${p.description || ''}</p>
        <p>KES ${Number(p.price || 0)}</p>
        <button class="add-cart-btn">Add to Cart</button>
      `;
      container.appendChild(div);

      // Add to cart event
      div.querySelector('.add-cart-btn').addEventListener('click', () => {
        addToCart(p);
      });
    });

    page++;
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ===================== CART MANAGEMENT =====================
function addToCart(product) {
  if (!product || !product.title) {
    console.error("Invalid product object:", product);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.push({
    id: product._id || product.id || Date.now(), // fallback id
    name: product.title,
    price: Number(product.price) || 0,
    cartItemId: Date.now() + Math.random() // unique for each cart instance
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
  updateCartCount();
}

function removeFromCart(cartItemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.cartItemId != cartItemId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
  updateCartCount();
}

// ===================== CART DISPLAY =====================
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalCount = document.getElementById('cart-total');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li>Your cart is empty</li>';
  } else {
    cart.forEach(item => {
      const price = Number(item.price) || 0;
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
        <span class="cart-item-name">${item.name}</span> - 
        <span class="cart-item-price">KES ${price.toFixed(2)}</span>
        <button class="remove-btn">Remove</button>
      `;
      cartItemsContainer.appendChild(li);

      // Attach remove handler per item
      li.querySelector('.remove-btn').addEventListener('click', () => {
        removeFromCart(item.cartItemId);
      });

      total += price;
    });
  }

  totalCount.textContent = total.toFixed(2);
}

// ===================== UPDATE CART COUNT =====================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').innerText = cart.length;
}

// ===================== CART TOGGLE & CHECKOUT =====================
document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cart-btn');
  const cartPanel = document.getElementById('cart-panel');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartBtn.addEventListener('click', () => {
    cartPanel.classList.toggle('hidden');
    renderCartItems();
  });

  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

  updateCartCount();
  renderCartItems(); // populate cart on page load
});

// ===================== INFINITE SCROLL =====================
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) loadProducts();
});

// ===================== INITIAL LOAD =====================
window.onload = loadProducts;
