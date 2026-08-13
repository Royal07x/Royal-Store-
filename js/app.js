// ===============================
// ROYAL STORE - APP.JS
// ===============================

// ---------- CART DATA ----------
let cart = Number(localStorage.getItem("cart")) || 0;
let total = Number(localStorage.getItem("total")) || 0;

let cartItems = JSON.parse(
    localStorage.getItem("cartItems")
) || [];

const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

if (cartCount) {
    cartCount.textContent = cart;
}

if (totalPrice) {
    totalPrice.textContent = total;
}


// ---------- PRODUCTS ----------
const buttons = document.querySelectorAll(".product .add-cart");

const products = [
    {
        name: "Premium Shirt",
        price: 799,
        qty: 1
    },
    {
        name: "Stylish Pant",
        price: 999,
        qty: 1
    },
    {
        name: "Beauty Kit",
        price: 499,
        qty: 1
    }
];


// ---------- ADD TO CART ----------
buttons.forEach((button, index) => {

    button.addEventListener("click", () => {

        cartItems.push({
            ...products[index]
        });

        cart = cartItems.reduce(
            (sum, item) => sum + item.qty,
            0
        );

        total = cartItems.reduce(
            (sum, item) =>
                sum + (item.price * item.qty),
            0
        );

        localStorage.setItem(
            "cartItems",
            JSON.stringify(cartItems)
        );

        localStorage.setItem("cart", cart);
        localStorage.setItem("total", total);

        if (cartCount) {
            cartCount.textContent = cart;
        }

        if (totalPrice) {
            totalPrice.textContent = total;
        }

        updateNotification();

        showRoyalPopup("Product Cart me add ho gaya!");
    });

});


// =================================================
// HOME PAGE → ORDER ON WHATSAPP
// Product Cart me add hoga → cart.html open hoga
// =================================================

const loginModal = document.getElementById("loginModal");

document.querySelectorAll(".whatsapp-order").forEach(btn => {

    btn.addEventListener("click", () => {

        const product = btn.dataset.product;
        const price = Number(btn.dataset.price);

        // Check product already exists
        const existingIndex = cartItems.findIndex(
            item => item.name === product
        );

        if (existingIndex !== -1) {

            cartItems[existingIndex].qty++;

        } else {

            cartItems.push({
                name: product,
                price: price,
                qty: 1
            });

        }

        // Update cart
        cart = cartItems.reduce(
            (sum, item) => sum + item.qty,
            0
        );

        total = cartItems.reduce(
            (sum, item) =>
                sum + (item.price * item.qty),
            0
        );

        // Save cart
        localStorage.setItem(
            "cartItems",
            JSON.stringify(cartItems)
        );

        localStorage.setItem("cart", cart);
        localStorage.setItem("total", total);

        // Go to cart
        window.location.href = "cart.html";

    });

});


// =================================================
// CART PAGE → DISPLAY CART
// =================================================

const cartList = document.getElementById("cart-items");

if (cartList) {

    cartList.innerHTML = "";

    cartItems.forEach((item, index) => {

        const li = document.createElement("li");

        li.className = "cart-item";

        li.innerHTML = `
            <div class="cart-card">

                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                </div>

                <div class="cart-controls">

                    <button
                        class="minus"
                        data-index="${index}">
                        −
                    </button>

                    <span class="qty">
                        ${item.qty}
                    </span>

                    <button
                        class="plus"
                        data-index="${index}">
                        +
                    </button>

                    <button
                        class="delete remove-btn"
                        data-index="${index}">
                        🗑️
                    </button>

                </div>

            </div>
        `;

        cartList.appendChild(li);

    });

}


// =================================================
// PLUS BUTTON
// =================================================

document.querySelectorAll(".plus").forEach(btn => {

    btn.addEventListener("click", () => {

        const index = Number(btn.dataset.index);

        if (!cartItems[index]) {
            return;
        }

        cartItems[index].qty++;

        updateCartStorage();

        location.reload();

    });

});


// =================================================
// MINUS BUTTON
// =================================================

document.querySelectorAll(".minus").forEach(btn => {

    btn.addEventListener("click", () => {

        const index = Number(btn.dataset.index);

        if (!cartItems[index]) {
            return;
        }

        if (cartItems[index].qty > 1) {

            cartItems[index].qty--;

        }

        updateCartStorage();

        location.reload();

    });

});


// =================================================
// DELETE PRODUCT
// =================================================

document.querySelectorAll(".delete").forEach(btn => {

    btn.addEventListener("click", () => {

        const index = Number(btn.dataset.index);

        if (!cartItems[index]) {
            return;
        }

        cartItems.splice(index, 1);

        updateCartStorage();

        location.reload();

    });

});


// =================================================
// UPDATE CART STORAGE
// =================================================

function updateCartStorage() {

    cart = cartItems.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    total = cartItems.reduce(
        (sum, item) =>
            sum + (item.price * item.qty),
        0
    );

    localStorage.setItem(
        "cartItems",
        JSON.stringify(cartItems)
    );

    localStorage.setItem("cart", cart);

    localStorage.setItem("total", total);

}


// =================================================
// CLEAR CART
// =================================================

const clearCartBtn =
    document.getElementById("clearCartBtn") ||
    document.getElementById("clear-cart-btn");

if (clearCartBtn) {

    clearCartBtn.addEventListener("click", () => {

        localStorage.removeItem("cart");

        localStorage.removeItem("total");

        localStorage.removeItem("cartItems");

        alert("Cart cleared!");

        location.reload();

    });

}


