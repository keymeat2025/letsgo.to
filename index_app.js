import { auth, signOut, onAuthStateChanged } from './firebase-config.js';

window.handleLogout = function() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'block';
};

window.confirmLogout = function() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'none';
    
    const logoutText = document.getElementById('logoutText');
    if (logoutText) {
        logoutText.innerHTML = 'Logging out...';
    }
    
    signOut(auth).then(() => {
        sessionStorage.setItem('isLoggedIn', 'false');
        sessionStorage.removeItem('userId');
        updateAuthUI();
        
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.innerHTML = '<div class="logout-success">Logout successful!</div>';
        }
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }).catch((error) => {
        console.error("Logout error:", error);
        if (logoutText) {
            logoutText.innerHTML = 'Logout failed. Try again';
        }
    });
};

window.cancelLogout = function() {
    const modal = document.getElementById('logoutModal');
    modal.style.display = 'none';
};

window.updateAuthUI = function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const authLinks = document.querySelector('.auth-links');
    const proceedButtons = document.querySelectorAll('.proceed-button a[href*="registration.html"]');
    
    if (authLinks) {
        if (isLoggedIn) {
            const user = auth.currentUser;
            const displayName = user ? (user.displayName || user.email || 'User') : 'User';
            
            authLinks.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-button">
                        <img src="https://img.icons8.com/ios-glyphs/30/000000/user-male-circle.png" alt="User">
                        <span id="logoutText">${displayName}</span>
                    </button>
                    <div class="user-dropdown">
                        <a href="profile.html">Profile</a>
                        <a href="my_competitions.html">My Competitions</a>
                        <a href="#" onclick="handleLogout(); return false;">Logout</a>
                    </div>
                </div>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="registration.html" id="signup-link">Sign Up</a>
                <a href="login.html" id="login-link">Login</a>
            `;
        }
    }
    
    if (proceedButtons) {
        proceedButtons.forEach(button => {
            if (isLoggedIn) {
                if (button.getAttribute('href').includes('category=organizer')) {
                    button.textContent = 'Create Competition';
                    button.href = 'competition_form.html';
                } else if (button.getAttribute('href').includes('category=student')) {
                    button.textContent = 'Browse Competitions';
                    button.href = 'competition_dashboard.html';
                }
            } else {
                if (button.getAttribute('href').includes('category=organizer')) {
                    button.textContent = 'Proceed to Sign Up or Log In';
                } else if (button.getAttribute('href').includes('category=student')) {
                    button.textContent = 'Proceed to Sign Up or Log In';
                }
            }
        });
    }
};

window.onload = function() {
    includeHTML();
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userId', user.uid);
            
            if (user.displayName) {
                sessionStorage.setItem('userDisplayName', user.displayName);
            }
        } else {
            sessionStorage.setItem('isLoggedIn', 'false');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userDisplayName');
        }
        updateAuthUI();
    });
};

function includeHTML() {
    const z = document.getElementsByTagName("*");
    for (let i = 0; i < z.length; i++) {
        const elmnt = z[i];
        const file = elmnt.getAttribute("w3-include-html");
        if (file) {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                    if (typeof updateAuthUI === 'function') {
                        updateAuthUI();
                    }
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}
