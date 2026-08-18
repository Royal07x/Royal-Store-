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

    whatsappNumber: "918791139418",

    orderPrefix: "RS",

    minimumOrderAmount: 299,

    deliveryCharge: 0,

    freeDelivery: true,

    maximumQuantity: 5,

    requireLogin: true,

    requireLiveLocation: true,

    mobileLength: 10,

    pinCodeLength: 6,

    toastDuration: 3000,

    animationDuration: 300

};


/* ========================================
   LOCAL STORAGE KEYS
======================================== */

const STORAGE_KEYS = {

    cart: "royalCart",

    login: "loggedIn",

    user: "royalUser",

    orders: "royalOrders"

};


/* ========================================
   ORDER STATUS
======================================== */

const ORDER_STATUS = {

    pending: "Pending",

    confirmed: "Confirmed",

    cancelled: "Cancelled"

};


/* ========================================
   LOCATION OBJECT
======================================== */

let customerLocation = {

    latitude: null,

    longitude: null,

    googleMapsLink: ""

};


/* ========================================
   CART DATA
======================================== */

let cart = [];

/* ========================================
   DOM ELEMENTS
======================================== */

const cartContainer =
    document.getElementById("cart-container");

const emptyCartContainer =
    document.getElementById("empty-cart");

const cartCount =
    document.getElementById("cart-count");

const totalProducts =
    document.getElementById("total-products");

const totalQuantity =
    document.getElementById("total-quantity");

const totalPrice =
    document.getElementById("total-price");

const deliveryCharge =
    document.getElementById("delivery-charge");

const grandTotal =
    document.getElementById("grand-total");

const checkoutButton =
    document.getElementById("checkout-btn");

const continueShoppingButton =
    document.getElementById("continue-shopping-btn");

const clearCartButton =
    document.getElementById("clear-cart-btn");


/* ========================================
   CHECKOUT MODAL
======================================== */

const checkoutModal =
    document.getElementById("checkout-modal");

const checkoutForm =
    document.getElementById("checkout-form");

const confirmOrderButton =
    document.getElementById("confirm-order-btn");

const closeCheckoutButton =
    document.querySelector(".close-checkout");


/* ========================================
   CUSTOMER INPUTS
======================================== */

const cartCustomerName =
    document.getElementById("customer-name");

const cartCustomerMobile =
    document.getElementById("customer-mobile");

const cartCustomerEmail =
    document.getElementById("customer-email");

const cartCustomerAddress =
    document.getElementById("customer-address");

const cartCustomerCity =
    document.getElementById("customer-city");

const cartCustomerState =
    document.getElementById("customer-state");

const cartCustomerPin =
    document.getElementById("customer-pin");


/* ========================================
   LOCATION
======================================== */

const getLocationButton =
    document.getElementById("get-location-btn");


/* ========================================
   CHECKOUT SUMMARY
======================================== */

const checkoutTotalProducts =
    document.getElementById("checkout-total-products");

const checkoutTotalQuantity =
    document.getElementById("checkout-total-quantity");

const checkoutGrandTotal =
    document.getElementById("checkout-grand-total");


/* ========================================
   TOAST POPUP
======================================== */

const toastPopup =
    document.getElementById("toast-popup");

const toastMessage =
    document.getElementById("toast-message");

/* ========================================
   LOCAL STORAGE MANAGER
======================================== */

function loadCart() {

    const storedCart =
        localStorage.getItem(STORAGE_KEYS.cart);

    try {

        cart = storedCart
            ? JSON.parse(storedCart)
            : [];

        if (!Array.isArray(cart)) {

            cart = [];

        }

    } catch (error) {

        console.error(
            "Cart Load Error:",
            error
        );

        cart = [];

    }

}


function saveCart() {

    try {

        localStorage.setItem(

            STORAGE_KEYS.cart,

            JSON.stringify(cart)

        );

    } catch (error) {

        console.error(

            "Cart Save Error:",

            error

        );

    }

}


/* ========================================
   USER SESSION
======================================== */

