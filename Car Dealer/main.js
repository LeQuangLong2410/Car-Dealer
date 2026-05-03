const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

// Scroll Reveal
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", { ...scrollRevealOption, origin: "right" });
ScrollReveal().reveal(".header__content h1", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".header__content .section__description", { ...scrollRevealOption, delay: 1000 });

ScrollReveal().reveal(".about__image img", { ...scrollRevealOption, origin: "left" });
ScrollReveal().reveal(".about__content .section__subheader", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".about__content .section__header", { ...scrollRevealOption, delay: 1000 });
ScrollReveal().reveal(".about__content .section__description", { ...scrollRevealOption, delay: 1500, interval: 500 });
ScrollReveal().reveal(".about__btn", { ...scrollRevealOption, delay: 2500 });

ScrollReveal().reveal(".banner__image img", { ...scrollRevealOption, origin: "right" });
ScrollReveal().reveal(".banner__content .section__header", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".banner__content .section__description", { ...scrollRevealOption, delay: 1000 });
ScrollReveal().reveal(".banner__btn", { ...scrollRevealOption, delay: 1500 });

// ==================== DỮ LIỆU XE ====================
const carsData = [
  { id: 1, name: "Audi R8", brand: "Audi", price: 150000, image: "assets/fleet-1.jpg" },
  { id: 2, name: "Mercedes AMG", brand: "Mercedes", price: 120000, image: "assets/fleet-2.jpg" },
  { id: 3, name: "BMW M4", brand: "BMW", price: 100000, image: "assets/fleet-3.jpg" },
  { id: 4, name: "Porsche 911", brand: "Porsche", price: 180000, image: "assets/fleet-4.jpg" },
  { id: 5, name: "Mercedes G-Wagon", brand: "Mercedes", price: 200000, image: "assets/fleet-5.jpg" },
  { id: 6, name: "Audi Q8", brand: "Audi", price: 90000, image: "assets/fleet-6.jpg" },
  { id: 7, name: "Porsche Cayenne", brand: "Porsche", price: 110000, image: "assets/fleet-7.jpg" },
  { id: 8, name: "BMW X6", brand: "BMW", price: 95000, image: "assets/fleet-8.jpg" }
];

// ==================== GIỎ HÀNG ====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements cho giỏ hàng
const cartIconBtn = document.getElementById("cart-icon-btn");
const cartBadge = document.getElementById("cart-badge");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartBody = document.getElementById("cart-body");
const cartTotalPrice = document.getElementById("cart-total-price");
const toastNotification = document.getElementById("toast-notification");
const toastMessage = document.getElementById("toast-message");

// Thêm DOM cho nút Checkout
const checkoutBtn = document.getElementById("checkout-btn");   // ← Đảm bảo ID này tồn tại trong HTML

const formatPrice = (price) => "$" + price.toLocaleString();

// ==================== RENDER XE & LỌC ====================
const carListEl = document.getElementById("car-list");
const searchInput = document.getElementById("search-input");
const brandFilter = document.getElementById("brand-filter");
const priceFilter = document.getElementById("price-filter");

