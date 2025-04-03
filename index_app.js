// Import auth functions
import { updateAuthUI } from './auth.js';

// Function to clear search
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const searchHint = document.getElementById('search-hint');
    if (searchInput && searchHint) {
        searchInput.value = '';
        searchHint.innerHTML = '';
        searchHint.style.display = 'none';
    }
}

// Function to provide search hints
function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const hints = ['Competitions', 'For Organizers', 'For Students', 'Summer Courses', 'Winners'];
            let filteredHints = hints.filter(hint => hint.toLowerCase().includes(searchTerm));
            let hintHtml = filteredHints.map(hint => `<div>${hint}</div>`).join('');
            const searchHint = document.getElementById('search-hint');
            
            if (searchHint) {
                searchHint.innerHTML = hintHtml;
                searchHint.style.display = filteredHints.length && searchTerm ? 'block' : 'none';
            }
            
            // Show clear button when there's text
            if (clearBtn) {
                clearBtn.style.display = searchTerm ? 'block' : 'none';
            }
        });
    }
    
    // Set up clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }
}

// Function to include HTML templates
function includeHTML() {
    const elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const file = element.getAttribute("w3-include-html");
        if (file) {
            fetch(file)
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Page not found');
                })
                .then(html => {
                    element.innerHTML = html;
                    element.removeAttribute("w3-include-html");
                    // Handle any callbacks for newly loaded content
                    includeHTML();
                    updateAuthUI();
                })
                .catch(error => {
                    element.innerHTML = "Page not found.";
                    element.removeAttribute("w3-include-html");
                });
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Include HTML templates if any
    includeHTML();
    
    // Set up search functionality
    setupSearchFunctionality();
    
    // Update UI based on auth state
    updateAuthUI();
});

// Export functions to be used in other modules
export {
    clearSearch,
    setupSearchFunctionality,
    includeHTML
};
