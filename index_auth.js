// Import Firebase SDK
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

// Firebase configuration
// Security Best Practice: Don't hardcode the API keys in your JavaScript
// Load the Firebase configuration from a separate JSON file or environment variables

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlYM8lU1844ushiA7A3FtQPEtreQjJ30I",
  authDomain: "letsgoto-a630e.firebaseapp.com",
  projectId: "letsgoto-a630e",
  storageBucket: "letsgoto-a630e.firebasestorage.app",
  messagingSenderId: "194513214154",
  appId: "1:194513214154:web:7825241b22095d7c43f233",
  measurementId: "G-N8CN6LM82S"
};    


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle logout function
function handleLogout() {
    // Show confirmation modal
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'block';
}

// Confirm logout function
async function confirmLogout() {
    // Close modal
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'none';
    
    // Show loading indicator
    const logoutText = document.getElementById('logoutText');
    if (logoutText) {
        logoutText.innerHTML = 'Logging out...';
    }
    
    try {
        await signOut(auth);
        // Sign-out successful
        sessionStorage.setItem('isLoggedIn', 'false');
        sessionStorage.removeItem('userId');
        updateAuthUI();
        
        // Show success message before redirecting
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.innerHTML = '<div class="logout-success">Logout successful!</div>';
        }
        
        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (error) {
        // An error happened
        console.error("Logout error:", error);
        if (logoutText) {
            logoutText.innerHTML = 'Logout failed. Try again';
        }
    }
}

// Cancel logout function
function cancelLogout() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'none';
}

// Update UI based on authentication state
function updateAuthUI() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const authLinks = document.querySelector('.auth-links');
    const proceedButtons = document.querySelectorAll('.proceed-button a[href*="registration.html"]');
    
    if (authLinks) {
        if (isLoggedIn) {
            // Get user info if available
            const user = auth.currentUser;
            const displayName = user ? (user.displayName || user.email || 'User') : 'User';
            
            // Replace login/signup links with user menu
            authLinks.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-button">
                        <img src="https://img.icons8.com/ios-glyphs/30/000000/user-male-circle.png" alt="User">
                        <span id="logoutText">${displayName}</span>
                    </button>
                    <div class="user-dropdown">
                        <a href="profile.html">Profile</a>
                        <a href="my_competitions.html">My Competitions</a>
                        <a href="#" id="logout-link">Logout</a>
                    </div>
                </div>
            `;
            
            // Add event listener to the logout link
            document.getElementById('logout-link')?.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        } else {
            // Show login/signup links for logged out users
            authLinks.innerHTML = `
                <a href="registration.html" id="signup-link">Sign Up</a>
                <a href="login.html" id="login-link">Login</a>
            `;
        }
    }
    
    // Update proceed buttons for logged-in users
    if (proceedButtons.length > 0) {
        proceedButtons.forEach(button => {
            if (isLoggedIn) {
                // If user is logged in, update links to go directly to relevant pages
                if (button.getAttribute('href').includes('category=organizer')) {
                    button.textContent = 'Create Competition';
                    button.href = 'competition_form.html';
                } else if (button.getAttribute('href').includes('category=student')) {
                    button.textContent = 'Browse Competitions';
                    button.href = 'competition_dashboard.html';
                }
            } else {
                // Keep original text for non-logged in users
                if (button.getAttribute('href').includes('category=organizer')) {
                    button.textContent = 'Proceed to Sign Up or Log In';
                } else if (button.getAttribute('href').includes('category=student')) {
                    button.textContent = 'Proceed to Sign Up or Log In';
                }
            }
        });
    }
}

// Set up authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', user.uid);
        
        // Optionally store display name if available
        if (user.displayName) {
            sessionStorage.setItem('userDisplayName', user.displayName);
        }
    } else {
        // User is signed out
        sessionStorage.setItem('isLoggedIn', 'false');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userDisplayName');
    }
    updateAuthUI();
});

// Set up event listeners for logout modal
document.addEventListener('DOMContentLoaded', () => {
    // Set up the logout confirmation buttons
    document.getElementById('confirm-logout-btn')?.addEventListener('click', confirmLogout);
    document.getElementById('cancel-logout-btn')?.addEventListener('click', cancelLogout);
});

// Export functions to be used in other modules
export { 
    handleLogout,
    confirmLogout,
    cancelLogout,
    updateAuthUI,
    auth
};
