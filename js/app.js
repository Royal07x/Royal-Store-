let cart = 0;

const cartCount = document.getElementById("cart-count");
const buttons = document.querySelectorAll(".product button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    cart++;
    cartCount.textContent = cart;
    alert("Product Cart me add ho gaya!");
  });
});
