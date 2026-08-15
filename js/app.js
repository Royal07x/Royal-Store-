/* ========================================
   ROYAL STORE V2
   APP.JS
   VERSION : 2.0
   BUILD : 2026.08.15
======================================== */


/* ========================================
   PROJECT CONFIGURATION
======================================== */

const CONFIG = {

    /* Website Settings */

    websiteName: "Royal Store",
    websiteVersion: "V2",
    appVersion: "2.0",
    buildNumber: "2026.08.15",
    currencySymbol: "₹",


    /* Business Settings */

    businessName: "Royal Store",
    supportEmail: "support@royalstore.com",
    supportPhone: "+91XXXXXXXXXX",


    /* Social Media Settings */

    whatsappNumber: "91XXXXXXXXXX",
    instagramUrl: "https://instagram.com/yourusername",
    facebookUrl: "https://facebook.com/yourusername",


    /* Store Settings */

    freeDelivery: true,
    deliveryCharge: 0,
    minimumOrderAmount: 299,
    maintenanceMode: false,


    /* Payment Settings */

    cashOnDelivery: true,
    upiPayment: false,
    cardPayment: false,
    netBanking: false,


    /* Delivery Settings */

    requireLogin: true,
    requireLiveLocation: true,


    /* Validation Settings */

    mobileLength: 10,
    pinCodeLength: 6,
    maxProductQuantity: 5,


    /* Order Settings */

    orderPrefix: "RS",
    orderStatus: "Pending"

};


/* ========================================
   PRODUCT DATABASE
======================================== */

const PRODUCTS = [

    // Products will be added here.

];

/* ========================================
   DOM ELEMENTS
======================================== */

const productContainer = document.getElementById("products-container");

const cartCount = document.getElementById("cart-count");

const menuButton = document.getElementById("menu-btn");

const closeMenuButton = document.getElementById("close-menu");

const navigationDrawer = document.getElementById("nav-drawer");

const searchInput = document.getElementById("search-input");

/* ========================================
   PRODUCT DATABASE
======================================== */

const PRODUCTS = [

    {
        id: 1,
        sku: "RS-SHIRT-001",

        name: "Premium Men's Shirt",

        category: "shirts",

        price: 799,

        image: "images/shirt.jpg",

        gallery: [
            "images/shirt.jpg"
        ],

        status: "In Stock",

        availability: true,

        stock: 25,

        maxOrder: 5,

        badge: "Premium",

        tags: [
            "Premium",
            "Men",
            "Cotton",
            "Formal"
        ],

        featured: true,

        trending: true,

        discount: 0,

        rating: 0,

        reviews: 0
    },

    {
        id: 2,
        sku: "RS-JEANS-001",

        name: "Jeans & Cargo Pants",

        category: "jeans",

        price: 1299,

        image: "images/jeans.jpg",

        gallery: [
            "images/jeans.jpg"
        ],

        status: "In Stock",

        availability: true,

        stock: 18,

        maxOrder: 5,

        badge: "Trending",

        tags: [
            "Jeans",
            "Cargo",
            "Men"
        ],

        featured: true,

        trending: true,

        discount: 0,

        rating: 0,

        reviews: 0
    },

    {
        id: 3,
        sku: "RS-BEAUTY-001",

        name: "Beauty & Personal Care",

        category: "beauty",

        price: 499,

        image: "images/beauty.jpg",

        gallery: [
            "images/beauty.jpg"
        ],

        status: "In Stock",

        availability: true,

        stock: 40,

        maxOrder: 5,

        badge: "Best Seller",

        tags: [
            "Beauty",
            "Skincare",
            "Personal Care"
        ],

        featured: true,

        trending: true,

        discount: 0,

        rating: 0,

        reviews: 0
    }

];

/* ========================================
   DOM ELEMENTS
======================================== */

const productContainer = document.getElementById("products-container");

const cartCount = document.getElementById("cart-count");

const menuButton = document.getElementById("menu-btn");