// =================================================
// CHECKOUT → WHATSAPP
// =================================================

const checkoutBtn =
    document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        // Login check
        if (
            localStorage.getItem("loggedIn")
            !== "true"
        ) {

            if (loginModal) {

                loginModal.style.display = "flex";

            } else {

                alert(
                    "Please Login or Sign Up first."
                );

            }

            return;
        }


        // Customer details
        const name =
            document.getElementById("name")?.value.trim();

        const phone =
            document.getElementById("mobile")?.value.trim();

        const address =
            document.getElementById("address")?.value.trim();

        const city =
            document.getElementById("city")?.value.trim();

        const pincode =
            document.getElementById("pin")?.value.trim();


        // Check details
        if (
            !name ||
            !phone ||
            !address ||
            !city ||
            !pincode
        ) {

            alert(
                "⚠️ Please fill all details before placing your order."
            );

            return;
        }


        // Empty cart check
        if (cartItems.length === 0) {

            alert(
                "🛒 Your cart is empty!"
            );

            return;
        }


        // Product list
        let productList = "";

        cartItems.forEach(item => {

            productList +=
                `• ${item.name} x${item.qty} - ₹${item.price * item.qty}\n`;

        });


        // Total
        const totalItems =
            cartItems.reduce(
                (sum, item) =>
                    sum + item.qty,
                0
            );

        const totalAmount =
            cartItems.reduce(
                (sum, item) =>
                    sum + (item.price * item.qty),
                0
            );


        // WhatsApp message
        const message = `
🛍️ *ROYAL STORE ORDER*

👤 Name: ${name}
📱 Phone: ${phone}
🏠 Address: ${address}
🏙️ City: ${city}
📮 PIN Code: ${pincode}

🛒 *ORDER DETAILS*

${productList}
📦 Total Items: ${totalItems}
💰 Total Price: ₹${totalAmount}

Thank you for shopping with Royal Store! 👑
`;


        // WhatsApp
        window.open(
            "https://wa.me/918791139418?text=" +
            encodeURIComponent(message),
            "_blank"
        );

    });

}


// =================================================
// NOTIFICATION BELL
// =================================================

function updateNotification() {

    const badge =
        document.getElementById("notify-count");

    if (!badge) {
        return;
    }

    const items =
        JSON.parse(
            localStorage.getItem("cartItems")
        ) || [];

    const totalQty =
        items.reduce(
            (sum, item) =>
                sum + item.qty,
            0
        );

    if (totalQty > 0) {

        badge.style.display = "flex";

        badge.textContent = totalQty;

    } else {

        badge.style.display = "none";

    }

}

updateNotification();


// =================================================
// LOGIN SYSTEM
// =================================================

const loginBtn =
    document.querySelector(".login-card button");

if (loginBtn) {

    loginBtn.addEventListener("click", () => {

        const email =
            document
                .querySelector('input[type="email"]')
                ?.value.trim();

        const password =
            document
                .querySelector('input[type="password"]')
                ?.value.trim();


        if (!email || !password) {

            alert(
                "Please enter Email and Password"
            );

            return;
        }


        const savedEmail =
            localStorage.getItem("userEmail");

        const savedPassword =
            localStorage.getItem("userPassword");


        if (
            (
                email === "admin@royalstore.com" &&
                password === "123456"
            ) ||
            (
                email === savedEmail &&
                password === savedPassword
            )
        ) {

            alert("Login Successful!");

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            window.location.href =
                "index.html";

        } else {

            alert(
                "Invalid Email or Password!"
            );

        }

    });

}


// =================================================
// SIDE MENU
// =================================================

const menuBtn =
    document.getElementById("menu-btn");

const sideMenu =
    document.getElementById("side-menu");

const overlay =
    document.getElementById("overlay");

if (
    menuBtn &&
    sideMenu &&
    overlay
) {

    menuBtn.addEventListener(
        "click",
        () => {

            sideMenu.classList.toggle(
                "active"
            );

            overlay.classList.toggle(
                "active"
            );

        }
    );


    overlay.addEventListener(
        "click",
        () => {

            sideMenu.classList.remove(
                "active"
            );

            overlay.classList.remove(
                "active"
            );

        }
    );

}


// =================================================
// LOGIN MODAL BUTTONS
// =================================================

const loginBtnModal =
    document.getElementById(
        "loginBtnModal"
    );

const signupBtnModal =
    document.getElementById(
        "signupBtnModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );


if (loginBtnModal) {

    loginBtnModal.onclick = () => {

        window.location.href =
            "login.html";

    };

}


if (signupBtnModal) {

    signupBtnModal.onclick = () => {

        window.location.href =
            "signup.html";

    };

}


if (closeModal) {

    closeModal.onclick = () => {

        if (loginModal) {

            loginModal.style.display =
                "none";

        }

    };

      }
// =================================
// ROYAL STORE PREMIUM CART POPUP
// =================================

function showRoyalPopup(message) {

    const oldPopup = document.querySelector(".royal-popup");

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup = document.createElement("div");

    popup.className = "royal-popup";

    popup.innerHTML = `
        <div class="royal-popup-icon">✓</div>

        <div class="royal-popup-text">
            <div class="royal-popup-title">
                Product Added
            </div>

            <div class="royal-popup-message">
                ${message}
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    // Show popup
    requestAnimationFrame(() => {
        popup.classList.add("show");
    });

    // Hide after 3 seconds
    setTimeout(() => {

        popup.classList.remove("show");

        setTimeout(() => {
            popup.remove();
        }, 400);

    }, 3000);
}
