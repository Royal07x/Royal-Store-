/* ========================================
   ROYAL STORE V2
   APP.JS
   VERSION : 2.0
   BUILD : LOCKED
======================================== */


/* ========================================
   APP CONFIGURATION
======================================== */

const APP_CONFIG = {

    appName: "Royal Store",

    version: "2.0",

    currencySymbol: "₹",

    maximumQuantity: 5,

    minimumOrderAmount: 299,

    requireLogin: true,

    enableBuyNow: true,

    enableWhatsAppOrder: true,

    enableWishlist: false,

    debugMode: false

};


/* ========================================
   LOCAL STORAGE KEYS
======================================== */

const STORAGE_KEYS = {

    CART: "royalCart",

    USER: "royalUser",

    LOGIN: "royalLoggedIn",

    REMEMBER: "royalRemember"

};


/* ========================================
   DOM ELEMENTS
======================================== */

const productContainer =
    document.getElementById("productsContainer");

const cartCount =
    document.getElementById("cartCount");

const searchInput =
    document.getElementById("search-input");

const categoryFilter =
    document.getElementById("category-filter");

const sortProducts =
    document.getElementById("sort-products");

const loadingScreen =
    document.getElementById("loading-screen");


/* ========================================
   GLOBAL VARIABLES
======================================== */

let products = [];

let cart = [];

let filteredProducts = [];

let selectedCategory = "all";


/* ========================================
   APP READY
======================================== */

console.log(

    "Royal Store App Loaded"

);

/* ========================================
   PRODUCT DATABASE
======================================== */

const PRODUCT_DATABASE = [

    {
        id: 1,
        name: "Premium Men's Shirt",
        category: "shirt",
        price: 799,
        image: "images/shirt.jpg",
        badge: "Best Seller",
        stock: true
    },

    {
        id: 2,
        name: "Jeans & Cargo Pants",
        category: "pants",
        price: 999,
        image: "images/cargo.jpg",
        badge: "Trending",
        stock: true
    },

    {
        id: 3,
        name: "Premium Sneakers",
        category: "sneakers",
        price: 1499,
        image: "images/sneakers.jpg",
        badge: "New",
        stock: true
    },

    {
        id: 4,
        name: "Beauty & Personal Care",
        category: "beauty",
        price: 499,
        image: "images/beauty.jpg",
        badge: "Popular",
        stock: true
    }

];


/* ========================================
   PRODUCT LOADER
======================================== */

function loadProducts() {

    products = [...PRODUCT_DATABASE];

    filteredProducts = [...PRODUCT_DATABASE];

}


/* ========================================
   PRODUCT FINDER
======================================== */

function getProductById(productId) {

    return products.find(

        product => product.id === productId

    );

}


/* ========================================
   PRODUCT VALIDATION
======================================== */

function validateProduct(product) {

    if (!product) return false;

    if (!product.id) return false;

    if (!product.name) return false;

    if (typeof product.price !== "number") return false;

    if (!product.image) return false;

    return true;

}


/* ========================================
   IMAGE VALIDATION
======================================== */

function validateProductImages() {

    products.forEach(product => {

        if (!product.image) {

            console.warn(

                `Image Missing : ${product.name}`

            );

        }

    });

}


/* ========================================
   LOAD DATABASE
======================================== */

loadProducts();

validateProductImages();

/* ========================================
   CART STORAGE MANAGER
======================================== */

function loadCart() {

    cart = JSON.parse(

        localStorage.getItem(

            STORAGE_KEYS.CART

        )

    ) || [];

}


function saveCart() {

    localStorage.setItem(

        STORAGE_KEYS.CART,

        JSON.stringify(cart)

    );

}


/* ========================================
   CART HELPERS
======================================== */

function getCartItemCount() {

    return cart.reduce(

        (total, item) =>

            total + item.quantity,

        0

    );

}


function getCartTotal() {

    return cart.reduce(

        (total, item) =>

            total + (item.price * item.quantity),

        0

    );

}