const closeMenuButton = document.getElementById("close-menu");

const navigationDrawer = document.getElementById("nav-drawer");

const searchInput = document.getElementById("search-input");

const categoryButtons = document.querySelectorAll("[data-category]");

const sortSelect = document.getElementById("sort-products");

const checkoutButton = document.getElementById("checkout-btn");


/* ========================================
   LOCAL STORAGE MANAGER
======================================== */

let cart = JSON.parse(localStorage.getItem("royalCart")) || [];

let wishlist = JSON.parse(localStorage.getItem("royalWishlist")) || [];

let recentProducts =
    JSON.parse(localStorage.getItem("royalRecentProducts")) || [];


/* ========================================
   LOCAL STORAGE FUNCTIONS
======================================== */

function saveCart() {
    localStorage.setItem(
        "royalCart",
        JSON.stringify(cart)
    );
}

function loadCart() {
    cart =
        JSON.parse(localStorage.getItem("royalCart")) || [];
}

function saveWishlist() {
    localStorage.setItem(
        "royalWishlist",
        JSON.stringify(wishlist)
    );
}

function loadWishlist() {
    wishlist =
        JSON.parse(localStorage.getItem("royalWishlist")) || [];
}

function saveRecentProducts() {
    localStorage.setItem(
        "royalRecentProducts",
        JSON.stringify(recentProducts)
    );
}

function loadRecentProducts() {
    recentProducts =
        JSON.parse(
            localStorage.getItem("royalRecentProducts")
        ) || [];
}


/* ========================================
   CART HELPERS
======================================== */

function getCartCount() {

    return cart.reduce((total, item) => {

        return total + item.quantity;

    }, 0);

}

function getCartTotal() {

    return cart.reduce((total, item) => {

        return total + (item.price * item.quantity);

    }, 0);

}

function updateCartBadge() {

    if (!cartCount) return;

    cartCount.textContent = getCartCount();

}

/* ========================================
   PRODUCT RENDER ENGINE
======================================== */

function renderProducts(productList = PRODUCTS) {

    if (!productContainer) return;

    productContainer.innerHTML = "";

    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `

            <div class="product-image">

                <img src="${product.image}" alt="${product.name}">

            </div>

            <div class="product-info">

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-price">
                    ${CONFIG.currencySymbol}${product.price}
                </p>

                <div class="product-buttons">

                    <button
                        class="add-cart-btn"
                        data-id="${product.id}">
                        Add to Cart
                    </button>

                    <button
                        class="buy-now-btn"
                        data-id="${product.id}">
                        Buy Now
                    </button>

                    <button
                        class="whatsapp-order-btn"
                        data-id="${product.id}">
                        <i class="fa-brands fa-whatsapp"></i>
                        WhatsApp Order
                    </button>

                </div>

            </div>

        `;

        productContainer.appendChild(productCard);

    });

}


/* ========================================
   PRODUCT HELPERS
======================================== */

function getProductById(productId) {

    return PRODUCTS.find(product => product.id === productId);

}

function refreshProducts() {

    renderProducts(PRODUCTS);

}

/* ========================================
   ADD TO CART SYSTEM
======================================== */

function addToCart(productId) {

    /* Login Check */

    if (CONFIG.requireLogin && localStorage.getItem("loggedIn") !== "true") {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    const product = getProductById(productId);

    if (!product) {

        alert("Product not found.");

        return;

    }

    /* Stock Validation */

    if (!product.availability || product.stock <= 0) {

        alert("This product is currently out of stock.");

        return;

    }

    /* Check Existing Product */

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {

        /* Maximum Quantity Validation */

        if (existingProduct.quantity >= product.maxOrder) {

            alert(`Maximum ${product.maxOrder} quantity allowed.`);

            return;

        }

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1

        });

    }

    saveCart();

    updateCartBadge();

    alert(`${product.name} added to cart successfully.`);

}


/* ========================================
   REMOVE FROM CART
======================================== */

function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();

    updateCartBadge();

}


