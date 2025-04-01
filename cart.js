document.addEventListener("DOMContentLoaded", function () {
    loadCart();
});

function loadCart() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let totalAmount = 0;

    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItems.forEach((item, index) => {
            let price = parseFloat(item.price.toString().replace(/[^\d.]/g, "")) || 0;
            let itemTotal = price * item.quantity;
            totalAmount += itemTotal;

            let cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Price: Rs. ${price.toFixed(2)}</p>
                    <p>Quantity: 
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </p>
                    <p>Subtotal: Rs. ${itemTotal.toFixed(2)}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    document.getElementById("total-amount").innerText = `Total Amount: Rs. ${totalAmount.toFixed(2)}`;
}

function updateQuantity(index, change) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cartItems[index]) return;

    cartItems[index].quantity += change;

    if (cartItems[index].quantity < 1) {
        removeItem(index);
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    loadCart();
}

function removeItem(index) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cartItems[index]) return;

    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    loadCart();
}

function proceedToCheckout() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.toString().replace(/[^\d.]/g, "")) * item.quantity), 0);

    localStorage.setItem("totalAmount", totalAmount.toFixed(2));
    localStorage.setItem("checkoutData", JSON.stringify(cartItems));

    alert(`Total Amount: Rs. ${totalAmount.toFixed(2)}\nProceeding to checkout...`);
    
    window.location.href = "checkout.html";
}
