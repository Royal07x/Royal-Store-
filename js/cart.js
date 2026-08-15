/* ========================================
   ROYAL STORE V2
   CART.JS
   VERSION : 2.0
   BUILD : 2026.08.15
======================================== */


/* ========================================
   CART CONFIGURATION
======================================== */

const CART_CONFIG = {

    currencySymbol: "₹",

    minimumOrderAmount: 299,

    deliveryCharge: 0,

    freeDelivery: true,

    maximumQuantity: 5,

    requireLogin: true,

    requireLiveLocation: true,

    orderPrefix: "RS"

};


/* ========================================
   DOM ELEMENTS
======================================== */

const cartContainer = document.getElementById("cart-container");

const emptyCartContainer = document.getElementById("empty-cart");

const cartCount = document.getElementById("cart-count");

const totalProducts = document.getElementById("total-products");

const totalQuantity = document.getElementById("total-quantity");

const totalPrice = document.getElementById("total-price");

const deliveryCharge = document.getElementById("delivery-charge");

const grandTotal = document.getElementById("grand-total");

const checkoutButton = document.getElementById("checkout-btn");

const continueShoppingButton = document.getElementById("continue-shopping-btn");

const clearCartButton = document.getElementById("clear-cart-btn");


/* ========================================
   LOCAL STORAGE MANAGER
======================================== */

let cart = JSON.parse(

    localStorage.getItem("royalCart")

) || [];


function saveCart() {

    localStorage.setItem(

        "royalCart",

        JSON.stringify(cart)

    );

}


function loadCart() {

    cart = JSON.parse(

        localStorage.getItem("royalCart")

    ) || [];

}


/* ========================================
   CART HELPERS
======================================== */

