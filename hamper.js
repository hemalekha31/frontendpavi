document.addEventListener("DOMContentLoaded", function () {
    // Initialize Swiper
    var swiper = new Swiper(".swiper-container", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "fraction",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });


    // Load wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");


    // Restore Wishlist Buttons on Page Load
    function restoreWishlistButtons() {
        document.querySelectorAll(".wishlist-btn").forEach(button => {
            let productCard = button.closest(".product-card1");
            let productName = productCard.querySelector(".product-name").innerText;
            let isWishlisted = wishlist.some(item => item.name === productName);

            if (isWishlisted) {
                button.querySelector("i").classList.add("wishlist-active"); // Fix: Make sure "wishlist-active" class is added
            } else {
                button.querySelector("i").classList.remove("wishlist-active");
            }
        });
    }

    // Update Wishlist Popup
    function updateWishlistPopup() {
        let wishlistContainer = document.querySelector(".wishlist-items");
        wishlistContainer.innerHTML = "";

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = "<p>Your wishlist is empty!</p>";
        } else {
            wishlist.forEach(item => {
                let wishlistItem = document.createElement("div");
                wishlistItem.classList.add("wishlist-item");
                wishlistItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Price: ${item.price}</p>
                    </div>
                    <i class="wishlist-icon-remove">&#10084;</i>
                `;
                wishlistContainer.appendChild(wishlistItem);
            });

            // Remove Item from Wishlist (Click on ❤️ icon)
            document.querySelectorAll(".wishlist-icon-remove").forEach(icon => {
                icon.addEventListener("click", function () {
                    let name = this.previousElementSibling.querySelector("h4").innerText;
                    wishlist = wishlist.filter(item => item.name !== name);
                    localStorage.setItem("wishlist", JSON.stringify(wishlist));

                    updateWishlistPopup();
                    restoreWishlistButtons();
                });
            });
        }
    }

    // Event Listener for Wishlist Button Clicks
    document.addEventListener("click", function (event) {
        if (event.target.closest(".wishlist-btn")) {
            event.preventDefault();
            let button = event.target.closest(".wishlist-btn");
            let productCard = button.closest(".product-card1");
            let productName = productCard.querySelector(".product-name").innerText;
            let productImage = productCard.querySelector(".product-image img").src;
            let productPrice = productCard.querySelector(".new-price span").innerText;

            let product = { name: productName, image: productImage, price: productPrice };
            let index = wishlist.findIndex(item => item.name === product.name);

            if (index === -1) {
                wishlist.push(product);
                button.querySelector("i").classList.add("wishlist-active");
            } else {
                wishlist.splice(index, 1);
                button.querySelector("i").classList.remove("wishlist-active");
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistPopup();
        }
    });

    // Open Wishlist Modal
    document.querySelector(".wishlist-icon").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("wishlistModal").style.display = "block";
        updateWishlistPopup();
    });

    // Close Wishlist Modal
    document.querySelector(".close-wishlist").addEventListener("click", function () {
        document.getElementById("wishlistModal").style.display = "none";
    });

    // Close modal when clicking outside
    window.onclick = function (event) {
        let modal = document.getElementById("wishlistModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Restore Wishlist UI on Page Load
    updateWishlistPopup();
    restoreWishlistButtons(); // Ensure buttons are updated correctly

    // Product Share Function
    let shareBtn = document.querySelector(".share-btn");
    if (shareBtn) {
        shareBtn.addEventListener("click", function (event) {
            event.preventDefault();
            if (navigator.share) {
                navigator.share({
                    title: "Lovable Hamper - PAVI'S LAB",
                    text: "Check out this amazing gift hamper from PAVI'S LAB! 🎁",
                    url: window.location.href
                }).catch((error) => console.error("Error sharing:", error));
            } else {
                alert("Sharing not supported on this browser.");
            }
        });
    }

    // WhatsApp Share Function
    let whatsappBtn = document.querySelector(".whatsapp-btn");
    if (whatsappBtn) {
        whatsappBtn.addEventListener("click", function (event) {
            event.preventDefault();
            const productURL = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("Check out this amazing gift hamper from PAVI'S LAB! 🎁");
            window.open(`https://api.whatsapp.com/send?text=${text} ${productURL}`, "_blank");
        });
    }


    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartIcon = document.getElementById("cartIcon");
    const cartModal = document.getElementById("cartModal");
    const closeCart = document.querySelector(".close-cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const checkoutBtn = document.querySelector(".checkout-btn");

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let totalAmount = 0; // Initialize total amount
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
            document.getElementById("cart-total").innerText = `Total: Rs. 0/-`;
            return;
        }
    
        cart.forEach((item, index) => {
            totalAmount += parseFloat(item.price) * item.quantity; // Calculate total
    
            let itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: Rs. ${item.price}/-</p>
                    <p>Quantity: <span class="quantity">${item.quantity}</span></p>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    
        // Update total amount in UI
        document.getElementById("cart-total").innerText = `Total: Rs. ${totalAmount}/-`;
    
        // Store total in sessionStorage
        sessionStorage.setItem("cartTotal", totalAmount);
    
        attachRemoveEvents(); // Ensure remove buttons work
    }
    

    function attachRemoveEvents() {
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        });
    }

    document.querySelectorAll(".cart-btn").forEach(button => {
        button.addEventListener("click", function () {
            let productCard = this.closest(".product-card1"); // Changed selector to .product-card1
            let name = productCard.querySelector(".product-name").innerText;
            let price = productCard.querySelector(".new-price span").innerText;
            let image = productCard.querySelector(".product-image img").src;

            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, quantity: 1 });
            }
            saveCart();
            alert("Item added to cart!");
        });
    });

    cartIcon.addEventListener("click", function () {
        cartModal.style.display = "block";
        renderCart();
    });

    closeCart.addEventListener("click", function () {
        cartModal.style.display = "none";
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            goToCheckout();
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === cartModal) {
            cartModal.style.display = "none";
        }
    });

    renderCart(); // Initial render of cart on page load


    
   function goToCheckout() {
        // Get total cart amount from localStorage (or your cart logic)
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        // Calculate total price
        let totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
     
        // Redirect to checkout page with total amount as a query parameter
        window.location.href = `checkout.html?total=${totalAmount}`;
    }
});