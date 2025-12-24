// ---------- CART STATE ----------
const cartBody   = document.getElementById("cart-body");
const totalSpan  = document.getElementById("total-amount");
const cartDetailsTextarea = document.getElementById("cart-details");

let cart = []; // { name, price }

// ---------- RENDER FUNCTIONS ----------
function renderCart() {
  cartBody.innerHTML = "";

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
    `;
    cartBody.appendChild(tr);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalSpan.textContent = total;

  // also prepare text to send via EmailJS
  const details = cart
    .map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`)
    .join("\n");
  cartDetailsTextarea.value = `Items:\n${details}\n\nTotal: ₹${total}`;
}

// ---------- ADD / REMOVE LOGIC ----------
document.querySelectorAll(".service-list li").forEach(li => {
  const name  = li.dataset.name;
  const price = Number(li.dataset.price);

  const addBtn    = li.querySelector(".add-btn");
  const removeBtn = li.querySelector(".remove-btn");

  addBtn.addEventListener("click", () => {
    // if not already in cart, add
    const exists = cart.some(item => item.name === name);
    if (!exists) {
      cart.push({ name, price });
      renderCart();

      // toggle buttons
      addBtn.style.display = "none";
      removeBtn.style.display = "inline-block";
    }
  });

  removeBtn.addEventListener("click", () => {
    // remove from cart
    cart = cart.filter(item => item.name !== name);
    renderCart();

    // toggle buttons
    removeBtn.style.display = "none";
    addBtn.style.display = "inline-block";
  });
});

// ---------- OPTIONAL: hero button scroll to services ----------
document.getElementById("hero-book-btn").addEventListener("click", () => {
  document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});

// ---------- OPTIONAL: EmailJS form submit ----------
const bookingForm = document.getElementById("booking-form");
const bookingMsg  = document.getElementById("booking-message");

bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // make sure there is at least one item
  if (cart.length === 0) {
    alert("Please add at least one service to the cart.");
    return;
  }

  // replace with your own service/template/public IDs from EmailJS
  emailjs
    .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
    .then(() => {
      bookingMsg.classList.remove("hidden");
      bookingForm.reset();
      cart = [];
      renderCart();
    })
    .catch(err => {
      console.error("EmailJS error:", err);
      alert("Sorry, something went wrong. Please try again.");
    });
});