function getCartItemCount() {

    return cart.reduce(

        (total, item) => total + item.quantity,

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
   CART RENDER ENGINE
======================================== */

function renderCart() {

    loadCart();

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        showEmptyCart();

        return;

    }

    hideEmptyCart();

    cart.forEach((item) => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img src="${item.image}" alt="${item.name}">

            </div>

            <div class="cart-item-details">

                <h3>${item.name}</h3>

                <p>${CART_CONFIG.currencySymbol}${item.price}</p>

            </div>

            <div class="cart-item-quantity">

                <button
                    class="qty-minus"
                    data-id="${item.id}">
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    class="qty-plus"
                    data-id="${item.id}">
                    +
                </button>

            </div>

            <div class="cart-item-total">

                ${CART_CONFIG.currencySymbol}${item.price * item.quantity}

            </div>

            <button
                class="remove-item"
                data-id="${item.id}">

                Remove

            </button>

        `;

        cartContainer.appendChild(cartItem);

    });

    updateCartSummary();

}


/* ========================================
   EMPTY CART
======================================== */

function showEmptyCart() {

    if (emptyCartContainer) {

        emptyCartContainer.style.display = "block";

    }

}


function hideEmptyCart() {

    if (emptyCartContainer) {

        emptyCartContainer.style.display = "none";

    }

}


/* ========================================
   REFRESH CART
======================================== */

function refreshCart() {

    renderCart();

}

/* ========================================
   CART SUMMARY
======================================== */

function updateCartSummary() {

    const productCount = cart.length;

    const quantityCount = getCartItemCount();

    const cartTotal = getCartTotal();

    const deliveryAmount = CART_CONFIG.freeDelivery
        ? 0
        : CART_CONFIG.deliveryCharge;

    const finalTotal = cartTotal + deliveryAmount;

    if (totalProducts) {

        totalProducts.textContent = productCount;

    }

    if (totalQuantity) {

        totalQuantity.textContent = quantityCount;

    }

    if (totalPrice) {

        totalPrice.textContent =
            `${CART_CONFIG.currencySymbol}${cartTotal}`;

    }

    if (deliveryCharge) {

        deliveryCharge.textContent =
            CART_CONFIG.freeDelivery
                ? "FREE"
                : `${CART_CONFIG.currencySymbol}${deliveryAmount}`;

    }

    if (grandTotal) {

        grandTotal.textContent =
            `${CART_CONFIG.currencySymbol}${finalTotal}`;

    }

    if (cartCount) {

        cartCount.textContent = quantityCount;

    }

}


/* ========================================
   PRODUCT QUANTITY
======================================== */

function increaseQuantity(productId) {

    const product = cart.find(item => item.id === productId);

    if (!product) return;

    if (product.quantity >= CART_CONFIG.maximumQuantity) {

        alert("Maximum quantity reached.");

        return;

    }

    product.quantity++;

    saveCart();

    refreshCart();

}


function decreaseQuantity(productId) {

    const product = cart.find(item => item.id === productId);

    if (!product) return;

    product.quantity--;

    if (product.quantity <= 0) {

        removeProduct(productId);

        return;

    }

    saveCart();

    refreshCart();

}

/* ========================================
   REMOVE PRODUCT
======================================== */

function removeProduct(productId) {

    const product = cart.find(item => item.id === productId);

    if (!product) return;

    const confirmRemove = confirm(

        `Remove "${product.name}" from cart?`

    );

    if (!confirmRemove) return;

    cart = cart.filter(item => item.id !== productId);

    saveCart();

    refreshCart();

}


/* ========================================
   CLEAR CART
======================================== */

function clearCart() {

    if (cart.length === 0) {

        alert("Your cart is already empty.");

        return;

    }

    const confirmClear = confirm(

        "Are you sure you want to clear your cart?"

    );

    if (!confirmClear) return;

    cart = [];

    saveCart();

    refreshCart();

}


/* ========================================
   EMPTY CART MANAGEMENT
======================================== */

function checkEmptyCart() {

    if (cart.length === 0) {

        showEmptyCart();

        if (cartContainer) {

            cartContainer.innerHTML = "";

        }

    } else {

        hideEmptyCart();

    }

}


/* ========================================
   CONTINUE SHOPPING
======================================== */

function continueShopping() {

    window.location.href = "index.html";

}

/* ========================================
   CHECKOUT SYSTEM
======================================== */

let customerLocation = {

    latitude: null,

    longitude: null,

    googleMapsLink: ""

};


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

const checkoutModal = document.getElementById("checkout-modal");

const getLocationButton = document.getElementById("get-location-btn");

const confirmOrderButton = document.getElementById("confirm-order-btn");


/* ========================================
   OPEN CHECKOUT
======================================== */

function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    if (getCartTotal() < CART_CONFIG.minimumOrderAmount) {

        alert(

            `Minimum order amount is ${CART_CONFIG.currencySymbol}${CART_CONFIG.minimumOrderAmount}.`

        );

        return;

    }

    if (checkoutModal) {

        checkoutModal.classList.add("active");

    }

}


/* ========================================
   CLOSE CHECKOUT
======================================== */

function closeCheckout() {

    if (checkoutModal) {

        checkoutModal.classList.remove("active");

    }

}


/* ========================================
   LIVE LOCATION
======================================== */

function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            customerLocation.latitude = position.coords.latitude;

            customerLocation.longitude = position.coords.longitude;

            customerLocation.googleMapsLink =
                `https://maps.google.com/?q=${customerLocation.latitude},${customerLocation.longitude}`;

            alert("Location captured successfully.");

        },

        function() {

            alert("Location permission denied.");

        }

    );

}


/* ========================================
   ORDER VALIDATION
======================================== */

