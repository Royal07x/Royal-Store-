// ===============================
// ROYAL STORE - APP.JS
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // ---------- CART DATA ----------
    let cartItems = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
    );

    let cart = Number(localStorage.getItem("cart")) || 0;
    let total = Number(localStorage.getItem("total")) || 0;

    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");

    // ---------- UPDATE CART ----------
    function updateCartStorage() {

        cart = cartItems.reduce(function (sum, item) {
            return sum + Number(item.qty || 0);
        }, 0);

        total = cartItems.reduce(function (sum, item) {
            return sum + (
                Number(item.price || 0) *
                Number(item.qty || 0)
            );
        }, 0);

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
            totalPrice.textContent = "₹" + total;
        }

        updateNotification();
    }

    updateCartStorage();


    // =================================================
    // PREMIUM POPUP
    // =================================================

    function showRoyalPopup(message) {

        const oldPopup =
            document.getElementById("royal-cart-popup");

        if (oldPopup) {
            oldPopup.remove();
        }

        const popup =
            document.createElement("div");

        popup.id = "royal-cart-popup";

        popup.innerHTML = `
            <div class="royal-popup-icon">✓</div>

            <div class="royal-popup-title">
                Product Added
            </div>

            <div class="royal-popup-message">
                ${message || "Product Cart me add ho gaya!"}
            </div>
        `;

        popup.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            width: calc(100% - 30px);
            max-width: 360px;
            padding: 18px 20px;
            background: #111111;
            color: #ffffff;
            border: 2px solid #d4af37;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,.5);
            z-index: 2147483647;
            font-family: Arial, sans-serif;
            text-align: center;
            box-sizing: border-box;
            opacity: 0;
            transition: all .35s ease;
        `;

        document.body.appendChild(popup);

        const icon =
            popup.querySelector(".royal-popup-icon");

        if (icon) {
            icon.style.cssText = `
                width: 44px;
                height: 44px;
                margin: 0 auto 8px;
                border-radius: 50%;
                background: #d4af37;
                color: #111111;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26px;
                font-weight: bold;
            `;
        }

        const title =
            popup.querySelector(".royal-popup-title");

        if (title) {
            title.style.cssText = `
                font-size: 18px;
                font-weight: 700;
                color: #d4af37;
                margin-bottom: 6px;
            `;
        }

        const text =
            popup.querySelector(".royal-popup-message");

        if (text) {
            text.style.cssText = `
                font-size: 14px;
                color: #ffffff;
            `;
        }

        requestAnimationFrame(function () {

            popup.style.opacity = "1";
            popup.style.transform =
                "translateX(-50%) translateY(0)";

        });

        setTimeout(function () {

            popup.style.opacity = "0";
            popup.style.transform =
                "translateX(-50%) translateY(-20px)";

            setTimeout(function () {

                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }

            }, 400);

        }, 3000);
    }


    // =================================================
    // PRODUCTS
    // =================================================

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


    // =================================================
    // ADD TO CART BUTTONS
    // =================================================

    const buttons =
        document.querySelectorAll(
            ".product .add-cart"
        );

    buttons.forEach(function (button, index) {

        button.addEventListener("click", function () {

            if (!products[index]) {
                return;
            }

            const product = products[index];

            const existingIndex =
                cartItems.findIndex(function (item) {
                    return item.name === product.name;
                });

            if (existingIndex !== -1) {

                cartItems[existingIndex].qty++;

            } else {

                cartItems.push({
                    name: product.name,
                    price: product.price,
                    qty: 1
                });

            }

            updateCartStorage();

            showRoyalPopup(
                product.name +
                " cart me add ho gaya!"
            );

        });

    });


    // =================================================
    // WHATSAPP ORDER BUTTON
    // =================================================

    document
        .querySelectorAll(".whatsapp-order")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const product =
                        button.dataset.product;

                    const price =
                        Number(button.dataset.price);

                    if (!product || !price) {
                        return;
                    }

                    const existingIndex =
                        cartItems.findIndex(
                            function (item) {
                                return item.name === product;
                            }
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

                    updateCartStorage();

                    window.location.href =
                        "cart.html";
                }
            );

        });


    // =================================================
    // CART PAGE
    // =================================================

    const cartList =
        document.getElementById("cart-items");

    if (cartList) {

        cartList.innerHTML = "";

        if (cartItems.length === 0) {

            cartList.innerHTML = `
                <li style="
                    list-style:none;
                    text-align:center;
                    padding:30px;
                ">
                    🛒 Cart is empty
                </li>
            `;

        } else {

            cartItems.forEach(
                function (item, index) {

                    const li =
                        document.createElement("li");

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

                }
            );

        }
    }


    // =================================================
    // PLUS
    // =================================================

    document
        .querySelectorAll(".plus")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(button.dataset.index);

                    if (!cartItems[index]) {
                        return;
                    }

                    cartItems[index].qty++;

                    updateCartStorage();

                    location.reload();
                }
            );

        });


    // =================================================
    // MINUS
    // =================================================

    document
        .querySelectorAll(".minus")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(button.dataset.index);

                    if (!cartItems[index]) {
                        return;
                    }

                    if (cartItems[index].qty > 1) {

                        cartItems[index].qty--;

                    } else {

                        cartItems.splice(index, 1);

                    }

                    updateCartStorage();

                    location.reload();
                }
            );

        });


    // =================================================
    // DELETE
    // =================================================

    document
        .querySelectorAll(".delete")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(button.dataset.index);

                    if (!cartItems[index]) {
                        return;
                    }

                    cartItems.splice(index, 1);

                    updateCartStorage();

                    location.reload();
                }
            );

        });


    // =================================================
    // CLEAR CART
    // =================================================

    const clearCartBtn =
        document.getElementById("clearCartBtn") ||
        document.getElementById("clear-cart-btn");

    if (clearCartBtn) {

        clearCartBtn.addEventListener(
            "click",
            function () {

                localStorage.removeItem("cart");
                localStorage.removeItem("total");
                localStorage.removeItem("cartItems");

                alert("Cart cleared!");

                location.reload();
            }
        );

    }


    // =================================================
    // CHECKOUT
    // =================================================

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    const loginModal =
        document.getElementById("loginModal");

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            function () {

                if (
                    localStorage.getItem("loggedIn")
                    !== "true"
                ) {

                    if (loginModal) {

                        loginModal.style.display =
                            "flex";

                    } else {

                        alert(
                            "Please Login or Sign Up first."
                        );

                    }

                    return;
                }

                if (cartItems.length === 0) {

                    alert(
                        "🛒 Your cart is empty!"
                    );

                    return;
                }

                const name =
                    document.getElementById("name")
                    ?.value.trim();

                const phone =
                    document.getElementById("mobile")
                    ?.value.trim();

                const address =
                    document.getElementById("address")
                    ?.value.trim();

                const city =
                    document.getElementById("city")
                    ?.value.trim();

                const pincode =
                    document.getElementById("pin")
                    ?.value.trim();

                if (
                    !name ||
                    !phone ||
                    !address ||
                    !city ||
                    !pincode
                ) {

                    alert(
                        "Please fill all details before placing your order."
                    );

                    return;
                }

                let productList = "";

                cartItems.forEach(function (item) {

                    productList +=
                        "• " +
                        item.name +
                        " x" +
                        item.qty +
                        " - ₹" +
                        (item.price * item.qty) +
                        "\n";

                });

                const totalItems =
                    cartItems.reduce(
                        function (sum, item) {
                            return sum + item.qty;
                        },
                        0
                    );

                const totalAmount =
                    cartItems.reduce(
                        function (sum, item) {
                            return sum +
                                (item.price * item.qty);
                        },
                        0
                    );

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

                window.open(
                    "https://wa.me/918791139418?text=" +
                    encodeURIComponent(message),
                    "_blank"
                );

            }
        );

    }


    // =================================================
    // NOTIFICATION
    // =================================================

    function updateNotification() {

        const badge =
            document.getElementById("notify-count");

        if (!badge) {
            return;
        }

        const items =
            JSON.parse(
                localStorage.getItem("cartItems") ||
                "[]"
            );

        const totalQty =
            items.reduce(
                function (sum, item) {
                    return sum + Number(item.qty || 0);
                },
                0
            );

        if (totalQty > 0) {

            badge.style.display = "flex";
            badge.textContent = totalQty;

        } else {

            badge.style.display = "none";

        }

    }


    // =================================================
    // LOGIN SYSTEM
    // =================================================

    const loginButton =
        document.querySelector(
            ".login-card button"
        );

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            function () {

                const email =
                    document.querySelector(
                        'input[type="email"]'
                    )?.value.trim();

                const password =
                    document.querySelector(
                        'input[type="password"]'
                    )?.value.trim();

                if (!email || !password) {

                    alert(
                        "Please enter Email and Password"
                    );

                    return;
                }

                const savedEmail =
                    localStorage.getItem(
                        "userEmail"
                    );

                const savedPassword =
                    localStorage.getItem(
                        "userPassword"
                    );

                if (
                    (
                        email ===
                        "admin@royalstore.com" &&
                        password === "123456"
                    ) ||
                    (
                        email === savedEmail &&
                        password === savedPassword
                    )
                ) {

                    localStorage.setItem(
                        "loggedIn",
                        "true"
                    );

                    alert(
                        "Login Successful!"
                    );

                    window.location.href =
                        "index.html";

                } else {

                    alert(
                        "Invalid Email or Password!"
                    );

                }

            }
        );

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
            function () {

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
            function () {

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
    // LOGIN MODAL
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
        document.getEle
