// ✅ Add to Wishlist Function
async function addToWishlist(productId) {
    try {
        const response = await fetch("http://localhost:5000/api/wishlist", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ product_id: productId })
        });

        if (response.ok) {
            console.log(`✅ Product ${productId} added to wishlist`);
            fetchWishlist(); // Refresh wishlist UI
        } else {
            console.error("❌ Failed to add item to wishlist");
        }
    } catch (error) {
        console.error("🔥 Error adding to wishlist:", error);
    }
}

// ✅ Event Listener for All Wishlist Buttons
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const productId = this.getAttribute("data-product-id"); // Get product ID dynamically
            addToWishlist(productId);
        });
    });
});
