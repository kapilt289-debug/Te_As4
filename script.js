// Smooth scroll from hero button to booking section [web:10][web:13]
document.getElementById("hero-book-btn").addEventListener("click", () => {
  document.getElementById("services").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// Cart state
let cart = [];
const cartBody = document.getElementById("cart-body");
const totalAmountEl = document.getElementById("total-amount");
const cartDetailsField = document.getElementById("cart-details");

// Add / remove service handlers
document.querySelectorAll(".add-service").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    const name = li.dataset.name;
    const price = Number(li.dataset.price);
    cart.push({ name, price });
    renderCart();
  });
});

document.querySelectorAll(".remove-service").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    const name = li.dataset.name;
    // remove first occurrence
    const index = cart.findIndex((item) => item.name === name);
    if (index !== -1) {
      cart.splice(index, 1);
      renderCart();
    }
  });
});

// Render cart table and total
function renderCart() {
  cartBody.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price.toFixed(2)}</td>
    `;
    cartBody.appendChild(tr);
    total += item.price;
  });

  totalAmountEl.textContent = total.toFixed(2);

  // prepare details for EmailJS
  const detailsText =
    cart.length === 0
      ? "No items in cart."
      : cart
          .map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`)
          .join("\n") + `\nTotal: ₹${total}`;
  cartDetailsField.value = detailsText;
}

// EmailJS booking form submit [web:4][web:11]
const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs
    .sendForm(
      "YOUR_SERVICE_ID", // replace with EmailJS service ID
      "YOUR_TEMPLATE_ID", // replace with EmailJS template ID
      "#booking-form"
    )
    .then(
      function () {
        bookingMessage.classList.remove("hidden");
        bookingForm.reset();
        cart = [];
        renderCart();
      },
      function (error) {
        console.error("FAILED...", error);
        alert("Something went wrong. Please try again.");
      }
    );
});