/* ========================================
   UPDATE PRODUCT QUANTITY
======================================== */

function updateQuantity(productId, action) {

    const item = cart.find(product => product.id === productId);

    if (!item) return;

    if (action === "increase") {

        if (item.quantity >= CONFIG.maxProductQuantity) {

            alert("Maximum quantity reached.");

            return;

        }

        item.quantity++;

    }

    if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            removeFromCart(productId);

            return;

        }

    }

    saveCart();

    updateCartBadge();

}


/* ========================================
   CLEAR CART
======================================== */

function clearCart() {

    cart = [];

    saveCart();

    updateCartBadge();

}

/* ========================================
   BUY NOW SYSTEM
======================================== */

let selectedProduct = null;


/* ========================================
   BUY NOW
======================================== */

function buyNow(productId) {

    /* Login Check */

    if (
        CONFIG.requireLogin &&
        localStorage.getItem("loggedIn") !== "true"
    ) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    /* Get Product */

    const product = getProductById(productId);

    if (!product) {

        alert("Product not found.");

        return;

    }

    /* Stock Validation */

    if (
        !product.availability ||
        product.stock <= 0
    ) {

        alert("This product is currently out of stock.");

        return;

    }

    /* Save Selected Product */

    selectedProduct = {

        ...product,

        quantity: 1

    };

    /* Open Checkout */

    openCheckout();

}


/* ========================================
   OPEN CHECKOUT
======================================== */

function openCheckout() {

    const checkoutModal =
        document.getElementById("checkout-modal");

    if (!checkoutModal) return;

    checkoutModal.classList.add("active");

}


/* ========================================
   CLOSE CHECKOUT
======================================== */

function closeCheckout() {

    const checkoutModal =
        document.getElementById("checkout-modal");

    if (!checkoutModal) return;

    checkoutModal.classList.remove("active");

}


/* ========================================
   ORDER SUMMARY
======================================== */

function updateOrderSummary() {

    const summary =
        document.getElementById("order-summary");

    if (!summary || !selectedProduct) return;

    summary.innerHTML = `

        <h3>${selectedProduct.name}</h3>

        <p>

            Quantity :
            ${selectedProduct.quantity}

        </p>

        <p>

            Price :
            ${CONFIG.currencySymbol}
            ${selectedProduct.price}

        </p>

        <p>

            Total :
            ${CONFIG.currencySymbol}
            ${
                selectedProduct.price *
                selectedProduct.quantity
            }

        </p>

    `;

}

/* ========================================
   DELIVERY INFORMATION
======================================== */

const customerName = document.getElementById("customer-name");

const customerMobile = document.getElementById("customer-mobile");

const customerEmail = document.getElementById("customer-email");

const customerAddress = document.getElementById("customer-address");

const customerCity = document.getElementById("customer-city");

const customerState = document.getElementById("customer-state");

const customerPin = document.getElementById("customer-pin");

const getLocationBtn = document.getElementById("get-location-btn");

const confirmOrderBtn = document.getElementById("confirm-order-btn");


/* ========================================
   LIVE LOCATION SYSTEM
======================================== */

let customerLocation = {

    latitude: null,

    longitude: null,

    googleMapsLink: ""

};


function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported on this device.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function (position) {

            customerLocation.latitude = position.coords.latitude;

            customerLocation.longitude = position.coords.longitude;

            customerLocation.googleMapsLink =
                `https://maps.google.com/?q=${customerLocation.latitude},${customerLocation.longitude}`;

            alert("Live location captured successfully.");

        },

        function () {

            alert("Location permission denied.");

        }

    );

}


/* ========================================
   ORDER VALIDATION
======================================== */