/* ========================================
   CART COUNT UI
======================================== */

function updateCartCount() {

    if (!cartCount) return;

    cartCount.textContent =

        getCartItemCount();

}


/* ========================================
   CART REFRESH
======================================== */

function refreshCart() {

    loadCart();

    updateCartCount();

}


/* ========================================
   CART PRODUCT CHECK
======================================== */

function getCartProduct(productId) {

    return cart.find(

        item => item.id === productId

    );

}


/* ========================================
   INITIAL CART LOAD
======================================== */

loadCart();

updateCartCount();

/* ========================================
   ADD TO CART ENGINE
======================================== */

function addToCart(productId) {
   
   console.log("Add To Cart Clicked");

    if (

        APP_CONFIG.requireLogin &&

        !RoyalAuth.isLoggedIn()

    ) {

        showToast(

            "Please login first."

        );

        setTimeout(() => {

            window.location.href =

                "login.html";

        }, 800);

        return;

    }

    const product =

        getProductById(productId);

    if (

        !validateProduct(product)

    ) {

        showToast(

            "Product not found."

        );

        return;

    }

    const existingItem =

        getCartProduct(productId);

    if (existingItem) {

        increaseCartQuantity(

            productId

        );

        return;

    }

    cart.push({

        id: product.id,

        name: product.name,

        price: product.price,

        image: product.image,

        quantity: 1

    });

    saveCart();

    updateCartCount();

    showToast(

        "Added to cart."

    );

}


/* ========================================
   CART QUANTITY
======================================== */

function increaseCartQuantity(productId) {

    const item =

        getCartProduct(productId);

    if (!item) return;

    if (

        item.quantity >=

        APP_CONFIG.maximumQuantity

    ) {

        showToast(

            "Maximum quantity reached."

        );

        return;

    }

    item.quantity++;

    saveCart();

    updateCartCount();

    showToast(

        "Cart updated."

    );

}


/* ========================================
   ADD TO CART BUTTONS
======================================== */

function bindAddToCartButtons() {

    const buttons =

        document.querySelectorAll(

            ".add-cart"

        );

    buttons.forEach(button => {

        button.addEventListener(

            "click",

            function () {

                addToCart(

                    Number(

                        this.dataset.id

                    )

                );

            }

        );

    });

}

/* ========================================
   BUY NOW SYSTEM
======================================== */

function buyNow(productId) {
   console.log("Buy Now Clicked");

    if (

        APP_CONFIG.requireLogin &&

        !RoyalAuth.isLoggedIn()

    ) {

        showToast(

            "Please login first."

        );

        setTimeout(() => {

            window.location.href =

                "login.html";

        }, 800);

        return;

    }

    const product =

        getProductById(productId);

    if (

        !validateProduct(product)

    ) {

        showToast(

            "Product not found."

        );

        return;

    }

    const existingItem =

        getCartProduct(productId);

    if (existingItem) {

        existingItem.quantity = 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }

    saveCart();

    updateCartCount();

    showToast(

        "Redirecting to checkout..."

    );

    setTimeout(() => {

        window.location.href =

            "cart.html";

    }, 600);

}


/* ========================================
   BUY NOW BUTTONS
======================================== */

function bindBuyNowButtons() {

    const buttons =

        document.querySelectorAll(

            ".buy-now"

        );

    buttons.forEach(button => {

        button.addEventListener(

            "click",

            function () {

                buyNow(

                    Number(

                        this.dataset.id

                    )

                );

            }

        );

    });

}


/* ========================================
   PRODUCT BUTTON INITIALIZER
======================================== */

function initializeProductButtons() {

    bindAddToCartButtons();

    bindBuyNowButtons();

}
/* ========================================
   WHATSAPP ORDER HELPERS
======================================== */

function formatCurrency(amount) {

    return `${APP_CONFIG.currencySymbol}${amount}`;

}


