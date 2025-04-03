// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchHint = document.getElementById('searchHint');
const logoutModal = document.getElementById('logoutModal');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
    
    if (searchTerm) {
        const hints = ['Competitions', 'Science Competitions', 'Art Competitions', 'For Organizers', 'For Students', 'Summer Courses', 'Winners'];
        const filteredHints = hints.filter(hint => hint.toLowerCase().includes(searchTerm));
        
        if (filteredHints.length) {
            searchHint.innerHTML = filteredHints.map(hint => 
                `<div class="hint-item">${hint}</div>`
            ).join('');
            searchHint.style.display = 'block';
            
            // Add click event to hint items
            document.querySelectorAll('.hint-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    searchHint.style.display = 'none';
                });
            });
        } else {
            searchHint.style.display = 'none';
        }
    } else {
        searchHint.style.display = 'none';
    }
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchHint.style.display = 'none';
    clearSearchBtn.style.display = 'none';
});

// Click outside to close search hint
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
        searchHint.style.display = 'none';
    }
});

// Logout functions
window.handleLogout = function() {
    logoutModal.classList.add('active');
};

window.cancelLogout = function() {
    logoutModal.classList.remove('active');
};
