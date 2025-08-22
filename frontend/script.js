// Initialize cart from local storage or as an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = calculateTotal();

// Fetch pastries from backend and populate the pastry list dynamically
fetch('http://localhost:5000/api/pastries')
  .then(response => response.json())
  .then(data => {
    console.log('Pastries:', data);
    populatePastryList(data);
  })
  .catch(error => console.error('Error fetching pastries:', error));

// Function to populate the pastry list dynamically
function populatePastryList(pastries) {
  const pastryList = document.querySelector('.pastry-list');

  // Clear existing pastry items (in case there's static content)
  pastryList.innerHTML = '';

  // Loop through the pastries from the backend and create pastry items dynamically
  pastries.forEach(pastry => {
    const pastryItem = document.createElement('div');
    pastryItem.classList.add('pastry-item');
    
    pastryItem.innerHTML = `
      <img src="${pastry.image}" alt="${pastry.name}">
      <h3>${pastry.name}</h3>
      <p>₹${pastry.price.toFixed(2)}</p>
      <button onclick="addToCart('${pastry.name}', ${pastry.price})">Add to Cart</button>
    `;
    
    pastryList.appendChild(pastryItem);
  });
}

function addToCart(itemName, itemPrice) {
  const existingItem = cart.find(item => item.name === itemName);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: itemName, price: itemPrice, quantity: 1 });
  }

  total += itemPrice;
  updateCart();
}

function removeFromCart(itemName) {
  const itemIndex = cart.findIndex(item => item.name === itemName);

  if (itemIndex > -1) {
    const item = cart[itemIndex];
    total -= item.price * item.quantity;
    cart.splice(itemIndex, 1);
  }

  updateCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');

  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity}
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    `;
    cartItems.appendChild(li);
  });

  totalPrice.textContent = `Total: ₹${total.toFixed(2)}`;
  localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
  } else {
    // Store order details in localStorage
    const order = {
      items: cart,
      total: total
    };
    localStorage.setItem('order', JSON.stringify(order));

    // Clear cart data and total after checkout
    cart = [];  // Empty the cart
    total = 0;  // Reset the total
    localStorage.setItem('cart', JSON.stringify(cart)); // Clear cart in localStorage

    // Redirect to the order details page
    window.location.href = 'order-details.html';
  }
}



// Load initial cart state on page load
document.addEventListener('DOMContentLoaded', updateCart);

function clearCart() {
  cart = [];  // Empty the cart array
  total = 0;  // Reset total to zero
  updateCart();
}

// Function to show the healthier option pop-up
function showHealthierOption(itemName, extraPrice) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <p>Would you like the healthier version for an extra ₹${extraPrice}?</p>
    <div class="modal-buttons">
      <button class="ok-btn" onclick="confirmHealthierOption('${itemName}', ${extraPrice}, this)">OK</button>
      <button class="cancel-btn" onclick="closeModal(this)">Cancel</button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Function to confirm adding the healthier option
function confirmHealthierOption(itemName, extraPrice, btn) {
  const upgradedPrice = extraPrice + 399.20; // Add extra cost to base price
  addToCart(`${itemName} (Healthier)`, upgradedPrice);
  closeModal(btn);
}

// Function to close the modal
function closeModal(btn) {
  btn.closest('.modal').remove();
}

// Function to show About Us
function showAboutUs() {
  alert("Welcome to Sweet Bites! We make the best pastries with love. 🍰");
}

// Function to show login/signup modal
function showLoginModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <h2>Login / Signup</h2>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <div class="modal-buttons">
        <button class="ok-btn">Login</button>
        <button class="cancel-btn" onclick="closeModal(this)">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
// Function to redirect to About Us page
function showAboutUs() {
  window.location.href = "about.html";
}

// Show the login modal when the user clicks on 'Account'
function showLoginModal() {
  const loginModal = document.getElementById('login-modal');
  loginModal.style.display = 'block';
}

// Close the login modal
function closeLoginModal() {
  const loginModal = document.getElementById('login-modal');
  loginModal.style.display = 'none';
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const gmail = document.getElementById('gmail').value;
  const password = document.getElementById('password').value;

  // Validate inputs (just a simple check here)
  if (gmail && password) {
    alert('Login successful!');
    closeLoginModal(); // Close the modal on success
    // You can add more logic here to handle the login process
  } else {
    alert('Please enter a valid Gmail ID and password.');
  }
});

// // Show the register modal
// function showRegister() {
//   document.getElementById("register-modal").style.display = "block";
// }

// // Close the register modal
// function closeRegisterModal() {
//   document.getElementById("register-modal").style.display = "none";
// }

// // Validate registration form
// function validateRegistration() {
//   var password = document.getElementById("password").value.trim();
//   var confirmPassword = document.getElementById("confirm-password").value.trim();

//   if (password !== confirmPassword) {
//     alert("Passwords do not match. Please try again.");
//     return false;
//   }

//   // Optionally, you can add more validation logic here
//   alert("Registration successful!");
//   closeRegisterModal(); // Close the modal after successful registration
//   return false; // Prevent form submission (you can replace this with actual form submission logic)
// }


// Show the register modal
function showRegister() {
  document.getElementById("register-modal").style.display = "block";
}

// Close the register modal
function closeRegisterModal() {
  document.getElementById("register-modal").style.display = "none";
}

// Validate registration form
function validateRegistration() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;

  // if (password !== confirmPassword) {
  //   alert("Passwords do not match. Please try again.");
  //   return false;
  // }

  // Check if mobile number is 10 digits long
  var mobileNumber = document.getElementById("mobile-number").value;
  if (!/^[0-9]{10}$/.test(mobileNumber)) {
    alert("Please enter a valid 10-digit mobile number.");
    return false;
  }

  // Optionally, you can add more validation logic here
  alert("Registration successful!");
  closeRegisterModal(); // Close the modal after successful registration
  return false; // Prevent form submission (you can replace this with actual form submission logic)
}

fetch('http://localhost:5000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "John", email: "john@example.com", password: "12345" })
}).then(res => res.json()).then(data => console.log(data));