function validateCheckout() {

    if (!customerName.value.trim()) {

        alert("Enter customer name.");

        return false;

    }

    if (customerMobile.value.trim().length !== 10) {

        alert("Enter valid mobile number.");

        return false;

    }

    if (!customerAddress.value.trim()) {

        alert("Enter address.");

        return false;

    }

    if (!customerCity.value.trim()) {

        alert("Enter city.");

        return false;

    }

    if (!customerState.value.trim()) {

        alert("Enter state.");

        return false;

    }

    if (customerPin.value.trim().length !== 6) {

        alert("Enter valid PIN code.");

        return false;

    }

    if (
        CART_CONFIG.requireLiveLocation &&
        !customerLocation.googleMapsLink
    ) {

        alert("Please allow live location.");

        return false;

    }

    return true;

}

/* ========================================
   WHATSAPP ORDER SYSTEM
======================================== */

function generateOrderId() {

    return `${CART_CONFIG.orderPrefix}${Date.now()}`;

}

function placeCartOrder() {

    if (!validateCheckout()) return;

    const orderId = generateOrderId();

    const orderDate = new Date().toLocaleDateString();

    const orderTime = new Date().toLocaleTimeString();

    let productList = "";

    cart.forEach((item, index) => {

        productList +=

`${index + 1}. ${item.name}
Qty : ${item.quantity}
Price : ${CART_CONFIG.currencySymbol}${item.price}

`;

    });

    const message = `

🛍️ *Royal Store Cart Order*

━━━━━━━━━━━━━━━━━━

🆔 Order ID : ${orderId}

📅 Date : ${orderDate}

⏰ Time : ${orderTime}

━━━━━━━━━━━━━━━━━━

👤 CUSTOMER DETAILS

Name : ${customerName.value}

Mobile : ${customerMobile.value}

Email : ${customerEmail.value || "N/A"}

Address : ${customerAddress.value}

City : ${customerCity.value}

State : ${customerState.value}

PIN : ${customerPin.value}

━━━━━━━━━━━━━━━━━━

📦 PRODUCTS

${productList}

━━━━━━━━━━━━━━━━━━

💰 TOTAL

${CART_CONFIG.currencySymbol}${getCartTotal()}

━━━━━━━━━━━━━━━━━━

📍 LIVE LOCATION

${customerLocation.googleMapsLink}

━━━━━━━━━━━━━━━━━━

Thank You ❤️

Royal Store

`;

    window.open(

`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`,

"_blank"

);

}


/* ========================================
   EVENT LISTENERS
======================================== */

document.addEventListener("click", (event) => {

    const productId = Number(event.target.dataset.id);

    if (event.target.classList.contains("qty-plus")) {

        increaseQuantity(productId);

    }

    if (event.target.classList.contains("qty-minus")) {

        decreaseQuantity(productId);

    }

    if (event.target.classList.contains("remove-item")) {

        removeProduct(productId);

    }

});


if (checkoutButton) {

    checkoutButton.addEventListener(

        "click",

        openCheckout

    );

}


if (clearCartButton) {

    clearCartButton.addEventListener(

        "click",

        clearCart

    );

}


if (continueShoppingButton) {

    continueShoppingButton.addEventListener(

        "click",

        continueShopping

    );

}


if (getLocationButton) {

    getLocationButton.addEventListener(

        "click",

        getCurrentLocation

    );

}


if (confirmOrderButton) {

    confirmOrderButton.addEventListener(

        "click",

        placeCartOrder

    );

}


/* ========================================
   CART INITIALIZATION
======================================== */

function initializeCart() {

    loadCart();

    renderCart();

    updateCartSummary();

    checkEmptyCart();

    console.log("Royal Store Cart Initialized");

}

initializeCart();


/* ========================================
   FUTURE MODULES (LOCKED)
======================================== */

/*
✔ Save For Later
✔ Estimated Delivery Date
✔ Delivery Charge Calculator
✔ Coupon System
✔ Gift Wrap
✔ Order Notes
✔ Cart Recommendations
✔ Recently Removed Products
✔ Wishlist Sync
✔ Product Comparison
✔ Error Handler System
✔ Loader / Skeleton System
*/