function renderCars(cars) {
  if (!carListEl) return;
  carListEl.innerHTML = "";

  if (cars.length === 0) {
    carListEl.innerHTML = `<p class="section__description" style="grid-column: 1 / -1;">Không tìm thấy xe phù hợp.</p>`;
    return;
  }

  cars.forEach(car => {
    const carCard = document.createElement("div");
    carCard.classList.add("feature__card");
    carCard.style.cursor = "pointer";
    carCard.onclick = () => viewDetail(car.id);

    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="car__image" />
      <div class="car__content">
        <h4>${car.name}</h4>
        <p class="section__description" style="text-align: left; margin: 0;">Thương hiệu: ${car.brand}</p>
        <h4 style="color: var(--text-dark);">${formatPrice(car.price)}</h4>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button class="btn car__btn" onclick="event.stopPropagation(); viewDetail(${car.id})">Xem chi tiết</button>
          <button class="btn car__btn" onclick="event.stopPropagation(); addToCart(${car.id})" title="Thêm vào giỏ">
            <i class="ri-shopping-cart-2-line"></i>
          </button>
        </div>
      </div>
    `;
    carListEl.appendChild(carCard);
  });

  ScrollReveal().reveal(".feature__card", { ...scrollRevealOption, interval: 200 });
}

function filterCars() {
  const searchTerm = searchInput.value.toLowerCase();
  const brand = brandFilter.value;
  const priceRange = priceFilter.value;

  const filtered = carsData.filter(car => {
    const matchSearch = car.name.toLowerCase().includes(searchTerm);
    const matchBrand = brand === "all" || car.brand === brand;
    let matchPrice = true;

    if (priceRange === "under-100") matchPrice = car.price < 100000;
    else if (priceRange === "100-150") matchPrice = car.price >= 100000 && car.price <= 150000;
    else if (priceRange === "over-150") matchPrice = car.price > 150000;

    return matchSearch && matchBrand && matchPrice;
  });

  renderCars(filtered);
}

if (searchInput && brandFilter && priceFilter) {
  searchInput.addEventListener("input", filterCars);
  brandFilter.addEventListener("change", filterCars);
  priceFilter.addEventListener("change", filterCars);
  renderCars(carsData);
}

// Chi tiết xe
const carSection = document.getElementById("car");
const detailSection = document.getElementById("car-detail");
const detailBody = document.getElementById("detail-body");

window.viewDetail = function(id) {
  const car = carsData.find(c => c.id === id);
  if (!car) return;

  detailBody.innerHTML = `
    <img src="${car.image}" alt="${car.name}" class="detail__image" />
    <div class="detail__info">
      <h2 class="detail__title">${car.name}</h2>
      <span class="detail__brand">Thương hiệu: ${car.brand}</span>
      <h3 class="detail__price">${formatPrice(car.price)}</h3>
      <p class="detail__desc">Chiếc ${car.name} sang trọng mang đến trải nghiệm lái xe đẳng cấp, với thiết kế tinh tế và hiệu suất vượt trội.</p>
      <button class="btn" onclick="addToCart(${car.id})">Thêm vào giỏ hàng</button>
    </div>
  `;

  carSection.style.display = "none";
  detailSection.style.display = "block";
  window.scrollTo({ top: detailSection.offsetTop - 100, behavior: "smooth" });
};

window.goBack = function() {
  detailSection.style.display = "none";
  carSection.style.display = "block";
  window.scrollTo({ top: carSection.offsetTop - 100, behavior: "smooth" });
};

// ==================== GIỎ HÀNG ====================

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.style.display = totalItems > 0 ? "block" : "none";
    cartBadge.textContent = totalItems;
  }
}

function showToast(msg) {
  if (!toastNotification) return;
  toastMessage.textContent = msg;
  toastNotification.classList.add("show");
  setTimeout(() => toastNotification.classList.remove("show"), 3000);
}

window.addToCart = function (carId) {
  const car = carsData.find(c => c.id === carId);
  if (!car) return;

  const existingItem = cart.find(item => item.id === carId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...car, quantity: 1 });
  }

  saveCart();
  updateCartBadge();
  showToast(`Đã thêm ${car.name} vào giỏ hàng!`);
};

window.updateQuantity = function (id, change) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

window.removeFromCart = function (id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
};

function renderCart() {
  if (!cartBody) return;
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = `<p class="empty-cart-msg" style="text-align:center; padding: 3rem 1rem; color:#888;">Giỏ hàng của bạn đang trống.</p>`;
    if (cartTotalPrice) cartTotalPrice.textContent = "$0";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item__img" />
      <div class="cart-item__info">
        <h4 class="cart-item__name">${item.name}</h4>
        <p class="cart-item__price">${formatPrice(item.price)}</p>
        <div class="cart-item__controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart(${item.id})">
        <i class="ri-delete-bin-line"></i>
      </button>
    `;
    cartBody.appendChild(cartItem);
  });

  if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(total);
}

// ==================== THANH TOÁN ====================
function handleCheckout() {
  if (cart.length === 0) {
    showToast("Giỏ hàng trống! Không thể thanh toán.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmCheckout = confirm(`Tổng số tiền: ${formatPrice(total)}\n\nBạn có chắc chắn muốn thanh toán không?`);

  if (confirmCheckout) {
    showToast("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
    
    // Xóa giỏ hàng sau khi thanh toán
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    
    closeCart();
  }
}

// Event listeners cho giỏ hàng
if (cartIconBtn) {
  cartIconBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    renderCart();
  });
}

const closeCart = () => {
  cartPanel.classList.remove("active");
  cartOverlay.classList.remove("active");
};

if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

//Thanh toán
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", handleCheckout);
}

// Đóng giỏ hàng khi nhấn ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

// Khởi tạo
updateCartBadge();