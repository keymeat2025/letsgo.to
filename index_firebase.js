import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

// Firebase configuration

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

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', user.uid);
        updateAuthUI();
    } else {
        sessionStorage.setItem('isLoggedIn', 'false');
        sessionStorage.removeItem('userId');
        updateAuthUI();
    }
});

// Update UI based on auth state
window.updateAuthUI = function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const authLinks = document.getElementById('authLinks');
    
    if (authLinks) {
        if (isLoggedIn) {
            const user = auth.currentUser;
            const displayName = user ? (user.displayName || user.email || 'User') : 'User';
            const initials = displayName.charAt(0).toUpperCase();
            
            authLinks.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-button">
                        <div class="user-avatar">${initials}</div>
                        <span id="userDisplayName">${displayName}</span>
                        <i class="fas fa-chevron-down" style="margin-left: 5px; font-size: 12px;"></i>
                    </button>
                    <div class="user-dropdown">
                        <a href="profile.html" class="dropdown-item">
                            <i class="fas fa-user"></i>
                            Profile
                        </a>
                        <a href="my_competitions.html" class="dropdown-item">
                            <i class="fas fa-trophy"></i>
                            My Competitions
                        </a>
                        <a href="notifications.html" class="dropdown-item">
                            <i class="fas fa-bell"></i>
                            Notifications
                        </a>
                        <hr style="margin: 5px 0; border: none; border-top: 1px solid var(--gray);">
                        <a href="#" onclick="handleLogout(); return false;" class="dropdown-item logout">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </a>
                    </div>
                </div>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="register.html" class="auth-link signup-link" id="signupLink">Sign Up</a>
                <a href="login.html" class="auth-link login-link" id="loginLink">Login</a>
            `;
        }
    }
};

// Logout function
window.confirmLogout = function() {
    logoutModal.classList.remove('active');
    
    signOut(auth).then(() => {
        sessionStorage.setItem('isLoggedIn', 'false');
        sessionStorage.removeItem('userId');
        
        // Show success toast or notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--success);
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 1000;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        `;
        notification.innerHTML = 'Logged out successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            window.location.href = "index.html";
        }, 3000);
        
        updateAuthUI();
    }).catch((error) => {
        console.error("Logout error:", error);
        alert('Logout failed. Please try again.');
    });
};
