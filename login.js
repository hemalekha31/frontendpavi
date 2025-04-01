document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent page refresh

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("⚠️ Please enter both email and password.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "b12061391c2ee1c1369af80e74fe42d9c937d29c4fac81faab419708ac9f64d1", // Ensure this matches backend key
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ Login successful");
                    localStorage.setItem("token", data.token); // Save JWT token
                    window.location.href = "account.html"; // Redirect after login
                } else {
                    alert(`❌ Login failed: ${data.message}`);
                }
            } catch (error) {
                console.error("🔥 Login error:", error);
                alert("❌ An error occurred while logging in.");
            }
        });
    } else {
        console.error("❌ loginBtn not found! Check your HTML.");
    }
});
