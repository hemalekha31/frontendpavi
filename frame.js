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
            let productCard = button.closest(".product-card");
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
            let productCard = button.closest(".product-card");
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
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
                return;
            }
            cart.forEach((item, index) => {
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
            attachRemoveEvents();
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
                let productCard = this.closest(".product-card");
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
    
    
    
        window.addEventListener("click", function (event) {
            if (event.target === cartModal) {
                cartModal.style.display = "none";
            }
        });
    });


    const accountModal = document.getElementById("accountModal");
    const modalTitle = document.getElementById("modalTitle");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");
    const closeButtons = document.querySelectorAll(".close");
    const accountIcon = document.querySelector(".fa-user"); // Fixed undefined reference

    // Open modal when user clicks the account icon
    accountIcon.addEventListener("click", function () {
        accountModal.style.display = "flex";
        checkLoginStatus(); // Check if user is logged in
    });

    // Close modal when clicking the close button
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            accountModal.style.display = "none";
        });
    });

    // Switch to Sign Up Form
    

    // Check if the user is logged in
    function checkLoginStatus() {
        const user = localStorage.getItem("loggedInUser");
        if (user) {
            const userData = JSON.parse(user);
            modalTitle.innerText = "Account";
            loginForm.style.display = "none";
            signupForm.style.display = "none";
            accountModal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Welcome, ${userData.name}!</h2>
                    <p>Email: ${userData.email}</p>
                    <button id="logoutBtn">Logout</button>
                </div>
            `;

            document.getElementById("logoutBtn").addEventListener("click", function () {
                localStorage.removeItem("loggedInUser");
                location.reload(); // Refresh page after logout
            });

            // Close modal when clicking close (needs to be reattached since modal content changes)
            document.querySelector(".close").addEventListener("click", function () {
                accountModal.style.display = "none";
            });
        } else {
            // Show login form if not logged in
            modalTitle.innerText = "Login";
            loginForm.style.display = "block";
            signupForm.style.display = "none";
        }
    }

    // Handle Login
    
// Vue.js Component for Navbar
new Vue({
    el: ".nav-bar",
    data() {
        return {
            isLoggedIn: false,
            user: null,
        };
    },
    mounted() {
        this.checkLoginStatus();
    },
    methods: {
        checkLoginStatus() {
            const userData = localStorage.getItem("loggedInUser");
            if (userData) {
                this.isLoggedIn = true;
                this.user = JSON.parse(userData);
            }
        },
        handleAccountClick() {
            if (this.isLoggedIn) {
                alert(`Welcome, ${this.user.name}!`); // Show account details
            } else {
                document.getElementById("accountModal").style.display = "block"; // Show login modal
            }
        }
    }
});



function goToCheckout(event) {
    // Find the closest product-card of the clicked button
    let productCard = event.target.closest(".product-card");

    // Ensure product card exists before proceeding
    if (!productCard) return;

    // Get product details
    let productName = productCard.querySelector(".product-name").innerText;
    let productPrice = productCard.querySelector(".new-price span").innerText.trim().replace("/-", ""); // Ensure correct price is taken from this product

    console.log("Product:", productName, "Price:", productPrice); // Debugging log

    // Redirect to checkout page with correct product details
    window.location.href = `checkout.html?product=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}`;
}

// Attach event listeners to all buy buttons after page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".buy-btn").forEach(button => {
        button.addEventListener("click", goToCheckout);
    });
});