function validateOrder() {

    if (!customerName.value.trim()) {

        alert("Please enter your full name.");

        return false;

    }

    if (
        customerMobile.value.trim().length !==
        CONFIG.mobileLength
    ) {

        alert("Enter a valid mobile number.");

        return false;

    }

    if (!customerAddress.value.trim()) {

        alert("Please enter your address.");

        return false;

    }

    if (!customerCity.value.trim()) {

        alert("Please enter your city.");

        return false;

    }

    if (!customerState.value.trim()) {

        alert("Please enter your state.");

        return false;

    }

    if (
        customerPin.value.trim().length !==
        CONFIG.pinCodeLength
    ) {

        alert("Enter a valid PIN code.");

        return false;

    }

    if (
        CONFIG.requireLiveLocation &&
        !customerLocation.googleMapsLink
    ) {

        alert("Please allow your current location.");

        return false;

    }

    return true;

}

/* ========================================
   WHATSAPP ORDER SYSTEM
======================================== */

function generateOrderId() {

    return `${CONFIG.orderPrefix}${Date.now()}`;

}


function generateOrderDate() {

    return new Date().toLocaleDateString();

}


function generateOrderTime() {

    return new Date().toLocaleTimeString();

}


function placeWhatsAppOrder() {

    if (!validateOrder()) return;

    const product = selectedProduct;

    if (!product) {

        alert("No product selected.");

        return;

    }

    if (product.price < CONFIG.minimumOrderAmount) {

        alert(
            `Minimum order amount is ${CONFIG.currencySymbol}${CONFIG.minimumOrderAmount}.`
        );

        return;

    }

    const orderId = generateOrderId();

    const orderDate = generateOrderDate();

    const orderTime = generateOrderTime();

    const message = `

🛍️ *Royal Store Order*

━━━━━━━━━━━━━━━━━━

🆔 Order ID : ${orderId}

📅 Date : ${orderDate}

⏰ Time : ${orderTime}

━━━━━━━━━━━━━━━━━━

👤 Customer

Name : ${customerName.value}

Mobile : ${customerMobile.value}

Email : ${customerEmail.value || "N/A"}

Address : ${customerAddress.value}

City : ${customerCity.value}

State : ${customerState.value}

PIN : ${customerPin.value}

━━━━━━━━━━━━━━━━━━

📦 Product

Name : ${product.name}

SKU : ${product.sku}

Quantity : ${product.quantity}

Price : ${CONFIG.currencySymbol}${product.price}

━━━━━━━━━━━━━━━━━━

💰 Total

${CONFIG.currencySymbol}${product.price * product.quantity}

━━━━━━━━━━━━━━━━━━

📍 Live Location

${customerLocation.googleMapsLink}

━━━━━━━━━━━━━━━━━━

Thank You ❤️

Royal Store

`;

    window.open(

        `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,

        "_blank"

    );

}


/* ========================================
   EVENT LISTENERS
======================================== */

document.addEventListener("click", (event) => {

    if (event.target.classList.contains("add-cart-btn")) {

        addToCart(Number(event.target.dataset.id));

    }

    if (event.target.classList.contains("buy-now-btn")) {

        buyNow(Number(event.target.dataset.id));

        updateOrderSummary();

    }

    if (event.target.classList.contains("whatsapp-order-btn")) {

        buyNow(Number(event.target.dataset.id));

        updateOrderSummary();

    }

});


if (getLocationBtn) {

    getLocationBtn.addEventListener(

        "click",

        getCurrentLocation

    );

}


if (confirmOrderBtn) {

    confirmOrderBtn.addEventListener(

        "click",

        placeWhatsAppOrder

    );

}


if (menuButton) {

    menuButton.addEventListener(

        "click",

        () => navigationDrawer.classList.add("active")

    );

}


if (closeMenuButton) {

    closeMenuButton.addEventListener(

        "click",

        () => navigationDrawer.classList.remove("active")

    );

}


/* ========================================
   APP INITIALIZATION
======================================== */

function initializeApp() {

    loadCart();

    loadWishlist();

    loadRecentProducts();

    renderProducts();

    updateCartBadge();

    console.log(

        `${CONFIG.websiteName} ${CONFIG.websiteVersion} Loaded Successfully`

    );

}


initializeApp();
