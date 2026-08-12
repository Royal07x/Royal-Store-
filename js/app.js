let cart = Number(localStorage.getItem("cart")) || 0;
let total = Number(localStorage.getItem("total")) || 0;
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

if (cartCount) cartCount.textContent = cart;
if (totalPrice) totalPrice.textContent = total;

const buttons = document.querySelectorAll(".product button");
const products = [
  { name: "Premium Shirt", price: 799 },
  { name: "Stylish Pant", price: 999 },
  { name: "Beauty Kit", price: 499 }
];

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    cart++;
    cartItems.push(products[index]);
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

    let productList = "";

    cartItems.forEach(item => {
      productList += "• " + item.name + " - ₹" + item.price + "%0A";
    });

    const message =
      "🛍️ Hello Royal Store!%0A%0A" +
      "I want to order:%0A%0A" +
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

  cartItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    cartList.appendChild(li);
  });
}
