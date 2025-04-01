document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const messageElement = document.getElementById("message");
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");

    // ✅ Password show/hide toggle
    togglePassword.addEventListener("click", () => {
        passwordField.type = passwordField.type === "password" ? "text" : "password";
    });

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
            messageElement.innerHTML = "⚠️ Please fill in all fields.";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-api-key": "your_actual_api_key_here" // ✅ Ensure you pass the API Key
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                messageElement.innerHTML = "✅ Signup successful!";
                setTimeout(() => window.location.href = "login.html", 2000);
            } else {
                messageElement.innerHTML = `❌ ${data.message}`;
            }
        } catch (error) {
            messageElement.innerHTML = "❌ Error connecting to server.";
            console.error("🔥 Signup Error:", error);
        }
    });
});
