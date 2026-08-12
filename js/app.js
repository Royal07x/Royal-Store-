let cart = Number(localStorage.getItem("cart")) || 0;
let total = Number(localStorage.getItem("total")) || 0;
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

if (cartCount) cartCount.textContent = cart;
if (totalPrice) totalPrice.textContent = total;

const buttons = document.querySelectorAll(".product .add-cart");
const products = [
  { name: "Premium Shirt", price: 799, qty: 1 },
  { name: "Stylish Pant", price: 999, qty: 1 },
  { name: "Beauty Kit", price: 499, qty: 1 }
];

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    
    if (localStorage.getItem("loggedIn") !== "true") {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
    }
    
    cart++;
    
    cartItems.push({ ...products[index] });
localStorage.setItem("cartItems", JSON.stringify(cartItems));
    total += products[index].price;

    localStorage.setItem("cart", cart);
    localStorage.setItem("total", total);

    if (cartCount) cartCount.textContent = cart;
    if (totalPrice) totalPrice.textContent = total;

    alert("Product Cart me add ho gaya!");
  });
});

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  
  checkoutBtn.addEventListener("click", () => {
    if (localStorage.getItem("loggedIn") !== "true") {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
    }
    const name = document.getElementById("name").value;
const phone = document.getElementById("mobile").value;
const address = document.getElementById("address").value;
const city = document.getElementById("city").value;
const pincode = document.getElementById("pin").value;
    
if (!name || !phone || !address || !city || !pincode) {
    alert("⚠️ Please fill all details before placing your order.");
    return;
}
    let productList = "";

cartItems.forEach(item => {
    productList += `• ${item.name} x${item.qty} - ₹${item.price * item.qty}\n`;
});

const message = `
🛍️ Hello Royal Store!

👤 Name: ${name}
📱 Phone: ${phone}
🏠 Address: ${address}
🏙️ City: ${city}
📮 PIN Code: ${pincode}

🛒 I want to order:

${productList}

📦 Total Items: ${cartItems.reduce((sum, item) => sum + item.qty, 0)}
💰 Total Price: ₹${cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)}
`;

window.open(
    "https://wa.me/918791139418?text=" + encodeURIComponent(message),
    "_blank"
);

  });
}

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
    <button class="minus" data-index="${index}">−</button>

    <span class="qty">${item.qty}</span>

    <button class="plus" data-index="${index}">+</button>

    <button class="delete remove-btn" data-index="${index}">🗑️</button>
  </div>

</div>
`;

cartList.appendChild(li);
});
}
document.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", () => {

        const index = btn.dataset.index;

        cartItems[index].qty++;

cart = cartItems.reduce((sum, item) => sum + item.qty, 0);
total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

localStorage.setItem("cartItems", JSON.stringify(cartItems));
localStorage.setItem("cart", cart);
localStorage.setItem("total", total);

location.reload();

    });
});

document.querySelectorAll(".minus").forEach(btn => {
    btn.addEventListener("click", () => {

        const index = btn.dataset.index;

        if (cartItems[index].qty > 1) {
    cartItems[index].qty--;
}

cart = cartItems.reduce((sum, item) => sum + item.qty, 0);
total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

localStorage.setItem("cartItems", JSON.stringify(cartItems));
localStorage.setItem("cart", cart);
localStorage.setItem("total", total);

location.reload();

    });
});
document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", () => {

        const index = btn.dataset.index;

        cartItems.splice(index, 1);

        cart = cartItems.reduce((sum, item) => sum + item.qty, 0);
        total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("cart", cart);
        localStorage.setItem("total", total);

        location.reload();
    });
});
const clearCartBtn = document.getElementById("clear-cart-btn");

if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        localStorage.removeItem("total");
        localStorage.removeItem("cartItems");

        alert("Cart cleared!");
        location.reload();
    });
}

// Login System
const loginBtn = document.querySelector(".login-card button");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (email === "" || password === "") {
      alert("Please enter Email and Password");
      return;
    }

    if (email === "admin@royalstore.com" && password === "123456") {
      alert("Login Successful");
      localStorage.setItem("loggedIn", "true");
      window.location.href = "index.html";
    } else {
      alert("Invalid Email or Password");
    }
  });
}
document.querySelectorAll(".whatsapp-order").forEach(btn => {
    btn.addEventListener("click", () => {

        if (localStorage.getItem("loggedIn") !== "true") {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const product = btn.dataset.product;
        const price = btn.dataset.price;

        const message =
`Hello Royal Store!

I want to order:

🛍 Product: ${product}
💰 Price: ₹${price}`;

        window.open(
            "https://wa.me/918791139418?text=" + encodeURIComponent(message),
            "_blank"
        );
    });
});