function generateWhatsAppProductList() {

    if (cart.length === 0) {

        return "No products";

    }

    return cart.map(

        (item, index) =>

`${index + 1}. ${item.name}
Qty : ${item.quantity}
Price : ${formatCurrency(item.price)}
Subtotal : ${formatCurrency(item.price * item.quantity)}`

    ).join("\n\n");

}


/* ========================================
   ORDER INFORMATION
======================================== */

function generateOrderInformation() {

    return {

        orderId:

            "RS" + Date.now(),

        orderDate:

            new Date().toLocaleDateString(),

        orderTime:

            new Date().toLocaleTimeString(),

        totalItems:

            getCartItemCount(),

        totalPrice:

            getCartTotal()

    };

}


/* ========================================
   WHATSAPP MESSAGE
======================================== */

function generateWhatsAppMessage() {

    const order =

        generateOrderInformation();

    return `🛍️ *Royal Store Order*

━━━━━━━━━━━━━━━━━━

🆔 Order ID : ${order.orderId}

📅 Date : ${order.orderDate}

⏰ Time : ${order.orderTime}

━━━━━━━━━━━━━━━━━━

📦 PRODUCTS

${generateWhatsAppProductList()}

━━━━━━━━━━━━━━━━━━

🛒 Total Items : ${order.totalItems}

💰 Grand Total : ${formatCurrency(order.totalPrice)}

━━━━━━━━━━━━━━━━━━

Thank You ❤️
Royal Store`;

}


/* ========================================
   OPEN WHATSAPP
======================================== */

function openWhatsAppOrder() {

    if (cart.length === 0) {

        showToast(

            "Your cart is empty."

        );

        return;

    }

    const whatsappURL =

`https://wa.me/918791139418?text=${encodeURIComponent(generateWhatsAppMessage())}`;

    window.open(

        whatsappURL,

        "_blank"

    );

}

/* ========================================
   PRODUCT RENDER ENGINE
======================================== */

function renderProducts(productList = filteredProducts) {

    if (!productContainer) return;

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =

            `<div class="no-products">
                <h3>No Products Found</h3>
            </div>`;

        return;

    }

    productList.forEach(product => {

        productContainer.innerHTML += `

        <div class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}">

            </div>

            <div class="product-details">

                <span class="product-badge">

                    ${product.badge}

                </span>

                <h3>

                    ${product.name}

                </h3>

                <h4>

                    ${formatCurrency(product.price)}

                </h4>

            </div>

            <div class="product-buttons">

                <button
                    class="add-cart"
                    data-id="${product.id}">

                    Add To Cart

                </button>

                <button
                    class="buy-now"
                    data-id="${product.id}">

                    Buy Now

                </button>

            </div>

        </div>

        `;

    });

    initializeProductButtons();

}


/* ========================================
   SEARCH PRODUCTS
======================================== */

function searchProducts(keyword) {

    keyword =

        keyword

        .trim()

        .toLowerCase();

    filteredProducts =

        products.filter(product =>

            product.name

            .toLowerCase()

            .includes(keyword)

        );

    renderProducts();

}


/* ========================================
   CATEGORY FILTER
======================================== */

function filterProducts(category) {

    selectedCategory = category;

    if (category === "all") {

        filteredProducts =

            [...products];

    }

    else {

        filteredProducts =

            products.filter(

                product =>

                product.category === category

            );

    }

    renderProducts();

}

/* ========================================
   SORT PRODUCTS
======================================== */

function sortProductList(sortType) {

    switch (sortType) {

        case "low-high":

            filteredProducts.sort(

                (a, b) => a.price - b.price

            );

            break;

        case "high-low":

            filteredProducts.sort(

                (a, b) => b.price - a.price

            );

            break;

        case "a-z":

            filteredProducts.sort(

                (a, b) =>

                    a.name.localeCompare(b.name)

            );

            break;

        case "z-a":

            filteredProducts.sort(

                (a, b) =>

                    b.name.localeCompare(a.name)

            );

            break;

        default:

            filteredProducts = [...products];

    }

    renderProducts();

}


