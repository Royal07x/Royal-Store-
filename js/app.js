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

            const card = button.closest(".product");

                     const product = {
    name: card.querySelector("h3").innerText,
    price: Number(
        card.querySelector(".price")
            .innerText.replace("₹", "")
    ),
    qty: 1
};

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

                showCartClearedPopup();

                setTimeout(function () {
                    location.reload();
                }, 1200);
            }
        );

    }

// ==============================
// GET CURRENT LOCATION
// ==============================

const getLocationBtn = document.getElementById("get-location");

if (getLocationBtn) {

  getLocationBtn.addEventListener("click", function () {

    if (!navigator.geolocation) {
      alert("Location is not supported on this device.");
      return;
    }

    getLocationBtn.innerText = "Getting Location...";

    navigator.geolocation.getCurrentPosition(

      function (position) {

        document.getElementById("latitude").value =
          position.coords.latitude;

        document.getElementById("longitude").value =
          position.coords.longitude;

        getLocationBtn.innerText = "✅ Location Added";

      },

      function () {

        alert("Please allow location permission.");

        getLocationBtn.innerText = "📍 Use Current Location";

      }

    );

  });

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
                
                const latitude =
                    document.getElementById("latitude").value;

               const longitude =
                   document.getElementById("longitude").value;
                
               const locationError = document.getElementById("location-error");
                     locationError.style.display = "none";

               document.getElementById("get-location").classList.remove("input-error");

              if (!latitude || !longitude) {
                     locationError.innerText = "❌ Please add your live location";
                     locationError.style.display = "block";

               document.getElementById("get-location").classList.add("input-error");

    return;
}
                
               const locationLink =
                   latitude && longitude
                   ?
                   `https://maps.google.com/?q=${latitude},${longitude}`
                   : "";

                let valid = true;

if (!name) {
  document.getElementById("name").classList.add("input-error");
  valid = false;
}

if (!phone) {
  document.getElementById("mobile").classList.add("input-error");
  valid = false;
}

if (!address) {
  document.getElementById("address").classList.add("input-error");
  valid = false;
}

if (!city) {
  document.getElementById("city").classList.add("input-error");
  valid = false;
}

if (!pincode) {
  document.getElementById("pin").classList.add("input-error");
  valid = false;
}

if (!valid) {
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

                if (!locationLink) {
    const locationBtn = document.getElementById("get-location");

    locationBtn.innerHTML = "❌ Please Add Your Location";
    locationBtn.style.background = "#ff3b30";
    locationBtn.style.color = "#fff";

    setTimeout(() => {
        locationBtn.innerHTML = "📍 Use My Live Location";
        locationBtn.style.background = "";
        locationBtn.style.color = "";
    }, 3000);

    return;
                }
                
                const message = `
🛍️ *ROYAL STORE ORDER*

👤 Name: ${name}
📱 Phone: ${phone}
🏠 Address: ${address}
🏙️ City: ${city}
📮 PIN Code: ${pincode}
📍 Current Location:
${locationLink}

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
        document.getElementById("closeModal");


    // LOGIN BUTTON
    if (loginBtnModal) {

        loginBtnModal.onclick = function () {

            window.location.href = "login.html";

        };

    }


    // SIGN UP BUTTON
    if (signupBtnModal) {

        signupBtnModal.onclick = function () {

            window.location.href = "signup.html";

        };

    }


    // CLOSE POPUP
    if (closeModal) {

        closeModal.onclick = function () {

            if (loginModal) {

                loginModal.style.display = "none";

            }

        };

    }

});
// =====================================
// IPHONE STYLE - CART CLEARED POPUP
// =====================================

function showCartClearedPopup() {

    const oldPopup =
    document.getElementById("cart-cleared-popup");

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup =
        document.createElement("div");

    popup.id = "cart-cleared-popup";

    popup.innerHTML = `
        <div class="cart-cleared-icon">
            ✓
        </div>

        <div class="cart-cleared-content">
            <div class="cart-cleared-title">
                Cart Cleared
            </div>

            <div class="cart-cleared-text">
                Your shopping cart is empty
            </div>
        </div>
    `;

    popup.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 28px;
        transform: translateX(-50%) translateY(25px) scale(.96);

        width: calc(100% - 32px);
        max-width: 360px;

        display: flex;
        align-items: center;
        gap: 12px;

        padding: 12px 15px;

        background: rgba(28, 28, 30, .94);
        color: #ffffff;

        border: 1px solid rgba(255,255,255,.12);
        border-radius: 18px;

        box-shadow:
            0 12px 35px rgba(0,0,0,.28),
            0 2px 8px rgba(0,0,0,.15);

        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);

        z-index: 2147483647;

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "SF Pro Display",
            "Segoe UI",
            Arial,
            sans-serif;

        opacity: 0;

        transition:
            opacity .35s ease,
            transform .35s cubic-bezier(.22,1,.36,1);

        box-sizing: border-box;
    `;

    const icon =
        popup.querySelector(".cart-cleared-icon");

    icon.style.cssText = `
        width: 34px;
        height: 34px;

        flex: 0 0 34px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #34C759;
        color: #ffffff;

        font-size: 18px;
        font-weight: 700;

        box-shadow:
            0 3px 10px rgba(52,199,89,.35);

        animation:
            cartCheck .45s ease;
    `;

    const content =
        popup.querySelector(".cart-cleared-content");

    content.style.cssText = `
        min-width: 0;
        text-align: left;
    `;

    const title =
        popup.querySelector(".cart-cleared-title");

    title.style.cssText = `
        font-size: 14px;
        line-height: 18px;

        font-weight: 600;

        color: #ffffff;

        margin-bottom: 2px;
    `;

    const text =
        popup.querySelector(".cart-cleared-text");

    text.style.cssText = `
        font-size: 11px;
        line-height: 15px;

        font-weight: 400;

        color: #A1A1A6;
    `;

    document.body.appendChild(popup);

    // iPhone style animation
    requestAnimationFrame(function () {

        popup.style.opacity = "1";

        popup.style.transform =
            "translateX(-50%) translateY(0) scale(1)";

    });

    // Hide
    setTimeout(function () {

        popup.style.opacity = "0";

        popup.style.transform =
            "translateX(-50%) translateY(20px) scale(.96)";

        setTimeout(function () {

            if (popup.parentNode) {
                popup.remove();
            }

        }, 350);

    }, 850);
}

const cartPopupStyle = document.createElement("style");

cartPopupStyle.textContent = `
@keyframes cartCheck {
    0% {
        transform: scale(.5);
        opacity: 0;
    }

    70% {
        transform: scale(1.12);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
`;

document.head.appendChild(cartPopupStyle);

// ===============================
// SHIRTS PAGE ADD TO CART
// ===============================

document.querySelectorAll(".add-cart").forEach(function(button){

    button.addEventListener("click", function(){

        const card = button.closest(".product");

        const name = card.querySelector("h3").innerText;

        const price = Number(
            card.querySelector(".price")
            .innerText.replace("₹","")
        );

        let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

        const existing = cartItems.find(item => item.name === name);

        if(existing){
            existing.qty++;
        }else{
            cartItems.push({
                name:name,
                price:price,
                qty:1
            });
        }

        localStorage.setItem("cartItems",JSON.stringify(cartItems));
        localStorage.setItem("cart", cartItems.length);

let total = 0;

cartItems.forEach(function(item){
    total += item.price * item.qty;
});

localStorage.setItem("total", total);
        alert(name + " Added to Cart ✅");

    });

});
