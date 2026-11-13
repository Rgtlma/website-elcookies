// =========================================
// EL'COOKIES - INTERACTIONS
// =========================================

// Ganti nomor ini jika nomor WhatsApp bisnis berubah.
// Format: kode negara + nomor, tanpa tanda +, spasi, atau strip.
const WHATSAPP_NUMBER = "6281065129145";

const products = {
  thumbprint: { name: "Thumbprint", price: 45000 },
  nastar: { name: "Kue Nastar", price: 55000 },
  sagu: { name: "Sagu Keju", price: 43000 },
  semprit: { name: "Kue Semprit", price: 49000 },
  choco: { name: "Choco Crunch", price: 50000 },
  kastangel: { name: "Kastangel", price: 55000 },
  salju: { name: "Kue Putri Salju", price: 54000 },
  stick: { name: "Chocolate Stick", price: 45000 }
};

const cart = {};
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const toastMessage = document.getElementById("toastMessage");

const formatRupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

function showToast(message = "Produk ditambahkan ke keranjang") {
  toastMessage.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
  toastMessage.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastMessage.classList.remove("show"), 2200);
}

function addToCart(id) {
  if (!products[id]) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast(`${products[id].name} ditambahkan`);
}

function changeQuantity(id, change) {
  if (!cart[id]) return;
  cart[id] += change;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const totalQty = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const totalPrice = entries.reduce((sum, [id, qty]) => sum + products[id].price * qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatRupiah(totalPrice);
  checkoutBtn.disabled = entries.length === 0;

  if (!entries.length) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>Keranjangmu masih kosong.</p>
        <span>Yuk, pilih cookies favoritmu!</span>
      </div>`;
    return;
  }

  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = products[id];
    return `
      <div class="cart-row">
        <div>
          <h4>${product.name}</h4>
          <span class="cart-price">${formatRupiah(product.price)} / produk</span>
          <div class="quantity-control">
            <button type="button" data-action="minus" data-id="${id}" aria-label="Kurangi jumlah">−</button>
            <span>${qty}</span>
            <button type="button" data-action="plus" data-id="${id}" aria-label="Tambah jumlah">+</button>
          </div>
        </div>
        <button type="button" class="remove-item" data-action="remove" data-id="${id}" aria-label="Hapus produk">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>`;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", () => addToCart(button.dataset.id));
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "plus") changeQuantity(id, 1);
  if (action === "minus") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});

checkoutBtn.addEventListener("click", () => {
  const entries = Object.entries(cart);
  if (!entries.length) return;

  const lines = entries.map(([id, qty]) =>
    `• ${products[id].name} x${qty} = ${formatRupiah(products[id].price * qty)}`
  );
  const total = entries.reduce((sum, [id, qty]) => sum + products[id].price * qty, 0);
  const message = [
    "Halo El'Cookies! Saya ingin memesan:",
    "",
    ...lines,
    "",
    `Total sementara: ${formatRupiah(total)}`,
    "",
    "Mohon informasikan ketersediaan produk dan cara pembayarannya. Terima kasih!"
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

// Product category filter
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    document.querySelectorAll(".product-item").forEach(item => {
      const visible = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !visible);
    });
  });
});

// Contact form: open WhatsApp with the entered message.
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const messageText = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !messageText) return;

  const message = [
    "Halo El'Cookies!",
    "",
    `Nama: ${name}`,
    `Email: ${email}`,
    `Pesan: ${messageText}`
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

// Reveal animation on scroll
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// Close mobile menu after choosing a section
document.querySelectorAll("#mainNav .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("mainNav");
    if (nav.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });
});

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Start with an empty cart
renderCart();