/* ========================================
   SEARCH EVENT
======================================== */

if (searchInput) {

    searchInput.addEventListener(

        "input",

        function () {

            searchProducts(

                this.value

            );

        }

    );

}


/* ========================================
   CATEGORY EVENT
======================================== */

if (categoryFilter) {

    categoryFilter.addEventListener(

        "change",

        function () {

            filterProducts(

                this.value

            );

        }

    );

}


/* ========================================
   SORT EVENT
======================================== */

if (sortProducts) {

    sortProducts.addEventListener(

        "change",

        function () {

            sortProductList(

                this.value

            );

        }

    );

}


/* ========================================
   UI REFRESH
======================================== */

function refreshProducts() {

    loadProducts();

    loadCart();

    updateCartCount();

    renderProducts();

}

/* ========================================
   ERROR HANDLER
======================================== */

window.addEventListener(

    "error",

    function (event) {

        console.error(

            "Royal Store Error:",

            event.message

        );

        if (APP_CONFIG.debugMode) {

            console.log(event);

        }

    }

);


/* ========================================
   SAFE DOM HELPER
======================================== */

function getElement(id) {

    return document.getElementById(id);

}


function getElements(selector) {

    return document.querySelectorAll(selector);

}


/* ========================================
   PAGE INFORMATION
======================================== */

function getCurrentPage() {

    return window.location.pathname

        .split("/")

        .pop();

}


/* ========================================
   APPLICATION STATUS
======================================== */

function isCartEmpty() {

    return cart.length === 0;

}


function isUserLoggedIn() {

    return localStorage.getItem(

        STORAGE_KEYS.LOGIN

    ) === "true";

}


/* ========================================
   LOADING SYSTEM
======================================== */

function showLoader() {

    if (!loadingScreen) return;

    loadingScreen.style.display = "flex";

}


function hideLoader() {

    if (!loadingScreen) return;

    loadingScreen.style.display = "none";

}


/* ========================================
   APPLICATION UTILITIES
======================================== */

function reloadApplication() {

    refreshProducts();

}


function resetApplication() {

    loadProducts();

    loadCart();

    filteredProducts = [...products];

    updateCartCount();

    renderProducts();

}


/* ========================================
   DEBUG MODE
======================================== */

if (APP_CONFIG.debugMode) {

    console.log(

        "Royal Store App Debug Mode Enabled"

    );

    console.log(

        "Current Page:",

        getCurrentPage()

    );

}

/* ========================================
   APPLICATION INITIALIZATION
======================================== */

function initializeApp() {

    loadProducts();

    loadCart();

    filteredProducts = [...products];

    updateCartCount();

    renderProducts();

    console.log(

        `${APP_CONFIG.appName} v${APP_CONFIG.version} Initialized`

    );

}


/* ========================================
   DOM READY
======================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        initializeApp();

    }

);


/* ========================================
   GLOBAL APP API
======================================== */

window.RoyalStore = {

    addToCart,

    buyNow,

    openWhatsAppOrder,

    refreshProducts,

    reloadApplication,

    resetApplication,

    getCartItemCount,

    getCartTotal,

    showToast

};


/* ========================================
   FUTURE MODULES (LOCKED)
======================================== */

/*

✔ Wishlist System

✔ Recently Viewed Products

✔ Product Comparison

✔ Smart Search

✔ Product Reviews

✔ Product Ratings

✔ Discount Engine

✔ Coupon System

✔ Flash Sale

✔ Recommended Products

✔ Multi Currency

✔ Multi Language

✔ Dark Mode

✔ Push Notifications

✔ Stock Management

✔ Inventory Sync

✔ Payment Gateway

✔ Order Tracking

✔ AI Product Recommendation

✔ Progressive Web App (PWA)

*/


/* ========================================
   END OF APP.JS
   ROYAL STORE V2
   VERSION : 2.0
   BUILD : LOCKED
======================================== */
