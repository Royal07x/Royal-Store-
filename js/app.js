const buttons = document.querySelectorAll(".product button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    alert("Product Cart me add ho gaya! 🛒");
  });
});
