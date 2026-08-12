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

const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value;
const phone = document.getElementById("customer-phone").value;
const address = document.getElementById("customer-address").value;
const city = document.getElementById("customer-city").value;
const pincode = document.getElementById("customer-pincode").value;

    let productList = "";

    cartItems.forEach(item => {
    productList += "• " + item.name + " x" + item.qty + " - ₹" + (item.price * item.qty) + "%0A";
});

    const message =
"🛍️ Hello Royal Store!%0A%0A" +
"👤 Name: " + name + "%0A" +
"📱 Phone: " + phone + "%0A" +
"🏠 Address: " + address + "%0A" +
"🏙️ City: " + city + "%0A" +
"📮 PIN Code: " + pincode + "%0A%0A" +
"🛒 I want to order:%0A%0A" +
productList +
"%0A📦 Total Items: " + cart +
"%0A💰 Total Price: ₹" + total;

    window.open(
      "https://wa.me/918791139418?text=" + message,
      "_blank"
    );

  });
}
const cartList = document.getElementById("cart-items");
console.log(cartItems);
if (cartList) {
  cartList.innerHTML = "";

  cartItems.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
        ${item.name} - ₹${item.price}
        <button class="minus" data-index="${index}">➖</button>
        <span>1</span>
        <button class="plus" data-index="${index}">➕</button>
    `;

    cartList.appendChild(li);
});
}
document.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", () => {
        alert("Quantity feature next step me complete karenge 🚀");
    });
});

document.querySelectorAll(".minus").forEach(btn => {
    btn.addEventListener("click", () => {
        alert("Quantity feature next step me complete karenge 🚀");
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
