// order-details.js

// Load order details from localStorage
const order = JSON.parse(localStorage.getItem('order'));

if (!order) {
  alert("No order found!");
  window.location.href = "index.html";  // Redirect back to the main page if no order exists
}

document.addEventListener('DOMContentLoaded', function() {
  const orderItemsList = document.getElementById('order-items');
  const orderTotal = document.getElementById('order-total');

  // Display the order items
  order.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity}`;
    orderItemsList.appendChild(li);
  });

  // Display the total
  orderTotal.textContent = `Total: ₹${order.total.toFixed(2)}`;

  // Handle payment form submission
  const paymentForm = document.getElementById('payment-form');
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const paymentMethod = document.getElementById('payment-method').value;
    alert(`Payment Method: ${paymentMethod}\nProceeding with the payment...`);
  });
});

// Show the rating modal
function showRatingModal() {
  const ratingModal = document.getElementById('rating-modal');
  ratingModal.style.display = 'block';
}

// Close the rating modal
function closeRatingModal() {
  const ratingModal = document.getElementById('rating-modal');
  ratingModal.style.display = 'none';
}

// Handle the star rating selection
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', function () {
    const ratingValue = this.getAttribute('data-value');
    // Mark all stars up to the clicked one as selected
    document.querySelectorAll('.star').forEach(star => {
      star.classList.remove('selected');
      if (star.getAttribute('data-value') <= ratingValue) {
        star.classList.add('selected');
      }
    });
  });
});

// Handle the payment process
function proceedPayment() {
  alert('Proceeding with payment...');
  setTimeout(function () {
    showRatingModal(); // Show the rating modal after the alert
  }, 1000); // Show rating modal after a 1-second delay
}

// Handle rating submission
function submitRating() {
  const selectedStars = document.querySelectorAll('.star.selected').length;
  if (selectedStars > 0) {
    alert(`Thank you for rating us ${selectedStars} star(s)!`);
    closeRatingModal(); // Close the modal after submission
  } else {
    alert('Please select a rating.');
  }
}
