let cart = 0;
let total = 0;

const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

const buttons = document.querySelectorAll(".product button");

const prices = [799, 999, 499];

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    cart++;
    total += prices[index];

    cartCount.textContent = cart;
    totalPrice.textContent = total;

    alert("Product Cart me add ho gaya!");
  });
});