function isUserLoggedIn() {

    return (

        localStorage.getItem(

            STORAGE_KEYS.login

        ) === "true"

    );

}


/* ========================================
   ORDER STORAGE
======================================== */

function saveOrder(orderData) {

    let orders = [];

    try {

        orders = JSON.parse(

            localStorage.getItem(

                STORAGE_KEYS.orders

            )

        ) || [];

    } catch (error) {

        orders = [];

    }

    orders.push(orderData);

    localStorage.setItem(

        STORAGE_KEYS.orders,

        JSON.stringify(orders)

    );

}


/* ========================================
   CLEAR CART STORAGE
======================================== */

function clearCartStorage() {

    cart = [];

    localStorage.removeItem(

        STORAGE_KEYS.cart

    );

}

/* ========================================
   CART HELPER FUNCTIONS
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


function getCartProductCount() {

    return cart.length;

}


function findCartItem(productId) {

    return cart.find(

        item => item.id === productId

    );

}


function isCartEmpty() {

    return cart.length === 0;

}


function generateOrderId() {

    return `${CART_CONFIG.orderPrefix}${Date.now()}`;

}


/* ========================================
   TOAST POPUP
======================================== */

function showToast(message) {

    if (!toastPopup || !toastMessage) return;

    toastMessage.textContent = message;

    toastPopup.classList.add("show");

    setTimeout(() => {

        toastPopup.classList.remove("show");

    }, CART_CONFIG.toastDuration);

}


/* ========================================
   EMPTY CART UI
======================================== */

