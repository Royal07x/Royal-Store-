let cart = Number(localStorage.getItem("cart")) || 0;
let total = Number(localStorage.getItem("total")) || 0;

const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

if (cartCount) cartCount.textContent = cart;
if (totalPrice) totalPrice.textContent = total;

const buttons = document.querySelectorAll(".product button");
const prices = [799, 999, 499];

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    cart++;
    total += prices[index];

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
    const message =
      "Hello Royal Store!%0A%0AI want to order:%0A" +
      "Total Items: " + cart +
      "%0ATotal Price: ₹" + total;

    window.open(
      "https://wa.me/918791139418?text=" + message,
      "_blank"
    );
  });
}
