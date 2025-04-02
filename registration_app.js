// DOM elements
const userTypeOptions = document.querySelectorAll('.user-type-option');
const studentFields = document.querySelector('.student-fields');
const organizerFields = document.querySelector('.organizer-fields');
const form = document.getElementById('registration-form');
const statusMessage = document.getElementById('status-message');
const pinInput = document.getElementById('pin');
const confirmPinInput = document.getElementById('confirm-pin');

// Default user type
let currentUserType = 'student';
studentFields.style.display = 'block';

// User type switching
userTypeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        userTypeOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Update current user type
        currentUserType = option.getAttribute('data-type');
        
        // Show/hide relevant fields
        if (currentUserType === 'student') {
            studentFields.style.display = 'block';
            organizerFields.style.display = 'none';
        } else {
            studentFields.style.display = 'none';
            organizerFields.style.display = 'block';
        }
    });
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get common form values
    const email = document.getElementById('email').value;
    const pin = pinInput.value;
    const confirmPin = confirmPinInput.value;
    
    // Validate PIN match
    if (pin !== confirmPin) {
        showStatus("PINs do not match. Please try again.", 'error');
        return;
    }
    
    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(pin)) {
        showStatus("PIN must be 4-6 digits.", 'error');
        return;
    }
    
    try {
        // Create user with email and password (PIN)
        const userCredential = await auth.createUserWithEmailAndPassword(email, pin);
        const user = userCredential.user;
        
        // Prepare user data based on type
        let userData = {
            uid: user.uid,
            email,
            userType: currentUserType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add type-specific fields
        if (currentUserType === 'student') {
            userData = {
                ...userData,
                studentName: document.getElementById('student-name').value,
                parentName: document.getElementById('parent-name').value,
                parentPhone: document.getElementById('parent-phone').value
            };
            
            // Save to students collection
            await db.collection('students').doc(user.uid).set(userData);
        } else {
            userData = {
                ...userData,
                organizerName: document.getElementById('organizer-name').value,
                organization: document.getElementById('organization').value,
                phone: document.getElementById('organizer-phone').value
            };
            
            // Save to organizers collection
            await db.collection('organizers').doc(user.uid).set(userData);
        }
        
        // Display success message
        showStatus('Registration successful! Redirecting...', 'success');
        
        // Redirect or other actions could be added here
        setTimeout(() => {
            // Redirect to login page or dashboard
            // window.location.href = 'login.html';
            form.reset();
        }, 2000);
        
    } catch (error) {
        console.error('Error during registration:', error);
        showStatus(`Registration failed: ${error.message}`, 'error');
    }
});

// Helper function to show status messages
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    statusMessage.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}