function showEmptyCart() {

    if (emptyCartContainer) {

        emptyCartContainer.style.display = "block";

    }

    if (cartContainer) {

        cartContainer.innerHTML = "";

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

    saveCart();

    renderCart();

    updateCartSummary();

}

/* ========================================
   CART RENDER ENGINE
======================================== */

function renderCart() {

    loadCart();

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (isCartEmpty()) {

        showEmptyCart();

        updateCartSummary();

        return;

    }

    hideEmptyCart();

    cart.forEach((item) => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

<div class="cart-item-image">

    <img
        src="${item.image}"
        alt="${item.name}">

</div>

<div class="cart-item-details">

    <h3>${item.name}</h3>

    <p>

        ${CART_CONFIG.currencySymbol}${item.price}

    </p>

    <div class="cart-item-quantity">

        <button
            class="qty-minus"
            data-id="${item.id}">

            <i class="fa-solid fa-minus"></i>

        </button>

        <span>

            ${item.quantity}

        </span>

        <button
            class="qty-plus"
            data-id="${item.id}">

            <i class="fa-solid fa-plus"></i>

        </button>

    </div>

    <div class="cart-item-total">

        Total :

        ${CART_CONFIG.currencySymbol}${item.price * item.quantity}

    </div>

    <button
        class="remove-item"
        data-id="${item.id}">

        <i class="fa-solid fa-trash"></i>

        Remove

    </button>

</div>

`;

        cartContainer.appendChild(cartItem);

    });

    updateCartSummary();

}

/* ========================================
   CART SUMMARY SYSTEM
======================================== */

function updateCartSummary() {

    const productCount = getCartProductCount();

    const quantityCount = getCartItemCount();

    const cartTotal = getCartTotal();

    const deliveryAmount =

        CART_CONFIG.freeDelivery

            ? 0

            : CART_CONFIG.deliveryCharge;

    const finalTotal =

        cartTotal + deliveryAmount;


    /* ------------------------------------
       CART SUMMARY
    ------------------------------------ */

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


    /* ------------------------------------
       HEADER CART COUNT
    ------------------------------------ */

    if (cartCount) {

        cartCount.textContent = quantityCount;

    }


    /* ------------------------------------
       CHECKOUT SUMMARY
    ------------------------------------ */

    if (checkoutTotalProducts) {

        checkoutTotalProducts.textContent = productCount;

    }

    if (checkoutTotalQuantity) {

        checkoutTotalQuantity.textContent = quantityCount;

    }

    if (checkoutGrandTotal) {

        checkoutGrandTotal.textContent =

            `${CART_CONFIG.currencySymbol}${finalTotal}`;

    }

}

/* ========================================
   QUANTITY CONTROL
======================================== */

function increaseQuantity(productId) {

    const product = cart.find(

        item => item.id === productId

    );

    if (!product) return;

    if (
        product.quantity >=
        CART_CONFIG.maximumQuantity
    ) {

        showToast(

            "Maximum quantity reached."

        );

        return;

    }

    product.quantity++;

    saveCart();

    renderCart();

}


function decreaseQuantity(productId) {

    const product = cart.find(

        item => item.id === productId

    );

    if (!product) return;

    product.quantity--;

    if (product.quantity <= 0) {

        removeProduct(productId);

        return;

    }

    saveCart();

    renderCart();

}


/* ========================================
   REMOVE PRODUCT
======================================== */

function removeProduct(productId) {

    const product = cart.find(

        item => item.id === productId

    );

    if (!product) return;

    const confirmRemove = confirm(

        `Remove "${product.name}" from cart?`

    );

    if (!confirmRemove) return;

    cart = cart.filter(

        item => item.id !== productId

    );

    saveCart();

    renderCart();

    showToast(

        "Product removed successfully."

    );

}


/* ========================================
   CLEAR CART
======================================== */

function clearCart() {

    if (isCartEmpty()) {

        showToast(

            "Cart is already empty."

        );

        return;

    }

    const confirmClear = confirm(

        "Clear all cart items?"

    );

    if (!confirmClear) return;

    cart = [];

    saveCart();

    renderCart();

    showToast(

        "Cart cleared successfully."

    );

}

/* ========================================
   CHECKOUT MODAL
   CUSTOMER INFORMATION
======================================== */

const checkoutModal =
    document.getElementById("checkout-modal");

const getLocationButton =
    document.getElementById("get-location-btn");

const confirmOrderButton =
    document.getElementById("confirm-order-btn");


const cartCustomerName =
    document.getElementById("customer-name");

const cartCustomerMobile =
    document.getElementById("customer-mobile");

const cartCustomerEmail =
    document.getElementById("customer-email");

const cartCustomerAddress =
    document.getElementById("customer-address");

const cartCustomerCity =
    document.getElementById("customer-city");

const cartCustomerState =
    document.getElementById("customer-state");

const cartCustomerPin =
    document.getElementById("customer-pin");


let customerLocation = {

    latitude: null,

    longitude: null,

    googleMapsLink: ""

};


/* ========================================
   OPEN CHECKOUT
======================================== */

function openCartCheckout() {

    if (isCartEmpty()) {

        showToast("Your cart is empty.");

        return;

    }

    if (
        getCartTotal() <
        CART_CONFIG.minimumOrderAmount
    ) {

        showToast(

            `Minimum order amount is ${CART_CONFIG.currencySymbol}${CART_CONFIG.minimumOrderAmount}`

        );

        return;

    }

    checkoutModal.classList.add("active");

    updateCartSummary();

}


/* ========================================
   CLOSE CHECKOUT
======================================== */

function closeCartCheckout() {

    checkoutModal.classList.remove("active");

}


/* ========================================
   LIVE LOCATION
======================================== */

function getCartCurrentLocation() {

    if (!navigator.geolocation) {

        showToast(

            "Location is not supported."

        );

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            customerLocation.latitude =
                position.coords.latitude;

            customerLocation.longitude =
                position.coords.longitude;

            customerLocation.googleMapsLink =
                `https://maps.google.com/?q=${customerLocation.latitude},${customerLocation.longitude}`;

            showToast(
                "Location captured successfully."
            );

        },

        () => {

            showToast(
                "Location permission denied."
            );

        }

    );

}

/* ========================================
   CHECKOUT VALIDATION
======================================== */

function validateCheckout() {

    if (!cartCustomerName.value.trim()) {

        showToast("Enter customer name.");

        return false;

    }

    if (
        cartCustomerMobile.value.trim().length !==
        CART_CONFIG.mobileLength
    ) {

        showToast("Enter valid mobile number.");

        return false;

    }

    if (!cartCustomerAddress.value.trim()) {

        showToast("Enter delivery address.");

        return false;

    }

    if (!cartCustomerCity.value.trim()) {

        showToast("Enter city.");

        return false;

    }

    if (!cartCustomerState.value.trim()) {

        showToast("Enter state.");

        return false;

    }

    if (
        cartCustomerPin.value.trim().length !==
        CART_CONFIG.pinCodeLength
    ) {

        showToast("Enter valid PIN code.");

        return false;

    }

    if (
        CART_CONFIG.requireLiveLocation &&
        !customerLocation.googleMapsLink
    ) {

        showToast("Please share live location.");

        return false;

    }

    return true;

}


/* ========================================
   WHATSAPP ORDER SYSTEM
======================================== */

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

    const message = `🛍️ *Royal Store Order*

━━━━━━━━━━━━━━━━━━

🆔 Order ID : ${orderId}

📅 Date : ${orderDate}

⏰ Time : ${orderTime}

━━━━━━━━━━━━━━━━━━

👤 Customer

Name : ${cartCustomerName.value}

Mobile : ${cartCustomerMobile.value}

Email : ${cartCustomerEmail.value || "N/A"}

Address : ${cartCustomerAddress.value}

City : ${cartCustomerCity.value}

State : ${cartCustomerState.value}

PIN : ${cartCustomerPin.value}

━━━━━━━━━━━━━━━━━━

📦 Products

${productList}

━━━━━━━━━━━━━━━━━━

💰 Grand Total

${CART_CONFIG.currencySymbol}${getCartTotal()}

━━━━━━━━━━━━━━━━━━

📍 Live Location

${customerLocation.googleMapsLink}

━━━━━━━━━━━━━━━━━━

Thank You ❤️
Royal Store`;

    window.open(

        `https://wa.me/918791139418?text=${encodeURIComponent(message)}`,

        "_blank"

    );

    showToast("Redirecting to WhatsApp...");

    closeCartCheckout();

}

/* ========================================
   EVENT LISTENERS
======================================== */

document.addEventListener("click", (event) => {

    const productId = Number(
        event.target.dataset.id
    );

    if (
        event.target.classList.contains("qty-plus")
    ) {

        increaseQuantity(productId);

    }

    if (
        event.target.classList.contains("qty-minus")
    ) {

        decreaseQuantity(productId);

    }

    if (
        event.target.classList.contains("remove-item")
    ) {

        removeProduct(productId);

    }

});


if (checkoutButton) {

    checkoutButton.addEventListener(

        "click",

        openCartCheckout

    );

}


if (getLocationButton) {

    getLocationButton.addEventListener(

        "click",

        getCartCurrentLocation

    );

}


if (confirmOrderButton) {

    confirmOrderButton.addEventListener(

        "click",

        placeCartOrder

    );

}


if (continueShoppingButton) {

    continueShoppingButton.addEventListener(

        "click",

        continueShopping

    );

}


if (clearCartButton) {

    clearCartButton.addEventListener(

        "click",

        clearCart

    );

}


/* ========================================
   INITIALIZATION
======================================== */

function initializeCart() {

    loadCart();

    renderCart();

    updateCartSummary();

    checkEmptyCart();

    console.log(

        "Royal Store Cart Initialized Successfully"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initializeCart

);


/* ========================================
   FUTURE MODULES (LOCKED)
======================================== */

/*
01. Coupon System
02. Save For Later
03. Wishlist Sync
04. Delivery Charge Calculator
05. Delivery Tracker
06. Order Timeline
07. UPI Payment
08. Card Payment
09. Net Banking
10. Wallet Payment
11. Invoice Download
12. Order Cancellation
13. Return Request
14. Exchange Request
15. Gift Wrap
16. Order Notes
17. Product Recommendation
18. Recently Viewed
19. Offline Cart Sync
20. Push Notification
21. Skeleton Loader
22. Multi Language
23. Dark Mode
24. AI Product Recommendation
25. Loyalty Reward System
*/


/* ========================================
   END OF CART.JS
   ROYAL STORE V2
   VERIFIED BUILD
======================================== */
